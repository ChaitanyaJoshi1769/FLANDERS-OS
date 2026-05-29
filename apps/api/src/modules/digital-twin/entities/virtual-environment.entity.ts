import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('virtual_environments')
export class VirtualEnvironment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('jsonb')
  models: Array<{ modelId: string; position: any }>;

  @Column('jsonb', { nullable: true })
  weatherConditions: any;

  @Column('jsonb', { nullable: true })
  terrainData: any;

  @Column('jsonb', { nullable: true })
  obstacles: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
