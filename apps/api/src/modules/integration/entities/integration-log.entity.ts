import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('integration_logs')
@Index(['organizationId', 'integrationId'])
@Index(['eventType', 'timestamp'])
@Index(['status'])
export class IntegrationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @Column('uuid')
  integrationId: string;

  @Column('varchar', { length: 100 })
  integrationType: string; // erp, webhook, servicenow, etc.

  @Column('varchar', { length: 100 })
  eventType: string;

  @Column('varchar', { length: 20, default: 'success' })
  status: 'success' | 'failure' | 'warning' | 'pending' | 'retry';

  @Column('text')
  message: string;

  @Column('int', { default: 200 })
  httpStatusCode: number;

  @Column('text', { nullable: true })
  errorDetails: string;

  @Column('varchar', { length: 255, nullable: true })
  requestPath: string;

  @Column('jsonb', { default: '{}' })
  requestPayload: Record<string, any>;

  @Column('jsonb', { default: '{}' })
  responsePayload: Record<string, any>;

  @Column('int', { nullable: true })
  responseTimeMs: number;

  @Column('varchar', { length: 255, nullable: true })
  recordsProcessed: string;

  @Column('varchar', { length: 255, nullable: true })
  dataSize: string;

  @CreateDateColumn()
  timestamp: Date;
}
