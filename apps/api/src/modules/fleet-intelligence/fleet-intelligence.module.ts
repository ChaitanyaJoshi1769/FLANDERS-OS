import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fleet } from '../fleets/fleet.entity';
import { Machine } from '../machines/machine.entity';
import { SensorEvent } from '../telemetry/entities/sensor-event.entity';
import { OperationalMetric } from '../telemetry/entities/operational-metric.entity';
import { FleetIntelligenceService } from './fleet-intelligence.service';
import { FleetIntelligenceController } from './fleet-intelligence.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fleet, Machine, SensorEvent, OperationalMetric]),
  ],
  controllers: [FleetIntelligenceController],
  providers: [FleetIntelligenceService],
  exports: [FleetIntelligenceService],
})
export class FleetIntelligenceModule {}
