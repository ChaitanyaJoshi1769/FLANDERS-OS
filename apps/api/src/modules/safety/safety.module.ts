import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafetyIncident } from './entities/safety-incident.entity';
import { ComplianceAudit } from './entities/compliance-audit.entity';
import { SafetyMonitoring } from './entities/safety-monitoring.entity';
import { SafetyService } from './safety.service';
import { SafetyController } from './safety.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SafetyIncident, ComplianceAudit, SafetyMonitoring])],
  controllers: [SafetyController],
  providers: [SafetyService],
  exports: [SafetyService],
})
export class SafetyModule {}
