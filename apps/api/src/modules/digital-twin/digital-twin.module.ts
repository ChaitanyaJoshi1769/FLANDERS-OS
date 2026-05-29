import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalTwinService } from './digital-twin.service';
import { DigitalTwinController } from './digital-twin.controller';
import { DigitalTwinModel } from './entities/digital-twin-model.entity';
import { SimulationRun } from './entities/simulation-run.entity';
import { VirtualEnvironment } from './entities/virtual-environment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalTwinModel, SimulationRun, VirtualEnvironment])],
  controllers: [DigitalTwinController],
  providers: [DigitalTwinService],
  exports: [DigitalTwinService],
})
export class DigitalTwinModule {}
