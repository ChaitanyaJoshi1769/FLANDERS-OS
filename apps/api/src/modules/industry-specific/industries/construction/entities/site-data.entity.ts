import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('construction_site_data')
export class SiteData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  siteId: string;

  @Column()
  projectName: string;

  @Column('jsonb')
  workers: Array<{ workerId: string; hoursWorked: number; tasks: string[] }>;

  @Column('float')
  progressPercentage: number;

  @Column('jsonb')
  equipmentOnSite: Array<{ equipmentId: string; type: string; status: string }>;

  @Column('jsonb')
  materials: Array<{ materialId: string; quantity: number; unit: string }>;

  @CreateDateColumn()
  recordedAt: Date;
}
