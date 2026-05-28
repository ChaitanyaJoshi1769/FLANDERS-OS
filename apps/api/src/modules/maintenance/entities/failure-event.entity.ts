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

@Entity('failure_events')
@Index(['machineId', 'detectedAt'])
@Index(['severity'])
export class FailureEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  machineId: string;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('varchar', { length: 100 })
  failureType: string;

  @Column('varchar', { length: 20, default: 'warning' })
  severity: 'info' | 'warning' | 'critical' | 'catastrophic';

  @Column('text', { nullable: true })
  rootCause: string;

  @Column('interval', { nullable: true })
  timeToRepair: string;

  @CreateDateColumn()
  detectedAt: Date;

  @Column('timestamp', { nullable: true })
  resolvedAt: Date;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
