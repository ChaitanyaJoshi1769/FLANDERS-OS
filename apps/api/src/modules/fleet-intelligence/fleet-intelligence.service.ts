import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from '../machines/machine.entity';
import { Fleet } from '../fleets/fleet.entity';
import { SensorEvent } from '../telemetry/entities/sensor-event.entity';
import { OperationalMetric } from '../telemetry/entities/operational-metric.entity';

@Injectable()
export class FleetIntelligenceService {
  constructor(
    @InjectRepository(Fleet)
    private fleetRepository: Repository<Fleet>,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
    @InjectRepository(SensorEvent)
    private sensorEventRepository: Repository<SensorEvent>,
    @InjectRepository(OperationalMetric)
    private operationalMetricRepository: Repository<OperationalMetric>
  ) {}

  async getFleetHealth(fleetId: string): Promise<any> {
    const fleet = await this.fleetRepository.findOne({
      where: { id: fleetId },
      relations: ['machines'],
    });

    if (!fleet) return null;

    const machines = fleet.machines || [];
    const totalMachines = machines.length;

    const machineHealthMetrics = await Promise.all(
      machines.map((m) => this.getMachineHealth(m.id))
    );

    const statusCounts = {
      active: machineHealthMetrics.filter((m) => m.status === 'active').length,
      maintenance: machineHealthMetrics.filter(
        (m) => m.status === 'maintenance'
      ).length,
      inactive: machineHealthMetrics.filter((m) => m.status === 'inactive')
        .length,
      offline: machineHealthMetrics.filter((m) => m.status === 'offline')
        .length,
    };

    const avgUtilization =
      machineHealthMetrics.reduce((sum, m) => sum + (m.utilization || 0), 0) /
      (machineHealthMetrics.length || 1);

    const criticalAnomalies = machineHealthMetrics.reduce(
      (sum, m) => sum + (m.anomalies || 0),
      0
    );

    return {
      fleetId,
      fleetName: fleet.name,
      totalMachines,
      statusCounts,
      averageUtilization: Math.round(avgUtilization),
      criticalAnomalies,
      machineHealthMetrics,
      health: this.calculateFleetHealthScore(statusCounts, criticalAnomalies),
      lastUpdate: new Date(),
    };
  }

  async getMachineHealth(machineId: string): Promise<any> {
    const machine = await this.machineRepository.findOne({
      where: { id: machineId },
    });

    if (!machine) return null;

    const latestMetric = await this.operationalMetricRepository.findOne({
      where: { machineId },
      order: { timestamp: 'DESC' },
    });

    const criticalEvents = await this.sensorEventRepository.count({
      where: {
        machineId,
        status: 'critical',
      },
    });

    return {
      machineId,
      machineName: machine.name,
      status: machine.status,
      serialNumber: machine.serialNumber,
      operatingHours: machine.operatingHours,
      batteryLevel: machine.batteryLevel,
      utilization: latestMetric?.utilizationPercent || 0,
      temperature: latestMetric?.temperatureCelsius,
      vibration: latestMetric?.vibrationLevel,
      anomalies: criticalEvents,
      lastUpdate: machine.lastTelemetryAt || new Date(),
    };
  }

  async getFleetUtilizationTrend(
    fleetId: string,
    hoursBack: number = 24
  ): Promise<any> {
    const fleet = await this.fleetRepository.findOne({
      where: { id: fleetId },
      relations: ['machines'],
    });

    if (!fleet) return null;

    const machineIds = (fleet.machines || []).map((m) => m.id);
    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    const metrics = await this.operationalMetricRepository.find({
      where: { machineId: machineIds as any },
    });

    const filtered = metrics.filter((m) => m.timestamp >= cutoffTime);

    const hourlyAverages = {};
    for (const metric of filtered) {
      const hour = new Date(metric.timestamp);
      hour.setMinutes(0, 0, 0);
      const hourKey = hour.toISOString();

      if (!hourlyAverages[hourKey]) {
        hourlyAverages[hourKey] = {
          utilizationValues: [],
          fuelValues: [],
          temperatureValues: [],
        };
      }

      if (metric.utilizationPercent)
        hourlyAverages[hourKey].utilizationValues.push(
          metric.utilizationPercent
        );
      if (metric.fuelConsumptionRate)
        hourlyAverages[hourKey].fuelValues.push(metric.fuelConsumptionRate);
      if (metric.temperatureCelsius)
        hourlyAverages[hourKey].temperatureValues.push(
          metric.temperatureCelsius
        );
    }

    const trend = Object.entries(hourlyAverages).map(([hour, values]: any) => ({
      timestamp: hour,
      averageUtilization: Math.round(
        values.utilizationValues.reduce((a, b) => a + b, 0) /
          (values.utilizationValues.length || 1)
      ),
      averageFuelConsumption: (
        values.fuelValues.reduce((a, b) => a + b, 0) /
        (values.fuelValues.length || 1)
      ).toFixed(2),
      averageTemperature: (
        values.temperatureValues.reduce((a, b) => a + b, 0) /
        (values.temperatureValues.length || 1)
      ).toFixed(1),
    }));

    return {
      fleetId,
      timeRange: { from: cutoffTime, to: new Date() },
      hoursBack,
      trend: trend.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    };
  }

  private calculateFleetHealthScore(
    statusCounts: any,
    criticalAnomalies: number
  ): string {
    const total =
      statusCounts.active +
      statusCounts.maintenance +
      statusCounts.inactive +
      statusCounts.offline;
    const activeRatio = statusCounts.active / (total || 1);

    if (criticalAnomalies > total * 0.3) return 'critical';
    if (activeRatio < 0.6) return 'degraded';
    if (activeRatio < 0.8) return 'warning';
    return 'healthy';
  }
}
