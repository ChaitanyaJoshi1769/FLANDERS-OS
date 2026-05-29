import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('marketplace_partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  partnerName: string;

  @Column()
  partnerEmail: string;

  @Column('jsonb')
  integrations: Array<{ type: string; status: string; lastSync: string }>;

  @Column('jsonb')
  apiKeys: any;

  @Column('jsonb')
  webhooks: Array<{ eventType: string; url: string; active: boolean }>;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'active' | 'suspended';

  @Column('jsonb', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
