import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('marketplace_plugins')
export class Plugin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  pluginName: string;

  @Column()
  partnerId: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  version: string;

  @Column('jsonb')
  permissions: Array<{ resource: string; action: string }>;

  @Column('jsonb')
  configuration: any;

  @Column({ default: 'draft' })
  status: 'draft' | 'published' | 'verified' | 'deprecated';

  @Column('float')
  rating: number;

  @Column('integer')
  downloads: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
