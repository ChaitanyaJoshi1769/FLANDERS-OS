import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryTracking } from './entities/delivery-tracking.entity';

@Injectable()
export class LogisticsService {
  constructor(
    @InjectRepository(DeliveryTracking)
    private deliveryRepo: Repository<DeliveryTracking>,
  ) {}

  async trackDelivery(organizationId: string, vehicleId: string, data: any) {
    const fuelEconomy = data.distance / data.fuelConsumption;
    const routeEfficiency = (data.estimatedTime / data.actualTime) * 100;

    const delivery = this.deliveryRepo.create({
      organizationId,
      vehicleId,
      deliveryId: data.deliveryId,
      pickupLocation: data.pickupLocation,
      deliveryLocation: data.deliveryLocation,
      distance: data.distance,
      estimatedTime: data.estimatedTime,
      actualTime: data.actualTime,
      fuelConsumption: data.fuelConsumption,
      fuelEconomy,
      routeEfficiency,
      status: data.status || 'pending',
    });
    return this.deliveryRepo.save(delivery) as unknown as DeliveryTracking;
  }

  async getDeliveryMetrics(organizationId: string, vehicleId: string, days: number = 7) {
    const deliveries = await this.deliveryRepo.find({
      where: { organizationId, vehicleId },
      order: { recordedAt: 'DESC' },
      take: days * 10,
    });

    return {
      vehicleId,
      period: `last_${days}_days`,
      totalDeliveries: deliveries.length,
      averageFuelEconomy: deliveries.reduce((sum: number, d: any) => sum + d.fuelEconomy, 0) / deliveries.length,
      averageRouteEfficiency:
        deliveries.reduce((sum: number, d: any) => sum + d.routeEfficiency, 0) / deliveries.length,
      totalDistance: deliveries.reduce((sum: number, d: any) => sum + d.distance, 0),
    };
  }

  async getFleetPerformance(organizationId: string) {
    const allDeliveries = await this.deliveryRepo.find({
      where: { organizationId },
      order: { recordedAt: 'DESC' },
      take: 100,
    });

    const vehicleMetrics: Record<string, any> = {};
    allDeliveries.forEach((d: any) => {
      if (!vehicleMetrics[d.vehicleId]) {
        vehicleMetrics[d.vehicleId] = {
          deliveries: 0,
          totalDistance: 0,
          totalFuelConsumption: 0,
          totalTime: 0,
        };
      }
      vehicleMetrics[d.vehicleId].deliveries++;
      vehicleMetrics[d.vehicleId].totalDistance += d.distance;
      vehicleMetrics[d.vehicleId].totalFuelConsumption += d.fuelConsumption;
      vehicleMetrics[d.vehicleId].totalTime += d.actualTime;
    });

    return {
      fleetSize: Object.keys(vehicleMetrics).length,
      vehicles: Object.entries(vehicleMetrics).map(([vehicleId, metrics]: [string, any]) => ({
        vehicleId,
        ...metrics,
        fuelEconomy: metrics.totalDistance / metrics.totalFuelConsumption,
      })),
    };
  }
}
