import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fuel_efficiency')
export class FuelEfficiency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  machineId: string;

  @Column('float')
  currentConsumption: number;

  @Column('float')
  baselineConsumption: number;

  @Column('float')
  efficiency: number;

  @Column('jsonb')
  optimizationFactors: any;

  @Column('jsonb')
  recommendations: Array<{ factor: string; impact: number; action: string }>;

  @Column('float', { nullable: true })
  projectedSavings: number;

  @Column({ default: 'monitored' })
  status: 'monitored' | 'optimized' | 'critical';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
