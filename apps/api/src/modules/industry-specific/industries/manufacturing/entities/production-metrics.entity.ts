import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('manufacturing_production_metrics')
export class ProductionMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  lineId: string;

  @Column('float')
  unitsProduced: number;

  @Column('float')
  targetUnits: number;

  @Column('float')
  defectRate: number;

  @Column('float')
  downtime: number;

  @Column('float')
  cycleTime: number;

  @Column('jsonb')
  equipmentStatus: Array<{ equipmentId: string; status: string; efficiency: number }>;

  @Column('jsonb')
  qualityMetrics: any;

  @Column('float')
  efficiency: number;

  @CreateDateColumn()
  recordedAt: Date;
}
