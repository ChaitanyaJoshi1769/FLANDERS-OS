import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('telemetry')
export class TelemetryController {
  constructor(private telemetryService: TelemetryService) {}

  @Post('sensor-events')
  async ingestSensorEvent(
    @Body() dto: {
      machineId: string;
      sensorName: string;
      value: number;
      unit?: string;
      minThreshold?: number;
      maxThreshold?: number;
      metadata?: Record<string, any>;
    }
  ) {
    return this.telemetryService.ingestSensorEvent(dto.machineId, dto);
  }

  @Post('batch-events')
  async ingestBatchEvents(@Body() dto: { events: any[] }) {
    const results = [];
    for (const event of dto.events) {
      results.push(
        await this.telemetryService.ingestSensorEvent(event.machineId, event)
      );
    }
    return {
      count: results.length,
      results,
    };
  }

  @Post('operational-metrics')
  async ingestOperationalMetrics(
    @Body() dto: {
      machineId: string;
      utilizationPercent?: number;
      fuelConsumptionRate?: number;
      powerOutput?: number;
      cycleTimeSeconds?: number;
      payloadWeight?: number;
      temperatureCelsius?: number;
      vibrationLevel?: number;
    }
  ) {
    return this.telemetryService.ingestOperationalMetrics(dto.machineId, dto);
  }

  @Get('machines/:machineId')
  async getMachineTelemetry(
    @Param('machineId') machineId: string,
    @Query('limit') limit: number = 100
  ) {
    return this.telemetryService.getMachineTelemetry(machineId, limit);
  }

  @Get('machines/:machineId/latest')
  async getMachineLatestTelemetry(@Param('machineId') machineId: string) {
    return this.telemetryService.getMachineLatestTelemetry(machineId);
  }

  @Get('machines/:machineId/anomalies')
  async getAnomalies(
    @Param('machineId') machineId: string,
    @Query('limit') limit: number = 50
  ) {
    return this.telemetryService.getAnomalies(machineId, limit);
  }
}
