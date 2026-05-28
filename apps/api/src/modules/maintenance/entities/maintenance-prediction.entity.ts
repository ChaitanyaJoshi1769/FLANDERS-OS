import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Machine } from '../../machines/machine.entity';

@Entity('maintenance_predictions')
@Index(['machineId', 'predictedFailureDate'])
export class MaintenancePrediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  machineId: string;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('varchar', { length: 100 })
  failureType: string;

  @Column('timestamp')
  predictedFailureDate: Date;

  @Column('float')
  confidencePercent: number;

  @Column('text', { nullable: true })
  recommendedAction: string;

  @Column('varchar', { length: 50, nullable: true })
  modelVersion: string;

  @Column('jsonb', { default: '{}' })
  features: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
