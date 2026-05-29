import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiningService } from './mining.service';
import { OreExtraction } from './entities/ore-extraction.entity';
import { HazardZone } from './entities/hazard-zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OreExtraction, HazardZone])],
  providers: [MiningService],
  exports: [MiningService],
})
export class MiningModule {}
