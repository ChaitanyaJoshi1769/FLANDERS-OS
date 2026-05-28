import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FleetIntelligenceService } from './fleet-intelligence.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('fleet-intelligence')
export class FleetIntelligenceController {
  constructor(private fleetIntelligenceService: FleetIntelligenceService) {}

  @Get('fleets/:fleetId/health')
  async getFleetHealth(@Param('fleetId') fleetId: string) {
    return this.fleetIntelligenceService.getFleetHealth(fleetId);
  }

  @Get('machines/:machineId/health')
  async getMachineHealth(@Param('machineId') machineId: string) {
    return this.fleetIntelligenceService.getMachineHealth(machineId);
  }

  @Get('fleets/:fleetId/utilization-trend')
  async getFleetUtilizationTrend(
    @Param('fleetId') fleetId: string,
    @Query('hoursBack') hoursBack: number = 24
  ) {
    return this.fleetIntelligenceService.getFleetUtilizationTrend(
      fleetId,
      hoursBack
    );
  }
}
