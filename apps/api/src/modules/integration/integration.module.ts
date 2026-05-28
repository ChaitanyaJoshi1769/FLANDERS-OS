import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERPIntegration } from './entities/erp-integration.entity';
import { Webhook } from './entities/webhook.entity';
import { IntegrationLog } from './entities/integration-log.entity';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ERPIntegration, Webhook, IntegrationLog])],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
