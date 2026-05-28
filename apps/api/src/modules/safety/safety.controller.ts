import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('safety')
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('incidents/report')
  async reportIncident(@Body() createDto: any) {
    return this.safetyService.reportIncident(createDto);
  }

  @Get('incidents/:incidentId')
  async getIncident(@Param('incidentId') incidentId: string) {
    return this.safetyService.getIncidentById(incidentId);
  }

  @Get('incidents/fleet/:fleetId')
  async getFleetIncidents(
    @Param('fleetId') fleetId: string,
    @Query('status') status?: string,
    @Query('severity') severity?: string
  ) {
    return this.safetyService.getFleetIncidents(fleetId, status, severity);
  }

  @Patch('incidents/:incidentId/status')
  async updateIncidentStatus(
    @Param('incidentId') incidentId: string,
    @Body() { status, rootCause, correctionAction }: any
  ) {
    return this.safetyService.updateIncidentStatus(incidentId, status, rootCause, correctionAction);
  }

  @Post('audits/create')
  async createAudit(@Body() createDto: any) {
    return this.safetyService.createComplianceAudit(createDto);
  }

  @Get('audits/:auditId')
  async getAudit(@Param('auditId') auditId: string) {
    return this.safetyService.getAuditById(auditId);
  }

  @Get('audits/organization/:organizationId')
  async getOrganizationAudits(@Param('organizationId') organizationId: string) {
    return this.safetyService.getOrganizationAudits(organizationId);
  }

  @Patch('audits/:auditId/status')
  async updateAuditStatus(
    @Param('auditId') auditId: string,
    @Body() { status, complianceScore, findings }: any
  ) {
    return this.safetyService.updateAuditStatus(auditId, status, complianceScore, findings);
  }

  @Post('monitoring/record')
  async recordMonitoring(@Body() createDto: any) {
    return this.safetyService.recordSafetyMonitoring(createDto);
  }

  @Get('monitoring/fleet/:fleetId')
  async getFleetMonitoring(
    @Param('fleetId') fleetId: string,
    @Query('hoursBack') hoursBack: number = 24
  ) {
    return this.safetyService.getFleetSafetyMonitoring(fleetId, hoursBack);
  }

  @Get('monitoring/fleet/:fleetId/alerts')
  async getActiveAlerts(@Param('fleetId') fleetId: string) {
    return this.safetyService.getActiveAlerts(fleetId);
  }

  @Get('stats/incidents/:fleetId')
  async getIncidentStats(
    @Param('fleetId') fleetId: string,
    @Query('daysBack') daysBack: number = 30
  ) {
    return this.safetyService.getIncidentStats(fleetId, daysBack);
  }

  @Get('stats/compliance/:organizationId')
  async getComplianceStatus(@Param('organizationId') organizationId: string) {
    return this.safetyService.getComplianceStatus(organizationId);
  }

  @Get('incidents/type/:incidentType/fleet/:fleetId')
  async getIncidentsByType(
    @Param('fleetId') fleetId: string,
    @Param('incidentType') incidentType: string
  ) {
    return this.safetyService.getIncidentsByType(fleetId, incidentType);
  }

  @Get('trends/fleet/:fleetId')
  async getSafetyTrends(
    @Param('fleetId') fleetId: string,
    @Query('daysBack') daysBack: number = 90
  ) {
    return this.safetyService.getSafetyTrendAnalysis(fleetId, daysBack);
  }
}
