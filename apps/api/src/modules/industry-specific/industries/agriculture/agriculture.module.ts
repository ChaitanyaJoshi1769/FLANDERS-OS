import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgricultureService } from './agriculture.service';
import { CropHealth } from './entities/crop-health.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropHealth])],
  providers: [AgricultureService],
  exports: [AgricultureService],
})
export class AgricultureModule {}
