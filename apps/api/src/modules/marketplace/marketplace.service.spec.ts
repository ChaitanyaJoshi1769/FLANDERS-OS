import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { Partner } from './entities/partner.entity';
import { Plugin } from './entities/plugin.entity';
import { Webhook } from './entities/webhook.entity';
import { CustomModule } from './entities/custom-module.entity';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  const mockPartnerRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
  const mockPluginRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
  const mockWebhookRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
  const mockModuleRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        { provide: getRepositoryToken(Partner), useValue: mockPartnerRepo },
        { provide: getRepositoryToken(Plugin), useValue: mockPluginRepo },
        { provide: getRepositoryToken(Webhook), useValue: mockWebhookRepo },
        { provide: getRepositoryToken(CustomModule), useValue: mockModuleRepo },
      ],
    }).compile();

    service = module.get<MarketplaceService>(MarketplaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerPartner', () => {
    it('should register a partner', async () => {
      const partnerData = {
        partnerName: 'Partner A',
        partnerEmail: 'partner@example.com',
      };

      mockPartnerRepo.create.mockReturnValue(partnerData);
      mockPartnerRepo.save.mockResolvedValue(partnerData);

      const result = await service.registerPartner('org1', partnerData);
      expect(mockPartnerRepo.save).toHaveBeenCalled();
    });
  });

  describe('publishPlugin', () => {
    it('should publish a plugin', async () => {
      const pluginData = {
        pluginName: 'Plugin A',
        description: 'Test plugin',
        category: 'integration',
        version: '1.0.0',
      };

      mockPluginRepo.create.mockReturnValue(pluginData);
      mockPluginRepo.save.mockResolvedValue(pluginData);

      const result = await service.publishPlugin('org1', 'partner1', pluginData);
      expect(mockPluginRepo.save).toHaveBeenCalled();
    });
  });

  describe('registerWebhook', () => {
    it('should register a webhook', async () => {
      const webhookData = {
        eventType: 'incident',
        url: 'https://example.com/webhook',
      };

      mockWebhookRepo.create.mockReturnValue(webhookData);
      mockWebhookRepo.save.mockResolvedValue(webhookData);

      const result = await service.registerWebhook('org1', 'partner1', webhookData);
      expect(mockWebhookRepo.save).toHaveBeenCalled();
    });
  });

  describe('createCustomModule', () => {
    it('should create custom module', async () => {
      const moduleData = {
        moduleName: 'Custom Module',
        description: 'Test module',
        sourceCode: 'console.log("hello");',
      };

      mockModuleRepo.create.mockReturnValue(moduleData);
      mockModuleRepo.save.mockResolvedValue(moduleData);

      const result = await service.createCustomModule('org1', moduleData);
      expect(mockModuleRepo.save).toHaveBeenCalled();
    });
  });

  describe('getMarketplacePlugins', () => {
    it('should get marketplace plugins', async () => {
      mockPluginRepo.find.mockResolvedValue([]);
      const result = await service.getMarketplacePlugins('org1');
      expect(mockPluginRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getPartners', () => {
    it('should get partners', async () => {
      mockPartnerRepo.find.mockResolvedValue([]);
      const result = await service.getPartners('org1');
      expect(mockPartnerRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getWebhooks', () => {
    it('should get webhooks', async () => {
      mockWebhookRepo.find.mockResolvedValue([]);
      const result = await service.getWebhooks('org1', 'partner1');
      expect(mockWebhookRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getCustomModules', () => {
    it('should get custom modules', async () => {
      mockModuleRepo.find.mockResolvedValue([]);
      const result = await service.getCustomModules('org1');
      expect(mockModuleRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('updateWebhookMetrics', () => {
    it('should update webhook metrics on success', async () => {
      const webhook = { id: 'webhook1', totalDeliveries: 0, successfulDeliveries: 0, failedDeliveries: 0 };
      mockWebhookRepo.findOne.mockResolvedValue(webhook);
      mockWebhookRepo.save.mockResolvedValue({ ...webhook, totalDeliveries: 1, successfulDeliveries: 1 });

      await service.updateWebhookMetrics('webhook1', true);
      expect(mockWebhookRepo.save).toHaveBeenCalled();
    });

    it('should update webhook metrics on failure', async () => {
      const webhook = { id: 'webhook1', totalDeliveries: 0, successfulDeliveries: 0, failedDeliveries: 0 };
      mockWebhookRepo.findOne.mockResolvedValue(webhook);
      mockWebhookRepo.save.mockResolvedValue({ ...webhook, totalDeliveries: 1, failedDeliveries: 1 });

      await service.updateWebhookMetrics('webhook1', false);
      expect(mockWebhookRepo.save).toHaveBeenCalled();
    });
  });

  describe('verifyPlugin', () => {
    it('should verify a plugin', async () => {
      const plugin = { id: 'plugin1', status: 'published' };
      mockPluginRepo.findOne.mockResolvedValue(plugin);
      mockPluginRepo.save.mockResolvedValue({ ...plugin, status: 'verified' });

      await service.verifyPlugin('org1', 'plugin1');
      expect(mockPluginRepo.save).toHaveBeenCalled();
    });
  });
});
