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

@Entity('erp_integrations')
@Index(['organizationId', 'erpType'])
@Index(['status'])
export class ERPIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('varchar', { length: 50 })
  erpType: string; // SAP, Oracle, Dynamics365, NetSuite, etc.

  @Column('varchar', { length: 255 })
  erpInstanceName: string;

  @Column('varchar', { length: 255 })
  apiEndpoint: string;

  @Column('varchar', { length: 100, default: 'connected' })
  status: 'connected' | 'disconnected' | 'error' | 'pending_auth' | 'disabled';

  @Column('varchar', { length: 50, default: 'oauth2' })
  authType: 'oauth2' | 'api_key' | 'basic' | 'certificate' | 'saml';

  @Column('text', { nullable: true })
  credentialsEncrypted: string;

  @Column('varchar', { length: 255, nullable: true })
  clientId: string;

  @Column('varchar', { length: 255, nullable: true })
  clientSecret: string;

  @Column('int', { default: 0 })
  syncIntervalMinutes: number;

  @Column('varchar', { length: 100, nullable: true })
  lastSyncStatus: string;

  @Column('timestamp', { nullable: true })
  lastSyncTime: Date;

  @Column('int', { default: 0 })
  recordsSynced: number;

  @Column('int', { default: 0 })
  syncErrors: number;

  @Column('boolean', { default: true })
  autoSyncEnabled: boolean;

  @Column('jsonb', { default: '{}' })
  syncConfiguration: Record<string, any>;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
