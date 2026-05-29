import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { DigitalTwinService } from './digital-twin.service';

@Controller('digital-twins')
@UseGuards(JwtGuard)
export class DigitalTwinController {
  constructor(private digitalTwinService: DigitalTwinService) {}

  @Post()
  async createTwin(@Body() data: any) {
    return this.digitalTwinService.createDigitalTwin(data.organizationId, data);
  }

  @Get(':organizationId/:machineId')
  async getTwin(
    @Param('organizationId') organizationId: string,
    @Param('machineId') machineId: string,
  ) {
    return this.digitalTwinService.getDigitalTwin(organizationId, machineId);
  }

  @Post('simulations')
  async runSimulation(@Body() data: any) {
    return this.digitalTwinService.runSimulation(data.organizationId, data);
  }

  @Get('simulations/:organizationId/:twinId')
  async getSimulations(
    @Param('organizationId') organizationId: string,
    @Param('twinId') twinId: string,
  ) {
    return this.digitalTwinService.getSimulations(organizationId, twinId);
  }

  @Get('simulation-results/:simulationId')
  async getResults(@Param('simulationId') simulationId: string) {
    return this.digitalTwinService.getSimulationResults(simulationId);
  }

  @Post('environments')
  async createEnvironment(@Body() data: any) {
    return this.digitalTwinService.createVirtualEnvironment(data.organizationId, data);
  }

  @Get('environments/:organizationId')
  async getEnvironments(@Param('organizationId') organizationId: string) {
    return this.digitalTwinService.getEnvironments(organizationId);
  }

  @Post('replay/:organizationId/:machineId')
  async replayData(
    @Param('organizationId') organizationId: string,
    @Param('machineId') machineId: string,
    @Body() dateRange: any,
  ) {
    return this.digitalTwinService.replayHistoricalData(organizationId, machineId, dateRange);
  }
}
