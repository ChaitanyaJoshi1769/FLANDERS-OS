import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Post('work-orders')
  async createWorkOrder(@Body() createDto: any) {
    return this.maintenanceService.createWorkOrder(createDto);
  }

  @Get('work-orders/machine/:machineId')
  async getWorkOrders(@Param('machineId') machineId: string) {
    return this.maintenanceService.getWorkOrders(machineId);
  }

  @Get('work-orders/:id')
  async getWorkOrder(@Param('id') id: string) {
    return this.maintenanceService.getWorkOrder(id);
  }

  @Patch('work-orders/:id')
  async updateWorkOrder(@Param('id') id: string, @Body() updateDto: any) {
    return this.maintenanceService.updateWorkOrder(id, updateDto);
  }

  @Post('failure-events')
  async recordFailureEvent(@Body() createDto: any) {
    return this.maintenanceService.recordFailureEvent(createDto);
  }

  @Get('failure-history/:machineId')
  async getFailureHistory(
    @Param('machineId') machineId: string,
    @Query('days') days: number = 30
  ) {
    return this.maintenanceService.getFailureHistory(machineId, days);
  }

  @Post('predictions')
  async createPrediction(@Body() createDto: any) {
    return this.maintenanceService.createPrediction(createDto);
  }

  @Get('predictions/:machineId')
  async getPredictions(@Param('machineId') machineId: string) {
    return this.maintenanceService.getPredictions(machineId);
  }

  @Get('upcoming-failures')
  async getUpcomingFailures(@Request() req) {
    return this.maintenanceService.getUpcomingFailures(req.user.organizationId);
  }

  @Get('schedule')
  async getMaintenanceSchedule(@Request() req) {
    return this.maintenanceService.getMaintenanceSchedule(req.user.organizationId);
  }

  @Get('machine/:machineId/rul')
  async getRemainingUsefulLife(@Param('machineId') machineId: string) {
    return this.maintenanceService.calculateRemainingUsefulLife(machineId);
  }
}
