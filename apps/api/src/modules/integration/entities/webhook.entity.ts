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

@Entity('webhooks')
@Index(['organizationId', 'eventType'])
@Index(['status'])
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('varchar', { length: 100 })
  eventType: string; // mission_completed, incident_reported, maintenance_due, etc.

  @Column('varchar', { length: 255 })
  webhookUrl: string;

  @Column('varchar', { length: 50, default: 'active' })
  status: 'active' | 'inactive' | 'failed' | 'error' | 'disabled';

  @Column('varchar', { length: 20, default: 'POST' })
  httpMethod: 'POST' | 'PUT' | 'PATCH';

  @Column('jsonb', { default: '{}' })
  headers: Record<string, string>;

  @Column('varchar', { length: 100, nullable: true })
  secretToken: string;

  @Column('int', { default: 0 })
  retryAttempts: number;

  @Column('int', { default: 3 })
  maxRetries: number;

  @Column('int', { default: 300 })
  retryDelaySeconds: number;

  @Column('int', { default: 0 })
  totalDeliveries: number;

  @Column('int', { default: 0 })
  failedDeliveries: number;

  @Column('int', { default: 0 })
  successfulDeliveries: number;

  @Column('timestamp', { nullable: true })
  lastDeliveryTime: Date;

  @Column('varchar', { length: 255, nullable: true })
  lastDeliveryStatus: string;

  @Column('text', { nullable: true })
  lastErrorMessage: string;

  @Column('jsonb', { default: '{}' })
  filters: Record<string, any>;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
