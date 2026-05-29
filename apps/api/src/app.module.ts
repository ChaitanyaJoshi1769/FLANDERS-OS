import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SitesModule } from './modules/sites/sites.module';
import { FleetsModule } from './modules/fleets/fleets.module';
import { MachinesModule } from './modules/machines/machines.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AutonomousModule } from './modules/autonomous/autonomous.module';
import { AutomationModule } from './modules/automation/automation.module';
import { SafetyModule } from './modules/safety/safety.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { FleetIntelligenceModule } from './modules/fleet-intelligence/fleet-intelligence.module';
import { IntegrationModule } from './modules/integration/integration.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { DigitalTwinModule } from './modules/digital-twin/digital-twin.module';
import { FleetOptimizationModule } from './modules/fleet-optimization/fleet-optimization.module';
import { IndustrySpecificModule } from './modules/industry-specific/industry-specific.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { typeOrmConfig } from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    SitesModule,
    FleetsModule,
    MachinesModule,
    TelemetryModule,
    FleetIntelligenceModule,
    MaintenanceModule,
    AutonomousModule,
    AutomationModule,
    SafetyModule,
    AnalyticsModule,
    IntegrationModule,
    CollaborationModule,
    DigitalTwinModule,
    FleetOptimizationModule,
    IndustrySpecificModule,
    MarketplaceModule,
    HealthModule,
  ],
})
export class AppModule {}
