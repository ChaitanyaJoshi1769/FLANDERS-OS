import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorEvent } from './entities/sensor-event.entity';
import { OperationalMetric } from './entities/operational-metric.entity';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SensorEvent, OperationalMetric])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
