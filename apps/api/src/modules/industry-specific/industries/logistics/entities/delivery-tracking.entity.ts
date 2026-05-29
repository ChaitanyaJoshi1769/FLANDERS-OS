import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logistics_delivery_tracking')
export class DeliveryTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  vehicleId: string;

  @Column()
  deliveryId: string;

  @Column('jsonb')
  pickupLocation: any;

  @Column('jsonb')
  deliveryLocation: any;

  @Column('float')
  distance: number;

  @Column('float')
  estimatedTime: number;

  @Column('float')
  actualTime: number;

  @Column('float')
  fuelConsumption: number;

  @Column('float')
  fuelEconomy: number;

  @Column('float')
  routeEfficiency: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';

  @CreateDateColumn()
  recordedAt: Date;
}
