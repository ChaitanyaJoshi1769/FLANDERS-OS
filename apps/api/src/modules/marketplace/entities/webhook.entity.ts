import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('marketplace_webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  partnerId: string;

  @Column()
  eventType: string;

  @Column()
  url: string;

  @Column('jsonb')
  headers: any;

  @Column({ default: true })
  active: boolean;

  @Column('jsonb')
  retryPolicy: any;

  @Column('integer')
  totalDeliveries: number;

  @Column('integer')
  successfulDeliveries: number;

  @Column('integer')
  failedDeliveries: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
