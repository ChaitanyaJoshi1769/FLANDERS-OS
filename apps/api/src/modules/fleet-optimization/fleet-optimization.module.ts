import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FleetOptimizationService } from './fleet-optimization.service';
import { FleetOptimizationController } from './fleet-optimization.controller';
import { RouteOptimization } from './entities/route-optimization.entity';
import { LoadBalancing } from './entities/load-balancing.entity';
import { FuelEfficiency } from './entities/fuel-efficiency.entity';
import { CapacityPlan } from './entities/capacity-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RouteOptimization,
      LoadBalancing,
      FuelEfficiency,
      CapacityPlan,
    ]),
  ],
  controllers: [FleetOptimizationController],
  providers: [FleetOptimizationService],
  exports: [FleetOptimizationService],
})
export class FleetOptimizationModule {}
