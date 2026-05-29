import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('capacity_plan')
export class CapacityPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  fleetId: string;

  @Column()
  planName: string;

  @Column()
  planPeriod: string;

  @Column('jsonb')
  demandForecast: Array<{ period: string; predictedDemand: number; confidence: number }>;

  @Column('jsonb')
  capacityAllocation: Array<{ machineId: string; allocatedCapacity: number; utilization: number }>;

  @Column('float')
  totalCapacity: number;

  @Column('float')
  projectedUtilization: number;

  @Column('jsonb')
  constraints: any;

  @Column('jsonb')
  recommendations: Array<{ type: string; action: string; impact: string }>;

  @Column({ default: 'draft' })
  status: 'draft' | 'approved' | 'active' | 'completed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
