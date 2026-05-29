import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OreExtraction } from './entities/ore-extraction.entity';
import { HazardZone } from './entities/hazard-zone.entity';

@Injectable()
export class MiningService {
  constructor(
    @InjectRepository(OreExtraction)
    private oreRepo: Repository<OreExtraction>,
    @InjectRepository(HazardZone)
    private hazardRepo: Repository<HazardZone>,
  ) {}

  async recordOreExtraction(organizationId: string, mineId: string, data: any) {
    const extraction = this.oreRepo.create({
      organizationId,
      mineId,
      oreExtracted: data.oreExtracted,
      oreGrade: data.oreGrade,
      extractionMethod: data.extractionMethod,
      qualityAssay: data.qualityAssay || {},
      extractionRate: data.oreExtracted / (data.hoursWorked || 1),
      equipmentUsed: data.equipmentUsed || [],
      costPerTon: data.costPerTon || 0,
    });
    return this.oreRepo.save(extraction) as unknown as OreExtraction;
  }

  async createHazardZone(organizationId: string, mineId: string, zone: any) {
    const hazardZone = this.hazardRepo.create({
      organizationId,
      mineId,
      zoneName: zone.zoneName,
      location: zone.location || {},
      hazards: zone.hazards || [],
      riskScore: this.calculateRiskScore(zone.hazards || []),
      accessRestrictions: zone.accessRestrictions || {},
      safetyProtocols: zone.safetyProtocols || [],
      status: 'monitored',
    });
    return this.hazardRepo.save(hazardZone) as unknown as HazardZone;
  }

  async getExtractionData(organizationId: string, mineId: string) {
    return this.oreRepo.find({
      where: { organizationId, mineId },
      order: { recordedAt: 'DESC' },
      take: 10,
    });
  }

  async getHazardZones(organizationId: string, mineId: string) {
    return this.hazardRepo.find({
      where: { organizationId, mineId },
    });
  }

  private calculateRiskScore(hazards: any[]): number {
    const severityMap: Record<string, number> = { low: 10, medium: 25, high: 50, critical: 100 };
    return (
      hazards.reduce((sum: number, h: any) => sum + (severityMap[h.severity] || 0), 0) / Math.max(hazards.length, 1)
    );
  }
}
