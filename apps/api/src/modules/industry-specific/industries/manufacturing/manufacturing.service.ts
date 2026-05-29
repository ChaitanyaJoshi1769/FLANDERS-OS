import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionMetrics } from './entities/production-metrics.entity';

@Injectable()
export class ManufacturingService {
  constructor(
    @InjectRepository(ProductionMetrics)
    private metricsRepo: Repository<ProductionMetrics>,
  ) {}

  async recordProductionMetrics(organizationId: string, lineId: string, data: any) {
    const efficiency = (data.unitsProduced / data.targetUnits) * 100;
    const metrics = this.metricsRepo.create({
      organizationId,
      lineId,
      unitsProduced: data.unitsProduced,
      targetUnits: data.targetUnits,
      defectRate: data.defectRate || 0,
      downtime: data.downtime || 0,
      cycleTime: data.cycleTime || 0,
      equipmentStatus: data.equipmentStatus || [],
      qualityMetrics: data.qualityMetrics || {},
      efficiency,
    });
    return this.metricsRepo.save(metrics) as unknown as ProductionMetrics;
  }

  async getProductionReport(organizationId: string, lineId: string, days: number = 7) {
    const metrics = await this.metricsRepo.find({
      where: { organizationId, lineId },
      order: { recordedAt: 'DESC' },
      take: days * 24,
    });

    return {
      lineId,
      period: `last_${days}_days`,
      totalUnitsProduced: metrics.reduce((sum: number, m: any) => sum + m.unitsProduced, 0),
      averageEfficiency: metrics.reduce((sum: number, m: any) => sum + m.efficiency, 0) / metrics.length,
      averageDefectRate: metrics.reduce((sum: number, m: any) => sum + m.defectRate, 0) / metrics.length,
      totalDowntime: metrics.reduce((sum: number, m: any) => sum + m.downtime, 0),
    };
  }

  async getEquipmentStatus(organizationId: string, lineId: string) {
    const latest = await this.metricsRepo.findOne({
      where: { organizationId, lineId },
      order: { recordedAt: 'DESC' },
    });
    return latest?.equipmentStatus || [];
  }
}
