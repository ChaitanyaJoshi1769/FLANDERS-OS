import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CropHealth } from './entities/crop-health.entity';

@Injectable()
export class AgricultureService {
  constructor(
    @InjectRepository(CropHealth)
    private cropHealthRepo: Repository<CropHealth>,
  ) {}

  async recordCropHealth(organizationId: string, fieldId: string, data: any) {
    const cropHealth = this.cropHealthRepo.create({
      organizationId,
      fieldId,
      cropType: data.cropType,
      ndviIndex: data.ndviIndex || 0,
      soilMoisture: data.soilMoisture || 0,
      temperature: data.temperature || 0,
      irrigationSchedule: data.irrigationSchedule || {},
      yieldPrediction: this.predictYield(data),
      diseaseRisk: data.diseaseRisk || [],
      weatherForecast: data.weatherForecast || {},
    });
    return this.cropHealthRepo.save(cropHealth) as unknown as CropHealth;
  }

  async getCropHealthData(organizationId: string, fieldId: string) {
    return this.cropHealthRepo.find({
      where: { organizationId, fieldId },
      order: { recordedAt: 'DESC' },
      take: 10,
    });
  }

  async getYieldPrediction(organizationId: string, fieldId: string) {
    const latest = await this.cropHealthRepo.findOne({
      where: { organizationId, fieldId },
      order: { recordedAt: 'DESC' },
    });
    return {
      fieldId,
      yieldPrediction: latest?.yieldPrediction || 0,
      confidence: 0.85,
      factors: ['soil_moisture', 'temperature', 'rainfall', 'disease_pressure'],
    };
  }

  private predictYield(data: any): number {
    const baseYield = 5000;
    const moistureFactor = (data.soilMoisture || 50) / 100;
    const ndviFactor = (data.ndviIndex || 0.5) * 100;
    return baseYield * moistureFactor * (ndviFactor / 100);
  }
}
