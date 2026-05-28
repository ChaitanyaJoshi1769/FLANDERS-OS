import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Site } from '../sites/site.entity';
import { Machine } from '../machines/machine.entity';

@Entity('fleets')
export class Fleet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('uuid')
  siteId: string;

  @ManyToOne(() => Site)
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 50, nullable: true })
  fleetType: string;

  @Column('integer', { default: 0 })
  totalMachines: number;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @OneToMany(() => Machine, (machine) => machine.fleet, { cascade: true })
  machines: Machine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
