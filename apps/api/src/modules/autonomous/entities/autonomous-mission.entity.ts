import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Machine } from '../../machines/machine.entity';
import { Fleet } from '../../fleets/fleet.entity';

@Entity('autonomous_missions')
@Index(['fleetId', 'status'])
export class AutonomousMission {
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

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 20, default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

  @Column('varchar', { length: 50 })
  missionType: string; // drilling, hauling, leveling, etc.

  @Column('jsonb')
  waypoints: Array<{ lat: number; lon: number; action?: string }>;

  @Column('float', { nullable: true })
  estimatedDurationMinutes: number;

  @Column('float', { nullable: true })
  actualDurationMinutes: number;

  @Column('timestamp')
  scheduledStartTime: Date;

  @Column('timestamp', { nullable: true })
  actualStartTime: Date;

  @Column('timestamp', { nullable: true })
  completedTime: Date;

  @Column('varchar', { length: 20, default: 'autonomous' })
  operationMode: 'autonomous' | 'semi_autonomous' | 'manual' | 'remote';

  @Column('boolean', { default: false })
  requiresHumanIntervention: boolean;

  @Column('text', { nullable: true })
  failureReason: string;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
