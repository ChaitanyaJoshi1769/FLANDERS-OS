import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CollaborationService } from './collaboration.service';
import { Message } from './entities/message.entity';
import { Team } from './entities/team.entity';
import { Notification } from './entities/notification.entity';

describe('CollaborationService', () => {
  let service: CollaborationService;
  const mockMessageRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
  const mockTeamRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
  const mockNotificationRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaborationService,
        { provide: getRepositoryToken(Message), useValue: mockMessageRepo },
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Notification), useValue: mockNotificationRepo },
      ],
    }).compile();

    service = module.get<CollaborationService>(CollaborationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const messageData = {
        organizationId: 'org1',
        senderId: 'user1',
        channelId: 'channel1',
        content: 'Test message',
        type: 'text',
      };

      mockMessageRepo.create.mockReturnValue(messageData);
      mockMessageRepo.save.mockResolvedValue(messageData);

      const result = await service.sendMessage(messageData);
      expect(mockMessageRepo.save).toHaveBeenCalled();
      expect(result).toEqual(messageData);
    });
  });

  describe('createTeam', () => {
    it('should create a team', async () => {
      const teamData = {
        organizationId: 'org1',
        name: 'Team A',
        members: [{ userId: 'user1', role: 'admin', joinedAt: new Date() }],
      };

      mockTeamRepo.create.mockReturnValue(teamData);
      mockTeamRepo.save.mockResolvedValue(teamData);

      const result = await service.createTeam(teamData);
      expect(mockTeamRepo.save).toHaveBeenCalled();
    });
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const notificationData = {
        organizationId: 'org1',
        recipientId: 'user1',
        type: 'incident',
        priority: 'high',
        message: 'Critical incident',
      };

      mockNotificationRepo.create.mockReturnValue(notificationData);
      mockNotificationRepo.save.mockResolvedValue(notificationData);

      const result = await service.createNotification(notificationData);
      expect(mockNotificationRepo.save).toHaveBeenCalled();
    });
  });

  describe('getMessages', () => {
    it('should get messages from a channel', async () => {
      mockMessageRepo.find.mockResolvedValue([]);
      const result = await service.getMessages('org1', 'channel1');
      expect(mockMessageRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getTeams', () => {
    it('should get all teams', async () => {
      mockTeamRepo.find.mockResolvedValue([]);
      const result = await service.getTeams('org1');
      expect(mockTeamRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getNotifications', () => {
    it('should get notifications for user', async () => {
      mockNotificationRepo.find.mockResolvedValue([]);
      const result = await service.getNotifications('org1', 'user1');
      expect(mockNotificationRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const notification = { id: 'notif1', isRead: false };
      mockNotificationRepo.findOne = jest.fn().mockResolvedValue(notification);
      mockNotificationRepo.save.mockResolvedValue({ ...notification, isRead: true });

      await service.markNotificationAsRead('notif1');
      expect(mockNotificationRepo.save).toHaveBeenCalled();
    });
  });
});
