import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  senderId: string;

  @Column()
  channelId: string;

  @Column('text')
  content: string;

  @Column({
    default: 'text',
  })
  type: 'text' | 'incident_alert' | 'mission_update' | 'system';

  @Column('jsonb', { nullable: true })
  mentions: string[];

  @Column('jsonb', { nullable: true })
  attachments: any[];

  @CreateDateColumn()
  createdAt: Date;
}
