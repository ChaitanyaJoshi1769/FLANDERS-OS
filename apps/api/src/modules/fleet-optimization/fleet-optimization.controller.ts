import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { FleetOptimizationService } from './fleet-optimization.service';

@Controller('fleet-optimization')
@UseGuards(JwtGuard)
export class FleetOptimizationController {
  constructor(private fleetOptimizationService: FleetOptimizationService) {}

  @Post('routes')
  async optimizeRoute(@Body() data: any) {
    return this.fleetOptimizationService.optimizeRoute(data.organizationId, data);
  }

  @Get('routes/:organizationId/:fleetId')
  async getRouteOptimizations(
    @Param('organizationId') organizationId: string,
    @Param('fleetId') fleetId: string,
  ) {
    return this.fleetOptimizationService.getRouteOptimizations(organizationId, fleetId);
  }

  @Post('load-balance')
  async analyzeLoadBalance(@Body() data: any) {
    return this.fleetOptimizationService.analyzeLoadBalance(data.organizationId, data.fleetId, data.machineLoads);
  }

  @Get('load-balance/:organizationId/:fleetId')
  async getLoadBalancingAnalysis(
    @Param('organizationId') organizationId: string,
    @Param('fleetId') fleetId: string,
  ) {
    return this.fleetOptimizationService.getLoadBalancingAnalysis(organizationId, fleetId);
  }

  @Post('fuel-efficiency')
  async optimizeFuelEfficiency(@Body() data: any) {
    return this.fleetOptimizationService.optimizeFuelEfficiency(data.organizationId, data.machineId, data.metrics);
  }

  @Get('fuel-efficiency/:organizationId/:machineId')
  async getFuelEfficiencyReport(
    @Param('organizationId') organizationId: string,
    @Param('machineId') machineId: string,
  ) {
    return this.fleetOptimizationService.getFuelEfficiencyReport(organizationId, machineId);
  }

  @Post('capacity-plan')
  async createCapacityPlan(@Body() data: any) {
    return this.fleetOptimizationService.createCapacityPlan(data.organizationId, data);
  }

  @Get('capacity-plans/:organizationId/:fleetId')
  async getCapacityPlans(
    @Param('organizationId') organizationId: string,
    @Param('fleetId') fleetId: string,
  ) {
    return this.fleetOptimizationService.getCapacityPlans(organizationId, fleetId);
  }
}
