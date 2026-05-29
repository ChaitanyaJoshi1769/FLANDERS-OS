import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('industry_configurations')
export class IndustryConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  industry: 'construction' | 'mining' | 'agriculture' | 'manufacturing' | 'logistics';

  @Column('jsonb')
  configuration: any;

  @Column('jsonb')
  customMetrics: Array<{ name: string; formula: string; unit: string }>;

  @Column('jsonb')
  complianceRequirements: any;

  @Column('jsonb')
  workflowTemplates: any;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
