import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('route_optimization')
export class RouteOptimization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  fleetId: string;

  @Column()
  name: string;

  @Column('jsonb')
  waypoints: Array<{ latitude: number; longitude: number; priority: number }>;

  @Column('jsonb')
  optimizedRoute: Array<{ sequence: number; latitude: number; longitude: number }>;

  @Column('float')
  estimatedDistance: number;

  @Column('float')
  estimatedTime: number;

  @Column('float')
  estimatedCost: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'optimized' | 'in_progress' | 'completed';

  @Column('jsonb', { nullable: true })
  trafficConditions: any;

  @Column('jsonb', { nullable: true })
  terrainData: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
