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
import { Organization } from '../../organizations/organization.entity';
import { Fleet } from '../../fleets/fleet.entity';

@Entity('compliance_audits')
@Index(['organizationId', 'auditDate'])
@Index(['status'])
export class ComplianceAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('uuid', { nullable: true })
  fleetId: string;

  @ManyToOne(() => Fleet, { nullable: true })
  @JoinColumn({ name: 'fleetId' })
  fleet: Fleet;

  @Column('varchar', { length: 100 })
  auditName: string;

  @Column('varchar', { length: 100 })
  complianceFramework: string; // OSHA, ISO 45001, ATEX, IEC 61508, etc.

  @Column('varchar', { length: 20, default: 'planned' })
  status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'remediation';

  @Column('int', { nullable: true })
  totalCheckpoints: number;

  @Column('int', { nullable: true })
  passedCheckpoints: number;

  @Column('float', { nullable: true })
  complianceScore: number; // 0-100%

  @Column('text', { nullable: true })
  findings: string;

  @Column('text', { nullable: true })
  recommendedActions: string;

  @Column('varchar', { length: 50, nullable: true })
  auditedBy: string;

  @Column('timestamp')
  auditDate: Date;

  @Column('timestamp', { nullable: true })
  completionDate: Date;

  @Column('timestamp', { nullable: true })
  nextAuditDue: Date;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
