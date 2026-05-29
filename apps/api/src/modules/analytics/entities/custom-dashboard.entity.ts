import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('custom_dashboards')
export class CustomDashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('jsonb')
  widgets: Array<{
    id: string;
    type: string;
    title: string;
    config: any;
    position: { x: number; y: number };
  }>;

  @Column('jsonb')
  layout: { width: number; height: number };

  @Column({ default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
