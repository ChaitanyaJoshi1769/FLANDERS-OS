import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('mining_hazard_zones')
export class HazardZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  mineId: string;

  @Column()
  zoneName: string;

  @Column('jsonb')
  location: any;

  @Column('jsonb')
  hazards: Array<{ type: string; severity: string; mitigation: string }>;

  @Column('float')
  riskScore: number;

  @Column('jsonb')
  accessRestrictions: any;

  @Column('jsonb')
  safetyProtocols: Array<{ protocol: string; frequency: string }>;

  @Column({ default: 'monitored' })
  status: 'monitored' | 'restricted' | 'closed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
