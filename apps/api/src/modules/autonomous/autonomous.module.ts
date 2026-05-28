import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutonomousMission } from './entities/autonomous-mission.entity';
import { FleetCoordination } from './entities/fleet-coordination.entity';
import { MissionExecutionLog } from './entities/mission-execution-log.entity';
import { AutonomousService } from './autonomous.service';
import { AutonomousController } from './autonomous.controller';
import { MachinesModule } from '../machines/machines.module';
import { FleetsModule } from '../fleets/fleets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutonomousMission, FleetCoordination, MissionExecutionLog]),
    MachinesModule,
    FleetsModule,
  ],
  controllers: [AutonomousController],
  providers: [AutonomousService],
  exports: [AutonomousService],
})
export class AutonomousModule {}
