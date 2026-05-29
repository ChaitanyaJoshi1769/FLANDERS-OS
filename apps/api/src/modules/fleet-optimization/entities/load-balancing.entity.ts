import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('load_balancing')
export class LoadBalancing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  fleetId: string;

  @Column('jsonb')
  machineLoads: Array<{ machineId: string; currentLoad: number; maxCapacity: number; utilization: number }>;

  @Column('float')
  averageUtilization: number;

  @Column('float')
  balanceScore: number;

  @Column('jsonb')
  recommendations: Array<{ action: string; sourceId: string; targetId: string; expectedImprovement: number }>;

  @Column({ default: 'balanced' })
  status: 'balanced' | 'unbalanced' | 'critical';

  @CreateDateColumn()
  calculatedAt: Date;
}
