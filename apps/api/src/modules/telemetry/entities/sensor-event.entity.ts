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

@Entity('sensor_events')
@Index(['machineId', 'timestamp'])
@Index(['status'])
export class SensorEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  machineId: string;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('varchar', { length: 100 })
  sensorName: string;

  @Column('float')
  value: number;

  @Column('varchar', { length: 20, nullable: true })
  unit: string;

  @Column('varchar', { length: 20, default: 'healthy' })
  status: 'healthy' | 'degraded' | 'critical' | 'offline';

  @CreateDateColumn()
  timestamp: Date;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;
}
