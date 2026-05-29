import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('marketplace_custom_modules')
export class CustomModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  moduleName: string;

  @Column()
  description: string;

  @Column('text')
  sourceCode: string;

  @Column('jsonb')
  dependencies: Array<{ name: string; version: string }>;

  @Column('jsonb')
  endpoints: Array<{ method: string; path: string; description: string }>;

  @Column('jsonb')
  dataModels: Array<{ name: string; fields: Record<string, string> }>;

  @Column({ default: 'draft' })
  status: 'draft' | 'testing' | 'published' | 'active';

  @Column('jsonb')
  testResults: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
