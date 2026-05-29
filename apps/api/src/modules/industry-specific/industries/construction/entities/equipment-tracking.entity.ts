import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('construction_equipment_tracking')
export class EquipmentTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  equipmentId: string;

  @Column()
  equipmentType: string;

  @Column()
  siteId: string;

  @Column('jsonb')
  location: any;

  @Column('float')
  utilizationRate: number;

  @Column('jsonb')
  maintenanceHistory: Array<{ date: string; type: string; cost: number }>;

  @Column({ default: 'operational' })
  status: 'operational' | 'idle' | 'maintenance' | 'retired';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
