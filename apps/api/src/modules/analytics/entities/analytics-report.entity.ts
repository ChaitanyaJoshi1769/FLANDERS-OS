import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('analytics_reports')
export class AnalyticsReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  title: string;

  @Column()
  type: 'fleet_health' | 'maintenance' | 'efficiency' | 'safety' | 'custom';

  @Column()
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';

  @Column('jsonb')
  metrics: any;

  @Column('jsonb')
  insights: any;

  @CreateDateColumn()
  generatedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
