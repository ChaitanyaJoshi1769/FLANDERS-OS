import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustryConfiguration } from './entities/industry-configuration.entity';

@Injectable()
export class IndustrySpecificService {
  constructor(
    @InjectRepository(IndustryConfiguration)
    private configRepo: Repository<IndustryConfiguration>,
  ) {}

  async setupIndustryConfiguration(organizationId: string, industry: string, config: any) {
    const configuration = this.configRepo.create({
      organizationId,
      industry: industry as any,
      configuration: config,
      customMetrics: this.getIndustryMetrics(industry),
      complianceRequirements: this.getComplianceRequirements(industry),
      workflowTemplates: this.getWorkflowTemplates(industry),
      status: 'active',
    });
    return this.configRepo.save(configuration) as unknown as IndustryConfiguration;
  }

  async getConfiguration(organizationId: string, industry: string) {
    return this.configRepo.findOne({
      where: { organizationId, industry: industry as any },
    });
  }

  async updateConfiguration(organizationId: string, industry: string, updates: any) {
    const config = await this.configRepo.findOne({
      where: { organizationId, industry: industry as any },
    });
    if (!config) {
      return null;
    }
    Object.assign(config, updates);
    return this.configRepo.save(config) as unknown as IndustryConfiguration;
  }

  private getIndustryMetrics(industry: string): any[] {
    const metricsMap: Record<string, any[]> = {
      construction: [
        { name: 'safety_incidents', formula: 'count', unit: 'incidents' },
        { name: 'site_productivity', formula: 'work_hours / total_hours', unit: 'percentage' },
        { name: 'equipment_utilization', formula: 'active_time / total_time', unit: 'percentage' },
      ],
      mining: [
        { name: 'ore_grade', formula: 'assay_value', unit: 'percentage' },
        { name: 'extraction_rate', formula: 'ore_extracted / time', unit: 'tons/hour' },
        { name: 'hazard_score', formula: 'incidents / shifts', unit: 'score' },
      ],
      agriculture: [
        { name: 'crop_health', formula: 'ndvi_index', unit: 'index' },
        { name: 'irrigation_efficiency', formula: 'water_output / total_water', unit: 'percentage' },
        { name: 'yield_prediction', formula: 'ml_model_output', unit: 'kg/hectare' },
      ],
      manufacturing: [
        { name: 'production_rate', formula: 'units / time', unit: 'units/hour' },
        { name: 'defect_rate', formula: 'defects / total_units', unit: 'percentage' },
        { name: 'downtime', formula: 'unplanned_stops / total_time', unit: 'percentage' },
      ],
      logistics: [
        { name: 'delivery_time', formula: 'actual_time - planned_time', unit: 'minutes' },
        { name: 'fuel_economy', formula: 'distance / fuel_consumed', unit: 'km/liter' },
        { name: 'route_efficiency', formula: 'optimal_distance / actual_distance', unit: 'percentage' },
      ],
    };
    return metricsMap[industry] || [];
  }

  private getComplianceRequirements(industry: string): any {
    const complianceMap: Record<string, any> = {
      construction: {
        regulations: ['OSHA', 'Local building codes', 'Safety standards'],
        auditFrequency: 'quarterly',
        requiredDocumentation: ['Safety plans', 'Incident reports', 'Training logs'],
      },
      mining: {
        regulations: ['Mine Safety and Health Administration', 'Environmental Protection Agency'],
        auditFrequency: 'monthly',
        requiredDocumentation: ['Hazard assessments', 'Incident reports', 'Environmental monitoring'],
      },
      agriculture: {
        regulations: ['EPA', 'USDA', 'Local water regulations'],
        auditFrequency: 'annually',
        requiredDocumentation: ['Pesticide logs', 'Crop reports', 'Water usage'],
      },
      manufacturing: {
        regulations: ['ISO standards', 'OSHA', 'Environmental compliance'],
        auditFrequency: 'semi-annual',
        requiredDocumentation: ['Quality records', 'Maintenance logs', 'Safety audits'],
      },
      logistics: {
        regulations: ['DOT', 'Environmental standards', 'Labor laws'],
        auditFrequency: 'quarterly',
        requiredDocumentation: ['Driver logs', 'Vehicle maintenance', 'Safety records'],
      },
    };
    return complianceMap[industry] || {};
  }

  private getWorkflowTemplates(industry: string): any {
    const templatesMap: Record<string, any> = {
      construction: {
        dailyChecklist: ['Safety briefing', 'Equipment inspection', 'Weather assessment'],
        reportTypes: ['Daily progress', 'Safety incidents', 'Equipment maintenance'],
      },
      mining: {
        dailyChecklist: ['Hazard assessment', 'Equipment check', 'Shift briefing'],
        reportTypes: ['Production report', 'Incident report', 'Environmental monitoring'],
      },
      agriculture: {
        dailyChecklist: ['Crop health assessment', 'Irrigation check', 'Weather forecast'],
        reportTypes: ['Crop status', 'Yield prediction', 'Resource usage'],
      },
      manufacturing: {
        dailyChecklist: ['Equipment startup', 'Quality check', 'Production review'],
        reportTypes: ['Production metrics', 'Defect analysis', 'Maintenance logs'],
      },
      logistics: {
        dailyChecklist: ['Vehicle inspection', 'Route planning', 'Load verification'],
        reportTypes: ['Delivery report', 'Fuel consumption', 'Route analysis'],
      },
    };
    return templatesMap[industry] || {};
  }
}
