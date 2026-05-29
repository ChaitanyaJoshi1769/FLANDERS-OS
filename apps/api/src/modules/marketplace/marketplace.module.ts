import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { Partner } from './entities/partner.entity';
import { Plugin } from './entities/plugin.entity';
import { Webhook } from './entities/webhook.entity';
import { CustomModule } from './entities/custom-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, Plugin, Webhook, CustomModule])],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
