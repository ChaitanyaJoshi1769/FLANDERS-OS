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
import { AutonomousService } from './autonomous.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('autonomous')
export class AutonomousController {
  constructor(private autonomousService: AutonomousService) {}

  @Post('missions/fleet/:fleetId')
  async createMission(
    @Param('fleetId') fleetId: string,
    @Body() createDto: any
  ) {
    return this.autonomousService.createMission(fleetId, createDto);
  }

  @Get('missions/:missionId')
  async getMission(@Param('missionId') missionId: string) {
    return this.autonomousService.getMissionById(missionId);
  }

  @Get('missions/fleet/:fleetId')
  async getFleetMissions(
    @Param('fleetId') fleetId: string,
    @Query('status') status?: string
  ) {
    return this.autonomousService.getFleetMissions(fleetId, status);
  }

  @Patch('missions/:missionId/assign/:machineId')
  async assignMission(
    @Param('missionId') missionId: string,
    @Param('machineId') machineId: string
  ) {
    return this.autonomousService.assignMissionToMachine(missionId, machineId);
  }

  @Patch('missions/:missionId/status')
  async updateMissionStatus(
    @Param('missionId') missionId: string,
    @Body() { status, failureReason }: any
  ) {
    return this.autonomousService.updateMissionStatus(missionId, status, failureReason);
  }

  @Post('routes/optimize')
  async optimizeRoute(@Body() { waypoints }: any) {
    return this.autonomousService.optimizeRoute(waypoints);
  }

  @Post('coordination/fleet/:fleetId')
  async createCoordination(
    @Param('fleetId') fleetId: string,
    @Body() { missionIds, coordinationStrategy }: any
  ) {
    return this.autonomousService.createFleetCoordination(fleetId, missionIds, coordinationStrategy);
  }

  @Get('coordination/fleet/:fleetId')
  async getCoordinations(@Param('fleetId') fleetId: string) {
    return this.autonomousService.getFleetCoordinations(fleetId);
  }

  @Patch('coordination/:coordinationId/activate')
  async activateCoordination(@Param('coordinationId') coordinationId: string) {
    return this.autonomousService.activateCoordination(coordinationId);
  }

  @Patch('coordination/:coordinationId/complete')
  async completeCoordination(@Param('coordinationId') coordinationId: string) {
    return this.autonomousService.completeCoordination(coordinationId);
  }

  @Post('missions/:missionId/events')
  async recordMissionEvent(
    @Param('missionId') missionId: string,
    @Body() { logType, message, severity, data }: any
  ) {
    return this.autonomousService.recordMissionEvent(missionId, logType, message, severity, data);
  }

  @Get('missions/:missionId/logs')
  async getMissionLogs(@Param('missionId') missionId: string) {
    return this.autonomousService.getMissionExecutionLogs(missionId);
  }

  @Get('fleet/:fleetId/errors')
  async getRecentErrors(
    @Param('fleetId') fleetId: string,
    @Query('hoursBack') hoursBack: number = 24
  ) {
    return this.autonomousService.getRecentErrors(fleetId, hoursBack);
  }

  @Get('stats/fleet/:fleetId')
  async getAutonomousStats(
    @Param('fleetId') fleetId: string,
    @Query('daysBack') daysBack: number = 30
  ) {
    return this.autonomousService.getAutonomousStats(fleetId, daysBack);
  }
}
