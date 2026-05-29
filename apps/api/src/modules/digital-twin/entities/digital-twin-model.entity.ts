import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('digital_twin_models')
export class DigitalTwinModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  machineId: string;

  @Column()
  name: string;

  @Column('jsonb')
  model3D: any;

  @Column('jsonb')
  specifications: any;

  @Column('jsonb')
  realTimeMetrics: any;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'archived';

  @Column({ nullable: true })
  lastSyncTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
