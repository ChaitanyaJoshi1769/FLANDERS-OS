import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorEvent } from './entities/sensor-event.entity';
import { OperationalMetric } from './entities/operational-metric.entity';
import { Kafka, Partitioners } from 'kafkajs';

@Injectable()
export class TelemetryService {
  private kafka: Kafka;
  private kafkaProducer: any;

  constructor(
    @InjectRepository(SensorEvent)
    private sensorEventRepository: Repository<SensorEvent>,
    @InjectRepository(OperationalMetric)
    private operationalMetricRepository: Repository<OperationalMetric>
  ) {
    this.initializeKafka();
  }

  private async initializeKafka() {
    this.kafka = new Kafka({
      clientId: 'flanders-telemetry',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.kafkaProducer = this.kafka.producer({
      idempotent: true,
      transactionTimeout: 30000,
    });

    await this.kafkaProducer.connect();
  }

  async ingestSensorEvent(machineId: string, eventData: any) {
    const sensorEvent = this.sensorEventRepository.create({
      machineId,
      sensorName: eventData.sensorName,
      value: eventData.value,
      unit: eventData.unit,
      status: this.determineStatus(eventData.value, eventData.minThreshold, eventData.maxThreshold),
      timestamp: new Date(),
      metadata: eventData.metadata || {},
    });

    await this.sensorEventRepository.save(sensorEvent);

    await this.kafkaProducer.send({
      topic: 'telemetry-events',
      messages: [
        {
          key: machineId,
          value: JSON.stringify({
            machineId,
            eventType: 'sensor_reading',
            data: sensorEvent,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    return sensorEvent;
  }

  async ingestOperationalMetrics(machineId: string, metrics: any) {
    const operationalMetric = this.operationalMetricRepository.create({
      machineId,
      utilizationPercent: metrics.utilizationPercent,
      fuelConsumptionRate: metrics.fuelConsumptionRate,
      powerOutput: metrics.powerOutput,
      cycleTimeSeconds: metrics.cycleTimeSeconds,
      payloadWeight: metrics.payloadWeight,
      temperatureCelsius: metrics.temperatureCelsius,
      vibrationLevel: metrics.vibrationLevel,
      timestamp: new Date(),
    });

    await this.operationalMetricRepository.save(operationalMetric);

    await this.kafkaProducer.send({
      topic: 'operational-metrics',
      messages: [
        {
          key: machineId,
          value: JSON.stringify({
            machineId,
            eventType: 'operational_metric',
            data: operationalMetric,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    return operationalMetric;
  }

  async getMachineTelemetry(machineId: string, limit: number = 100) {
    const sensorEvents = await this.sensorEventRepository.find({
      where: { machineId },
      order: { timestamp: 'DESC' },
      take: limit,
    });

    const metrics = await this.operationalMetricRepository.find({
      where: { machineId },
      order: { timestamp: 'DESC' },
      take: limit,
    });

    return {
      machineId,
      sensorEvents,
      operationalMetrics: metrics,
      lastUpdate: new Date(),
    };
  }

  async getMachineLatestTelemetry(machineId: string) {
    const latestSensorEvent = await this.sensorEventRepository.findOne({
      where: { machineId },
      order: { timestamp: 'DESC' },
    });

    const latestMetric = await this.operationalMetricRepository.findOne({
      where: { machineId },
      order: { timestamp: 'DESC' },
    });

    return {
      machineId,
      latestSensorEvent,
      latestMetric,
    };
  }

  async getAnomalies(machineId: string, limit: number = 50) {
    const anomalies = await this.sensorEventRepository.find({
      where: {
        machineId,
        status: 'critical' || 'degraded',
      },
      order: { timestamp: 'DESC' },
      take: limit,
    });

    return anomalies;
  }

  private determineStatus(value: number, min: number, max: number): string {
    if (!min || !max) return 'healthy';
    if (value < min || value > max) return 'critical';
    if (value < min + (max - min) * 0.1 || value > max - (max - min) * 0.1) return 'degraded';
    return 'healthy';
  }
}
