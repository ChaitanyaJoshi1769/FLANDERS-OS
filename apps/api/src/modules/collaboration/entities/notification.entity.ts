import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column()
  type: 'incident' | 'mission' | 'maintenance' | 'alert' | 'system';

  @Column({ default: 'normal' })
  priority: 'low' | 'normal' | 'high' | 'critical';

  @Column({ nullable: true })
  actionUrl: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
