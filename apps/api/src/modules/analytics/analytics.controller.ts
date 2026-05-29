import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('reports')
  async generateReport(@Body() data: any) {
    return this.analyticsService.generateReport(data.organizationId, data);
  }

  @Get('reports/:organizationId')
  async getReports(@Param('organizationId') organizationId: string) {
    return this.analyticsService.getReports(organizationId);
  }

  @Post('dashboards')
  async createDashboard(@Body() data: any) {
    return this.analyticsService.createDashboard(data.organizationId, data);
  }

  @Get('dashboards/:organizationId')
  async getDashboards(@Param('organizationId') organizationId: string) {
    return this.analyticsService.getDashboards(organizationId);
  }

  @Get('anomalies/:organizationId/:machineId')
  async detectAnomalies(
    @Param('organizationId') organizationId: string,
    @Param('machineId') machineId: string,
  ) {
    return this.analyticsService.detectAnomalies(organizationId, machineId);
  }

  @Get('insights/:organizationId')
  async getInsights(@Param('organizationId') organizationId: string) {
    return this.analyticsService.getPredictiveAnalytics(organizationId);
  }

  @Get('kpis/:organizationId')
  async getKPIs(@Param('organizationId') organizationId: string) {
    return this.analyticsService.getRealtimeKPIs(organizationId);
  }
}
