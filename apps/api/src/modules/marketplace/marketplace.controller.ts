import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
@UseGuards(JwtGuard)
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) {}

  @Post('partners')
  async registerPartner(@Body() data: any) {
    return this.marketplaceService.registerPartner(data.organizationId, data);
  }

  @Get('partners/:organizationId')
  async getPartners(@Param('organizationId') organizationId: string) {
    return this.marketplaceService.getPartners(organizationId);
  }

  @Post('plugins')
  async publishPlugin(@Body() data: any) {
    return this.marketplaceService.publishPlugin(data.organizationId, data.partnerId, data);
  }

  @Put('plugins/:pluginId/publish')
  async publishPluginById(
    @Param('pluginId') pluginId: string,
    @Body() data: any,
  ) {
    return this.marketplaceService.publishPlugin(data.organizationId, pluginId);
  }

  @Put('plugins/:pluginId/verify')
  async verifyPlugin(
    @Param('pluginId') pluginId: string,
    @Body() data: any,
  ) {
    return this.marketplaceService.verifyPlugin(data.organizationId, pluginId);
  }

  @Get('plugins/:organizationId')
  async getMarketplacePlugins(@Param('organizationId') organizationId: string) {
    return this.marketplaceService.getMarketplacePlugins(organizationId);
  }

  @Post('webhooks')
  async registerWebhook(@Body() data: any) {
    return this.marketplaceService.registerWebhook(data.organizationId, data.partnerId, data);
  }

  @Get('webhooks/:organizationId/:partnerId')
  async getWebhooks(
    @Param('organizationId') organizationId: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.marketplaceService.getWebhooks(organizationId, partnerId);
  }

  @Post('custom-modules')
  async createCustomModule(@Body() data: any) {
    return this.marketplaceService.createCustomModule(data.organizationId, data);
  }

  @Get('custom-modules/:organizationId')
  async getCustomModules(@Param('organizationId') organizationId: string) {
    return this.marketplaceService.getCustomModules(organizationId);
  }
}
