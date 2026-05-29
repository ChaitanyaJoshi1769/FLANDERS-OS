import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturingService } from './manufacturing.service';
import { ProductionMetrics } from './entities/production-metrics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionMetrics])],
  providers: [ManufacturingService],
  exports: [ManufacturingService],
})
export class ManufacturingModule {}
