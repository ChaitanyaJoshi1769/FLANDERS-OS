import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Machine } from '../../machines/machine.entity';
import { Organization } from '../../organizations/organization.entity';
import { User } from '../../users/user.entity';

@Entity('work_orders')
@Index(['organizationId', 'status'])
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('uuid')
  machineId: string;

  @ManyToOne(() => Machine)
  @JoinColumn({ name: 'machineId' })
  machine: Machine;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('varchar', { length: 20, default: 'open' })
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';

  @Column('varchar', { length: 20, nullable: true })
  priority: 'low' | 'medium' | 'high' | 'critical';

  @Column('uuid', { nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column('timestamp', { nullable: true })
  scheduledDate: Date;

  @Column('timestamp', { nullable: true })
  completedDate: Date;

  @Column('float', { nullable: true })
  estimatedDurationHours: number;

  @Column('float', { nullable: true })
  actualDurationHours: number;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
