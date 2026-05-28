import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Fleet } from '../../fleets/fleet.entity';
import { AutonomousMission } from './autonomous-mission.entity';

@Entity('fleet_coordinations')
@Index(['fleetId', 'status'])
@Index(['createdAt'])
export class FleetCoordination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  fleetId: string;

  @ManyToOne(() => Fleet)
  @JoinColumn({ name: 'fleetId' })
  fleet: Fleet;

  @OneToMany(() => AutonomousMission, (mission) => mission.fleetId)
  missions: AutonomousMission[];

  @Column('varchar', { length: 20, default: 'planning' })
  coordinationMode: 'planning' | 'active' | 'paused' | 'completed' | 'failed';

  @Column('varchar', { length: 100, nullable: true })
  coordinationStrategy: string; // load_balancing, sequential, parallel, priority_based, etc.

  @Column('int', { default: 0 })
  totalMissionsCount: number;

  @Column('int', { default: 0 })
  completedMissionsCount: number;

  @Column('int', { default: 0 })
  failedMissionsCount: number;

  @Column('float', { nullable: true })
  overallEfficiency: number; // 0-100%

  @Column('float', { nullable: true })
  estimatedCompletionMinutes: number;

  @Column('timestamp', { nullable: true })
  coordinationStartTime: Date;

  @Column('timestamp', { nullable: true })
  coordinationEndTime: Date;

  @Column('jsonb', { default: '{}' })
  metrics: Record<string, any>;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
