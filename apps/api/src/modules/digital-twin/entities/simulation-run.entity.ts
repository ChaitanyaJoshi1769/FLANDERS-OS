import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('simulation_runs')
export class SimulationRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  twinId: string;

  @Column()
  scenarioName: string;

  @Column('jsonb')
  parameters: any;

  @Column()
  duration: number;

  @Column({ default: 'running' })
  status: 'running' | 'completed' | 'failed' | 'paused';

  @CreateDateColumn()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column('jsonb', { nullable: true })
  results: any;
}
