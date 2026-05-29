import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FleetOptimizationService } from './fleet-optimization.service';
import { RouteOptimization } from './entities/route-optimization.entity';
import { LoadBalancing } from './entities/load-balancing.entity';
import { FuelEfficiency } from './entities/fuel-efficiency.entity';
import { CapacityPlan } from './entities/capacity-plan.entity';

describe('FleetOptimizationService', () => {
  let service: FleetOptimizationService;
  const mockRouteRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };
  const mockLoadRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
  const mockFuelRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
  const mockCapacityRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FleetOptimizationService,
        { provide: getRepositoryToken(RouteOptimization), useValue: mockRouteRepo },
        { provide: getRepositoryToken(LoadBalancing), useValue: mockLoadRepo },
        { provide: getRepositoryToken(FuelEfficiency), useValue: mockFuelRepo },
        { provide: getRepositoryToken(CapacityPlan), useValue: mockCapacityRepo },
      ],
    }).compile();

    service = module.get<FleetOptimizationService>(FleetOptimizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('optimizeRoute', () => {
    it('should optimize a route', async () => {
      const routeData = {
        fleetId: 'fleet1',
        name: 'Route A',
        waypoints: [
          { latitude: 10, longitude: 20, priority: 1 },
          { latitude: 11, longitude: 21, priority: 2 },
        ],
      };

      mockRouteRepo.create.mockReturnValue(routeData);
      mockRouteRepo.save.mockResolvedValue(routeData);

      const result = await service.optimizeRoute('org1', routeData);
      expect(mockRouteRepo.save).toHaveBeenCalled();
    });
  });

  describe('analyzeLoadBalance', () => {
    it('should analyze load balance', async () => {
      const machineLoads = [
        { machineId: 'M1', utilization: 80, maxCapacity: 100 },
        { machineId: 'M2', utilization: 50, maxCapacity: 100 },
      ];

      mockLoadRepo.create.mockReturnValue({});
      mockLoadRepo.save.mockResolvedValue({});

      await service.analyzeLoadBalance('org1', 'fleet1', machineLoads);
      expect(mockLoadRepo.save).toHaveBeenCalled();
    });
  });

  describe('optimizeFuelEfficiency', () => {
    it('should optimize fuel efficiency', async () => {
      const metrics = {
        currentConsumption: 50,
        baselineConsumption: 60,
        costPerUnit: 1.5,
        factors: { idle: 0.25, route: 0.15 },
      };

      mockFuelRepo.create.mockReturnValue({});
      mockFuelRepo.save.mockResolvedValue({});

      await service.optimizeFuelEfficiency('org1', 'machine1', metrics);
      expect(mockFuelRepo.save).toHaveBeenCalled();
    });
  });

  describe('createCapacityPlan', () => {
    it('should create capacity plan', async () => {
      const planData = {
        fleetId: 'fleet1',
        planName: 'Q1 Plan',
        planPeriod: 'quarterly',
        totalCapacity: 5000,
        historicalData: [],
      };

      mockCapacityRepo.create.mockReturnValue({});
      mockCapacityRepo.save.mockResolvedValue({});

      await service.createCapacityPlan('org1', planData);
      expect(mockCapacityRepo.save).toHaveBeenCalled();
    });
  });

  describe('getRouteOptimizations', () => {
    it('should get route optimizations', async () => {
      mockRouteRepo.find.mockResolvedValue([]);
      const result = await service.getRouteOptimizations('org1', 'fleet1');
      expect(mockRouteRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getLoadBalancingAnalysis', () => {
    it('should get load balancing analysis', async () => {
      mockLoadRepo.findOne.mockResolvedValue({});
      await service.getLoadBalancingAnalysis('org1', 'fleet1');
      expect(mockLoadRepo.findOne).toHaveBeenCalled();
    });
  });

  describe('getFuelEfficiencyReport', () => {
    it('should get fuel efficiency report', async () => {
      mockFuelRepo.findOne.mockResolvedValue({});
      await service.getFuelEfficiencyReport('org1', 'machine1');
      expect(mockFuelRepo.findOne).toHaveBeenCalled();
    });
  });

  describe('getCapacityPlans', () => {
    it('should get capacity plans', async () => {
      mockCapacityRepo.find.mockResolvedValue([]);
      const result = await service.getCapacityPlans('org1', 'fleet1');
      expect(mockCapacityRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
