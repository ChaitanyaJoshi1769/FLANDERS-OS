import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Fleet } from '../fleets/fleet.entity';
import { Site } from '../sites/site.entity';

@Entity('machines')
@Index(['organizationId', 'serialNumber'], { unique: true })
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('uuid')
  fleetId: string;

  @ManyToOne(() => Fleet, (fleet) => fleet.machines)
  @JoinColumn({ name: 'fleetId' })
  fleet: Fleet;

  @Column('uuid')
  siteId: string;

  @ManyToOne(() => Site)
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 100, unique: true })
  serialNumber: string;

  @Column('varchar', { length: 50 })
  machineType: string;

  @Column('varchar', { length: 20, default: 'unknown' })
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned' | 'unknown';

  @Column('varchar', { length: 100, nullable: true })
  manufacturer: string;

  @Column('varchar', { length: 100, nullable: true })
  model: string;

  @Column('integer', { nullable: true })
  yearManufactured: number;

  @Column('date', { nullable: true })
  acquisitionDate: Date;

  @Column('float', { nullable: true })
  locationLat: number;

  @Column('float', { nullable: true })
  locationLon: number;

  @Column('float', { nullable: true })
  heading: number;

  @Column('float', { nullable: true })
  batteryLevel: number;

  @Column('float', { nullable: true })
  fuelLevel: number;

  @Column('integer', { default: 0 })
  operatingHours: number;

  @Column('timestamp', { nullable: true })
  lastTelemetryAt: Date;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
