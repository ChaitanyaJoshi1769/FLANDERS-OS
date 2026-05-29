import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteData } from './entities/site-data.entity';
import { SafetyCompliance } from './entities/safety-compliance.entity';
import { EquipmentTracking } from './entities/equipment-tracking.entity';

@Injectable()
export class ConstructionService {
  constructor(
    @InjectRepository(SiteData)
    private siteDataRepo: Repository<SiteData>,
    @InjectRepository(SafetyCompliance)
    private safetyRepo: Repository<SafetyCompliance>,
    @InjectRepository(EquipmentTracking)
    private equipmentRepo: Repository<EquipmentTracking>,
  ) {}

  async recordSiteData(organizationId: string, siteId: string, data: any) {
    const siteData = this.siteDataRepo.create({
      organizationId,
      siteId,
      projectName: data.projectName,
      workers: data.workers || [],
      progressPercentage: data.progressPercentage,
      equipmentOnSite: data.equipmentOnSite || [],
      materials: data.materials || [],
    });
    return this.siteDataRepo.save(siteData) as unknown as SiteData;
  }

  async recordSafetyCompliance(organizationId: string, siteId: string, compliance: any) {
    const safetyCompliance = this.safetyRepo.create({
      organizationId,
      siteId,
      dailyInspections: compliance.dailyInspections || [],
      incidents: compliance.incidents || [],
      safetyScore: this.calculateSafetyScore(compliance),
      certifications: compliance.certifications || [],
      complianceStatus: compliance.complianceStatus || 'compliant',
    });
    return this.safetyRepo.save(safetyCompliance) as unknown as SafetyCompliance;
  }

  async trackEquipment(organizationId: string, equipmentId: string, data: any) {
    const equipment = this.equipmentRepo.create({
      organizationId,
      equipmentId,
      equipmentType: data.equipmentType,
      siteId: data.siteId,
      location: data.location || {},
      utilizationRate: data.utilizationRate || 0,
      maintenanceHistory: data.maintenanceHistory || [],
      status: data.status || 'operational',
    });
    return this.equipmentRepo.save(equipment) as unknown as EquipmentTracking;
  }

  async getSiteData(organizationId: string, siteId: string) {
    return this.siteDataRepo.findOne({
      where: { organizationId, siteId },
      order: { recordedAt: 'DESC' },
    });
  }

  async getSafetyCompliance(organizationId: string, siteId: string) {
    return this.safetyRepo.findOne({
      where: { organizationId, siteId },
    });
  }

  private calculateSafetyScore(compliance: any): number {
    const incidents = (compliance.incidents || []).length;
    const inspectionsPassed = (compliance.dailyInspections || []).filter(
      (i: any) => i.issues.length === 0,
    ).length;
    return Math.max(0, 100 - incidents * 10 + inspectionsPassed * 2);
  }
}
