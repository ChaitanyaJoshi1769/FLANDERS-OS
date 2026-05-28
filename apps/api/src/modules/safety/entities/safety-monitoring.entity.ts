import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Fleet } from '../../fleets/fleet.entity';
import { Machine } from '../../machines/machine.entity';

@Entity('safety_monitoring')
@Index(['fleetId', 'monitoringType'])
@Index(['alertLevel', 'timestamp'])
export class SafetyMonitoring {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  fleetId: string;

  @ManyToOne(() => Fleet)
  @JoinColumn({ name: 'fleetId' })
  fleet: Fleet;

  @Column('uuid', { nullable: true })
  machineId: string;

  @ManyToOne(() => Machine, { nullable: true })
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('varchar', { length: 100 })
  monitoringType: string; // speed_limit, geofence, emergency_stop, operator_proximity, etc.

  @Column('varchar', { length: 20, default: 'normal' })
  alertLevel: 'normal' | 'warning' | 'critical' | 'emergency';

  @Column('varchar', { length: 255 })
  monitoringDescription: string;

  @Column('varchar', { length: 50, nullable: true })
  expectedValue: string;

  @Column('varchar', { length: 50, nullable: true })
  actualValue: string;

  @Column('float', { nullable: true })
  threshold: number;

  @Column('boolean', { default: false })
  thresholdExceeded: boolean;

  @Column('int', { nullable: true })
  consecutiveViolations: number;

  @Column('text', { nullable: true })
  correctionRequired: string;

  @Column('timestamp')
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
