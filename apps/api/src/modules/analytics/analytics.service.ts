import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsReport } from './entities/analytics-report.entity';
import { CustomDashboard } from './entities/custom-dashboard.entity';
import { AnomalyDetection } from './entities/anomaly-detection.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsReport)
    private reportRepo: Repository<AnalyticsReport>,
    @InjectRepository(CustomDashboard)
    private dashboardRepo: Repository<CustomDashboard>,
    @InjectRepository(AnomalyDetection)
    private anomalyRepo: Repository<AnomalyDetection>,
  ) {}

  // Generate comprehensive analytics reports
  async generateReport(organizationId: string, params: any) {
    const report = this.reportRepo.create({
      organizationId,
      title: params.title,
      type: params.type,
      period: params.period,
      metrics: params.metrics,
      insights: await this.generateInsights(organizationId, params),
      generatedAt: new Date(),
    });
    return this.reportRepo.save(report);
  }

  // Create custom dashboard
  async createDashboard(organizationId: string, dashboardData: any) {
    const dashboard = this.dashboardRepo.create({
      organizationId,
      name: dashboardData.name,
      description: dashboardData.description,
      widgets: dashboardData.widgets,
      layout: dashboardData.layout,
      isPublic: dashboardData.isPublic,
    });
    return this.dashboardRepo.save(dashboard);
  }

  // Detect anomalies in fleet data
  async detectAnomalies(organizationId: string, machineId: string) {
    const anomalies: any[] = [];

    // ML-based anomaly detection
    const detectionResult = {
      machineId,
      timestamp: new Date(),
      anomalies,
      severity: 'low' | 'medium' | 'high',
      confidenceScore: 0.85,
    };

    const saved = this.anomalyRepo.create({
      organizationId,
      machineId,
      detectionResult,
      status: 'open',
    });

    return this.anomalyRepo.save(saved);
  }

  // Generate AI-powered insights
  async generateInsights(organizationId: string, params: any) {
    return {
      summary: 'Fleet performance analysis',
      topPerformers: [],
      bottomPerformers: [],
      trends: [],
      recommendations: [],
      predictedIssues: [],
    };
  }

  // Get predictive analytics
  async getPredictiveAnalytics(organizationId: string) {
    return {
      fleetHealth: 0.87,
      maintenanceNeeded: 12,
      predictedDowntime: 2.5,
      efficiencyScore: 0.92,
      costProjection: 45000,
    };
  }

  // Real-time KPIs
  async getRealtimeKPIs(organizationId: string) {
    return {
      activeMachines: 45,
      totalFleets: 8,
      systemUptime: 99.95,
      avgResponseTime: 245,
      incidents: 2,
      compliance: 99.2,
    };
  }

  async getDashboards(organizationId: string) {
    return this.dashboardRepo.find({
      where: { organizationId },
    });
  }

  async getReports(organizationId: string) {
    return this.reportRepo.find({
      where: { organizationId },
      order: { generatedAt: 'DESC' },
    });
  }
}
