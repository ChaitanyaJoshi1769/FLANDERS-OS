import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { FailureEvent } from './entities/failure-event.entity';
import { MaintenancePrediction } from './entities/maintenance-prediction.entity';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, FailureEvent, MaintenancePrediction])],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
