import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionService } from './construction.service';
import { SiteData } from './entities/site-data.entity';
import { SafetyCompliance } from './entities/safety-compliance.entity';
import { EquipmentTracking } from './entities/equipment-tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteData, SafetyCompliance, EquipmentTracking])],
  providers: [ConstructionService],
  exports: [ConstructionService],
})
export class ConstructionModule {}
