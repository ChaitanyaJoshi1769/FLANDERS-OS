import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Team } from './entities/team.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class CollaborationService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
  ) {}

  async sendMessage(organizationId: string, messageData: any) {
    const message = this.messageRepo.create({
      organizationId,
      senderId: messageData.senderId,
      channelId: messageData.channelId,
      content: messageData.content,
      type: messageData.type,
      mentions: messageData.mentions,
    });
    return this.messageRepo.save(message);
  }

  async createTeam(organizationId: string, teamData: any) {
    const team = this.teamRepo.create({
      organizationId,
      name: teamData.name,
      description: teamData.description,
      members: teamData.members,
      permissions: teamData.permissions,
    });
    return this.teamRepo.save(team);
  }

  async createNotification(organizationId: string, notificationData: any) {
    const notification = this.notificationRepo.create({
      organizationId,
      userId: notificationData.userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      priority: notificationData.priority,
      actionUrl: notificationData.actionUrl,
    });
    return this.notificationRepo.save(notification);
  }

  async getMessages(organizationId: string, channelId: string) {
    return this.messageRepo.find({
      where: { organizationId, channelId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async getTeams(organizationId: string) {
    return this.teamRepo.find({
      where: { organizationId },
    });
  }

  async getNotifications(organizationId: string, userId: string) {
    return this.notificationRepo.find({
      where: { organizationId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markNotificationAsRead(notificationId: string) {
    await this.notificationRepo.update(notificationId, { isRead: true });
  }
}
