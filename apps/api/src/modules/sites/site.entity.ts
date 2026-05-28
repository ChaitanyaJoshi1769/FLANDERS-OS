import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';

@Entity('industrial_sites')
export class Site {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('float', { nullable: true })
  locationLat: number;

  @Column('float', { nullable: true })
  locationLon: number;

  @Column('varchar', { length: 100, nullable: true })
  region: string;

  @Column('varchar', { length: 50, nullable: true })
  siteType: string;

  @Column('varchar', { length: 50, default: 'UTC' })
  timezone: string;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
