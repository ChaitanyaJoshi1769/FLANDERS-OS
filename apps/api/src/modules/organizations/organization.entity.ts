import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, unique: true })
  slug: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('varchar', { length: 500, nullable: true })
  logoUrl?: string;

  @Column('varchar', { length: 20, default: 'active' })
  status: 'active' | 'inactive' | 'suspended';

  @Column('varchar', { length: 50, default: 'enterprise' })
  tier: string;

  @Column('jsonb', { default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamp', { nullable: true })
  deletedAt?: Date;
}
