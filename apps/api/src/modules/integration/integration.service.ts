import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ERPIntegration } from './entities/erp-integration.entity';
import { Webhook } from './entities/webhook.entity';
import { IntegrationLog } from './entities/integration-log.entity';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectRepository(ERPIntegration)
    private erpRepository: Repository<ERPIntegration>,
    @InjectRepository(Webhook)
    private webhookRepository: Repository<Webhook>,
    @InjectRepository(IntegrationLog)
    private logRepository: Repository<IntegrationLog>,
  ) {}

  async createERPIntegration(organizationId: string, createDto: any): Promise<ERPIntegration> {
    const erp = this.erpRepository.create({
      organizationId,
      ...createDto,
      status: 'pending_auth',
    });

    return await this.erpRepository.save(erp) as unknown as ERPIntegration;
  }

  async getERPIntegration(erpId: string): Promise<ERPIntegration> {
    const erp = await this.erpRepository.findOne({
      where: { id: erpId },
      relations: ['organization'],
    });

    if (!erp) {
      throw new NotFoundException(`ERP Integration ${erpId} not found`);
    }

    return erp;
  }

  async getOrganizationERPIntegrations(organizationId: string): Promise<ERPIntegration[]> {
    return this.erpRepository.find({
      where: { organizationId },
      relations: ['organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateERPStatus(erpId: string, status: string, lastSyncStatus?: string): Promise<ERPIntegration> {
    const erp = await this.getERPIntegration(erpId);

    erp.status = status as any;
    if (lastSyncStatus) {
      erp.lastSyncStatus = lastSyncStatus;
      erp.lastSyncTime = new Date();
    }

    return await this.erpRepository.save(erp) as unknown as ERPIntegration;
  }

  async testERPConnection(erpId: string): Promise<{ success: boolean; message: string }> {
    const erp = await this.getERPIntegration(erpId);

    try {
      // Simulate connection test - in production, would actually test the connection
      await this.logIntegrationEvent(
        erp.organizationId,
        erpId,
        'erp',
        'connection_test',
        'success',
        'Connection test successful',
        200
      );

      erp.status = 'connected';
      await this.erpRepository.save(erp);

      return { success: true, message: 'Connection successful' };
    } catch (error) {
      await this.logIntegrationEvent(
        erp.organizationId,
        erpId,
        'erp',
        'connection_test',
        'failure',
        `Connection failed: ${error.message}`,
        500
      );

      erp.status = 'error';
      await this.erpRepository.save(erp);

      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }

  async createWebhook(organizationId: string, createDto: any): Promise<Webhook> {
    const webhook = this.webhookRepository.create({
      organizationId,
      ...createDto,
      status: 'active',
    });

    return await this.webhookRepository.save(webhook) as unknown as Webhook;
  }

  async getWebhook(webhookId: string): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({
      where: { id: webhookId },
      relations: ['organization'],
    });

    if (!webhook) {
      throw new NotFoundException(`Webhook ${webhookId} not found`);
    }

    return webhook;
  }

  async getOrganizationWebhooks(organizationId: string): Promise<Webhook[]> {
    return this.webhookRepository.find({
      where: { organizationId },
      relations: ['organization'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateWebhookStatus(webhookId: string, status: string): Promise<Webhook> {
    const webhook = await this.getWebhook(webhookId);

    webhook.status = status as any;

    return await this.webhookRepository.save(webhook) as unknown as Webhook;
  }

  async deliverWebhook(webhookId: string, eventData: any): Promise<boolean> {
    const webhook = await this.getWebhook(webhookId);

    if (webhook.status === 'inactive' || webhook.status === 'disabled') {
      return false;
    }

    try {
      // Simulate webhook delivery - in production would actually send HTTP request
      webhook.totalDeliveries++;
      webhook.successfulDeliveries++;
      webhook.lastDeliveryTime = new Date();
      webhook.lastDeliveryStatus = '200 OK';

      await this.webhookRepository.save(webhook);

      await this.logIntegrationEvent(
        webhook.organizationId,
        webhookId,
        'webhook',
        webhook.eventType,
        'success',
        'Webhook delivered successfully',
        200,
        eventData
      );

      return true;
    } catch (error) {
      webhook.totalDeliveries++;
      webhook.failedDeliveries++;
      webhook.lastDeliveryTime = new Date();
      webhook.lastDeliveryStatus = `Error: ${error.message}`;
      webhook.lastErrorMessage = error.message;
      webhook.retryAttempts = (webhook.retryAttempts || 0) + 1;

      await this.webhookRepository.save(webhook);

      await this.logIntegrationEvent(
        webhook.organizationId,
        webhookId,
        'webhook',
        webhook.eventType,
        'failure',
        `Webhook delivery failed: ${error.message}`,
        500,
        eventData,
        error.message
      );

      return false;
    }
  }

  async logIntegrationEvent(
    organizationId: string,
    integrationId: string,
    integrationType: string,
    eventType: string,
    status: string,
    message: string,
    httpStatusCode: number = 200,
    requestPayload?: any,
    errorDetails?: string
  ): Promise<IntegrationLog> {
    const log = this.logRepository.create({
      organizationId,
      integrationId,
      integrationType,
      eventType,
      status: status as any,
      message,
      httpStatusCode,
      requestPayload: requestPayload || {},
      errorDetails,
    });

    return await this.logRepository.save(log) as unknown as IntegrationLog;
  }

  async getIntegrationLogs(
    organizationId: string,
    integrationId?: string,
    hoursBack: number = 24
  ): Promise<IntegrationLog[]> {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    const query = this.logRepository.createQueryBuilder('log')
      .where('log.organizationId = :organizationId', { organizationId })
      .andWhere('log.timestamp >= :since', { since });

    if (integrationId) {
      query.andWhere('log.integrationId = :integrationId', { integrationId });
    }

    return query.orderBy('log.timestamp', 'DESC').getMany();
  }

  async getIntegrationStatus(organizationId: string): Promise<any> {
    const erps = await this.erpRepository.find({ where: { organizationId } });
    const webhooks = await this.webhookRepository.find({ where: { organizationId } });

    const connectedERPs = erps.filter((e) => e.status === 'connected').length;
    const activeWebhooks = webhooks.filter((w) => w.status === 'active').length;

    const recentLogs = await this.getIntegrationLogs(organizationId, undefined, 24);
    const successLogs = recentLogs.filter((l) => l.status === 'success').length;
    const failureLogs = recentLogs.filter((l) => l.status === 'failure').length;

    return {
      totalERPIntegrations: erps.length,
      connectedERPIntegrations: connectedERPs,
      totalWebhooks: webhooks.length,
      activeWebhooks,
      successfulDeliveries: successLogs,
      failedDeliveries: failureLogs,
      deliverySuccessRate:
        recentLogs.length > 0 ? ((successLogs / recentLogs.length) * 100).toFixed(2) : '0',
      lastSync: erps.length > 0 ? Math.max(...erps.map((e) => e.lastSyncTime?.getTime() || 0)) : null,
    };
  }

  async getWebhookMetrics(webhookId: string): Promise<any> {
    const webhook = await this.getWebhook(webhookId);

    const totalDeliveries = webhook.totalDeliveries || 0;
    const successfulDeliveries = webhook.successfulDeliveries || 0;
    const failedDeliveries = webhook.failedDeliveries || 0;

    return {
      webhookId,
      status: webhook.status,
      totalDeliveries,
      successfulDeliveries,
      failedDeliveries,
      successRate: totalDeliveries > 0 ? ((successfulDeliveries / totalDeliveries) * 100).toFixed(2) : '0',
      failureRate: totalDeliveries > 0 ? ((failedDeliveries / totalDeliveries) * 100).toFixed(2) : '0',
      lastDeliveryTime: webhook.lastDeliveryTime,
      lastDeliveryStatus: webhook.lastDeliveryStatus,
      retryAttempts: webhook.retryAttempts,
      maxRetries: webhook.maxRetries,
    };
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    const webhook = await this.getWebhook(webhookId);
    await this.webhookRepository.remove(webhook);
  }

  async disableERPIntegration(erpId: string): Promise<ERPIntegration> {
    const erp = await this.getERPIntegration(erpId);
    erp.status = 'disabled';
    return await this.erpRepository.save(erp) as unknown as ERPIntegration;
  }
}
