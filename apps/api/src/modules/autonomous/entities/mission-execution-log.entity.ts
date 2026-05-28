import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AutonomousMission } from './autonomous-mission.entity';
import { Machine } from '../../machines/machine.entity';

@Entity('mission_execution_logs')
@Index(['missionId', 'logType'])
@Index(['machineId', 'timestamp'])
export class MissionExecutionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  missionId: string;

  @ManyToOne(() => AutonomousMission)
  @JoinColumn({ name: 'missionId' })
  mission: AutonomousMission;

  @Column('uuid', { nullable: true })
  machineId: string;

  @ManyToOne(() => Machine, { nullable: true })
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('varchar', { length: 50 })
  logType: 'waypoint_reached' | 'action_completed' | 'error' | 'deviation' | 'intervention' | 'completion';

  @Column('varchar', { length: 20, default: 'info' })
  severity: 'info' | 'warning' | 'error' | 'critical';

  @Column('text')
  message: string;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column('int', { nullable: true })
  waypointIndex: number;

  @Column('jsonb', { default: '{}' })
  machineState: Record<string, any>;

  @Column('jsonb', { default: '{}' })
  environmentData: Record<string, any>;

  @Column('timestamp')
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
