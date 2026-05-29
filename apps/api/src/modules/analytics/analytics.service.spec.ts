import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsReport } from './entities/analytics-report.entity';
import { CustomDashboard } from './entities/custom-dashboard.entity';
import { AnomalyDetection } from './entities/anomaly-detection.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  const mockReportRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
  const mockDashboardRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
  const mockAnomalyRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: getRepositoryToken(AnalyticsReport), useValue: mockReportRepo },
        { provide: getRepositoryToken(CustomDashboard), useValue: mockDashboardRepo },
        { provide: getRepositoryToken(AnomalyDetection), useValue: mockAnomalyRepo },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateReport', () => {
    it('should generate a fleet health report', async () => {
      const reportData = {
        type: 'fleet_health',
        period: 'monthly',
        filters: {},
      };

      mockReportRepo.create.mockReturnValue(reportData);
      mockReportRepo.save.mockResolvedValue(reportData);

      const result = await service.generateReport('org1', reportData);
      expect(mockReportRepo.save).toHaveBeenCalled();
    });
  });

  describe('createDashboard', () => {
    it('should create custom dashboard', async () => {
      const dashboardData = {
        organizationId: 'org1',
        name: 'Executive Dashboard',
        widgets: [{ type: 'kpi', metric: 'uptime' }],
      };

      mockDashboardRepo.create.mockReturnValue(dashboardData);
      mockDashboardRepo.save.mockResolvedValue(dashboardData);

      const result = await service.createDashboard('org1', dashboardData);
      expect(mockDashboardRepo.save).toHaveBeenCalled();
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalies', async () => {
      const anomalyData = {
        organizationId: 'org1',
        dataSource: 'fleet_metrics',
        timeWindow: 24,
      };

      mockAnomalyRepo.create.mockReturnValue({});
      mockAnomalyRepo.save.mockResolvedValue({});

      await service.detectAnomalies('org1', anomalyData);
      expect(mockAnomalyRepo.save).toHaveBeenCalled();
    });
  });

  describe('generateInsights', () => {
    it('should generate insights', async () => {
      const insights = await service.generateInsights('org1');
      expect(Array.isArray(insights)).toBe(true);
    });
  });

  describe('getPredictiveAnalytics', () => {
    it('should get predictive analytics', async () => {
      const predictions = await service.getPredictiveAnalytics('org1');
      expect(predictions).toBeDefined();
      expect(predictions.fleetHealth).toBeDefined();
    });
  });

  describe('getRealtimeKPIs', () => {
    it('should get real-time KPIs', async () => {
      const kpis = await service.getRealtimeKPIs('org1');
      expect(kpis).toBeDefined();
      expect(kpis.activeMachines).toBeDefined();
    });
  });
});
