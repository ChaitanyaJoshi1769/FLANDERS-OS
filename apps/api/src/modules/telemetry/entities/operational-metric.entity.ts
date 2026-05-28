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

@Entity('operational_metrics')
@Index(['machineId', 'timestamp'])
export class OperationalMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  machineId: string;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('float', { nullable: true })
  utilizationPercent: number;

  @Column('float', { nullable: true })
  fuelConsumptionRate: number;

  @Column('float', { nullable: true })
  powerOutput: number;

  @Column('float', { nullable: true })
  cycleTimeSeconds: number;

  @Column('float', { nullable: true })
  payloadWeight: number;

  @Column('float', { nullable: true })
  temperatureCelsius: number;

  @Column('float', { nullable: true })
  vibrationLevel: number;

  @CreateDateColumn()
  timestamp: Date;
}
