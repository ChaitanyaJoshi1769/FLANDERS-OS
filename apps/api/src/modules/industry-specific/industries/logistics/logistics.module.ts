import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogisticsService } from './logistics.service';
import { DeliveryTracking } from './entities/delivery-tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryTracking])],
  providers: [LogisticsService],
  exports: [LogisticsService],
})
export class LogisticsModule {}
