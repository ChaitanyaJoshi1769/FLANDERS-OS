import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationController {
  constructor(private integrationService: IntegrationService) {}

  @Post('erp')
  async createERPIntegration(@Request() req, @Body() createDto: any) {
    return this.integrationService.createERPIntegration(req.user.organizationId, createDto);
  }

  @Get('erp/:erpId')
  async getERPIntegration(@Param('erpId') erpId: string) {
    return this.integrationService.getERPIntegration(erpId);
  }

  @Get('erp/organization/:organizationId')
  async getOrganizationERPIntegrations(@Param('organizationId') organizationId: string) {
    return this.integrationService.getOrganizationERPIntegrations(organizationId);
  }

  @Patch('erp/:erpId/status')
  async updateERPStatus(
    @Param('erpId') erpId: string,
    @Body() { status, lastSyncStatus }: any
  ) {
    return this.integrationService.updateERPStatus(erpId, status, lastSyncStatus);
  }

  @Post('erp/:erpId/test')
  async testERPConnection(@Param('erpId') erpId: string) {
    return this.integrationService.testERPConnection(erpId);
  }

  @Delete('erp/:erpId')
  async disableERPIntegration(@Param('erpId') erpId: string) {
    return this.integrationService.disableERPIntegration(erpId);
  }

  @Post('webhooks')
  async createWebhook(@Request() req, @Body() createDto: any) {
    return this.integrationService.createWebhook(req.user.organizationId, createDto);
  }

  @Get('webhooks/:webhookId')
  async getWebhook(@Param('webhookId') webhookId: string) {
    return this.integrationService.getWebhook(webhookId);
  }

  @Get('webhooks/organization/:organizationId')
  async getOrganizationWebhooks(@Param('organizationId') organizationId: string) {
    return this.integrationService.getOrganizationWebhooks(organizationId);
  }

  @Patch('webhooks/:webhookId/status')
  async updateWebhookStatus(
    @Param('webhookId') webhookId: string,
    @Body() { status }: any
  ) {
    return this.integrationService.updateWebhookStatus(webhookId, status);
  }

  @Post('webhooks/:webhookId/test')
  async testWebhook(@Param('webhookId') webhookId: string, @Body() eventData?: any) {
    const success = await this.integrationService.deliverWebhook(webhookId, eventData);
    return { success, message: success ? 'Webhook delivered successfully' : 'Webhook delivery failed' };
  }

  @Delete('webhooks/:webhookId')
  async deleteWebhook(@Param('webhookId') webhookId: string) {
    await this.integrationService.deleteWebhook(webhookId);
    return { message: 'Webhook deleted successfully' };
  }

  @Get('logs/organization/:organizationId')
  async getIntegrationLogs(
    @Param('organizationId') organizationId: string,
    @Query('integrationId') integrationId?: string,
    @Query('hoursBack') hoursBack: number = 24
  ) {
    return this.integrationService.getIntegrationLogs(organizationId, integrationId, hoursBack);
  }

  @Get('status/organization/:organizationId')
  async getIntegrationStatus(@Param('organizationId') organizationId: string) {
    return this.integrationService.getIntegrationStatus(organizationId);
  }

  @Get('metrics/webhook/:webhookId')
  async getWebhookMetrics(@Param('webhookId') webhookId: string) {
    return this.integrationService.getWebhookMetrics(webhookId);
  }
}
