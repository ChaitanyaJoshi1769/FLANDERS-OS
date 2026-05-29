import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndustrySpecificService } from './industry-specific.service';
import { IndustrySpecificController } from './industry-specific.controller';
import { IndustryConfiguration } from './entities/industry-configuration.entity';
import { ConstructionModule } from './industries/construction/construction.module';
import { MiningModule } from './industries/mining/mining.module';
import { AgricultureModule } from './industries/agriculture/agriculture.module';
import { ManufacturingModule } from './industries/manufacturing/manufacturing.module';
import { LogisticsModule } from './industries/logistics/logistics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IndustryConfiguration]),
    ConstructionModule,
    MiningModule,
    AgricultureModule,
    ManufacturingModule,
    LogisticsModule,
  ],
  controllers: [IndustrySpecificController],
  providers: [IndustrySpecificService],
  exports: [IndustrySpecificService],
})
export class IndustrySpecificModule {}
