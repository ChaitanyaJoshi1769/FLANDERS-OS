import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partner.entity';
import { Plugin } from './entities/plugin.entity';
import { Webhook } from './entities/webhook.entity';
import { CustomModule } from './entities/custom-module.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepo: Repository<Partner>,
    @InjectRepository(Plugin)
    private pluginRepo: Repository<Plugin>,
    @InjectRepository(Webhook)
    private webhookRepo: Repository<Webhook>,
    @InjectRepository(CustomModule)
    private moduleRepo: Repository<CustomModule>,
  ) {}

  async registerPartner(organizationId: string, partnerData: any) {
    const partner = this.partnerRepo.create({
      organizationId,
      partnerName: partnerData.partnerName,
      partnerEmail: partnerData.partnerEmail,
      integrations: partnerData.integrations || [],
      apiKeys: partnerData.apiKeys || {},
      webhooks: partnerData.webhooks || [],
      status: 'pending',
      metadata: partnerData.metadata || {},
    });
    return this.partnerRepo.save(partner) as unknown as Partner;
  }

  async publishPlugin(organizationId: string, partnerId: string, pluginData: any) {
    const plugin = this.pluginRepo.create({
      organizationId,
      pluginName: pluginData.pluginName,
      partnerId,
      description: pluginData.description,
      category: pluginData.category,
      version: pluginData.version,
      permissions: pluginData.permissions || [],
      configuration: pluginData.configuration || {},
      status: 'draft',
      rating: 0,
      downloads: 0,
    });
    return this.pluginRepo.save(plugin) as unknown as Plugin;
  }

  async registerWebhook(organizationId: string, partnerId: string, webhookData: any) {
    const webhook = this.webhookRepo.create({
      organizationId,
      partnerId,
      eventType: webhookData.eventType,
      url: webhookData.url,
      headers: webhookData.headers || {},
      active: true,
      retryPolicy: webhookData.retryPolicy || { maxRetries: 3, backoffMs: 1000 },
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
    });
    return this.webhookRepo.save(webhook) as unknown as Webhook;
  }

  async createCustomModule(organizationId: string, moduleData: any) {
    const customModule = this.moduleRepo.create({
      organizationId,
      moduleName: moduleData.moduleName,
      description: moduleData.description,
      sourceCode: moduleData.sourceCode,
      dependencies: moduleData.dependencies || [],
      endpoints: moduleData.endpoints || [],
      dataModels: moduleData.dataModels || [],
      status: 'draft',
      testResults: {},
    });
    return this.moduleRepo.save(customModule) as unknown as CustomModule;
  }

  async getMarketplacePlugins(organizationId: string) {
    return this.pluginRepo.find({
      where: { organizationId, status: 'published' },
      order: { rating: 'DESC', downloads: 'DESC' },
    });
  }

  async getPartners(organizationId: string) {
    return this.partnerRepo.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async getWebhooks(organizationId: string, partnerId: string) {
    return this.webhookRepo.find({
      where: { organizationId, partnerId },
    });
  }

  async getCustomModules(organizationId: string) {
    return this.moduleRepo.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateWebhookMetrics(webhookId: string, success: boolean) {
    const webhook = await this.webhookRepo.findOne({ where: { id: webhookId } });
    if (!webhook) return null;

    webhook.totalDeliveries++;
    if (success) {
      webhook.successfulDeliveries++;
    } else {
      webhook.failedDeliveries++;
    }
    return this.webhookRepo.save(webhook) as unknown as Webhook;
  }

  async publishPlugin(organizationId: string, pluginId: string) {
    const plugin = await this.pluginRepo.findOne({ where: { id: pluginId, organizationId } });
    if (!plugin) return null;
    plugin.status = 'published';
    return this.pluginRepo.save(plugin) as unknown as Plugin;
  }

  async verifyPlugin(organizationId: string, pluginId: string) {
    const plugin = await this.pluginRepo.findOne({ where: { id: pluginId, organizationId } });
    if (!plugin) return null;
    plugin.status = 'verified';
    return this.pluginRepo.save(plugin) as unknown as Plugin;
  }
}
