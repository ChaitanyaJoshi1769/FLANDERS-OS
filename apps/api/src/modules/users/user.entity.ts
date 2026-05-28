import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';

@Entity('users')
@Index(['organizationId', 'email'], { unique: true })
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 100, nullable: true })
  firstName: string;

  @Column('varchar', { length: 100, nullable: true })
  lastName: string;

  @Column('varchar', { length: 255, select: false })
  passwordHash: string;

  @Column('varchar', { length: 20, default: 'active' })
  status: 'active' | 'inactive' | 'invited' | 'deactivated';

  @Column('boolean', { default: false })
  emailVerified: boolean;

  @Column('boolean', { default: false })
  mfaEnabled: boolean;

  @Column('varchar', { length: 255, nullable: true, select: false })
  mfaSecret?: string;

  @Column('timestamp', { nullable: true })
  lastLoginAt?: Date;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;
}
