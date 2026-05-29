import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('agriculture_crop_health')
export class CropHealth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  fieldId: string;

  @Column()
  cropType: string;

  @Column('float')
  ndviIndex: number;

  @Column('float')
  soilMoisture: number;

  @Column('float')
  temperature: number;

  @Column('jsonb')
  irrigationSchedule: any;

  @Column('float')
  yieldPrediction: number;

  @Column('jsonb')
  diseaseRisk: Array<{ disease: string; probability: number; treatment: string }>;

  @Column('jsonb')
  weatherForecast: any;

  @CreateDateColumn()
  recordedAt: Date;
}
