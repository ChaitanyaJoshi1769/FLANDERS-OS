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

@Entity('safety_incidents')
@Index(['fleetId', 'status'])
@Index(['severity', 'createdAt'])
export class SafetyIncident {
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
  title: string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 50 })
  incidentType: string; // collision, hazard, operator_error, equipment_failure, etc.

  @Column('varchar', { length: 20, default: 'open' })
  status: 'open' | 'investigating' | 'resolved' | 'closed' | 'pending_review';

  @Column('varchar', { length: 20, default: 'medium' })
  severity: 'low' | 'medium' | 'high' | 'critical' | 'catastrophic';

  @Column('varchar', { length: 20, default: 'unresolved' })
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'resolved';

  @Column('text', { nullable: true })
  rootCause: string;

  @Column('text', { nullable: true })
  correctionAction: string;

  @Column('int', { nullable: true })
  injurySeverity: number; // 0-5: no injury to fatality

  @Column('varchar', { length: 50, nullable: true })
  reportedBy: string;

  @Column('varchar', { length: 50, nullable: true })
  investigatedBy: string;

  @Column('timestamp')
  incidentTime: Date;

  @Column('timestamp', { nullable: true })
  reportedTime: Date;

  @Column('timestamp', { nullable: true })
  resolutionTime: Date;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
