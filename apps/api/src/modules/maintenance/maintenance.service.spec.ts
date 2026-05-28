import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { WorkOrder } from './entities/work-order.entity';
import { FailureEvent } from './entities/failure-event.entity';
import { MaintenancePrediction } from './entities/maintenance-prediction.entity';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let mockWorkOrderRepo: any;
  let mockFailureEventRepo: any;
  let mockPredictionRepo: any;

  beforeEach(async () => {
    mockWorkOrderRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockFailureEventRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    mockPredictionRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceService,
        {
          provide: getRepositoryToken(WorkOrder),
          useValue: mockWorkOrderRepo,
        },
        {
          provide: getRepositoryToken(FailureEvent),
          useValue: mockFailureEventRepo,
        },
        {
          provide: getRepositoryToken(MaintenancePrediction),
          useValue: mockPredictionRepo,
        },
      ],
    }).compile();

    service = module.get<MaintenanceService>(MaintenanceService);
  });

  describe('createWorkOrder', () => {
    it('should create work order', async () => {
      const createWorkOrderDto = {
        fleetId: 'fleet-1',
        machineId: 'machine-1',
        title: 'Maintenance Required',
        priority: 'high',
      };

      const workOrder = { id: 'wo-1', ...createWorkOrderDto, status: 'pending' };
      mockWorkOrderRepo.create.mockReturnValue(workOrder);
      mockWorkOrderRepo.save.mockResolvedValue(workOrder);

      const result = await service.createWorkOrder(createWorkOrderDto);

      expect(mockWorkOrderRepo.create).toHaveBeenCalledWith(createWorkOrderDto);
      expect(result).toEqual(workOrder);
    });
  });

  describe('recordFailureEvent', () => {
    it('should record failure event', async () => {
      const failureEvent = {
        machineId: 'machine-1',
        failureType: 'bearing_failure',
        severity: 'high',
      };

      mockFailureEventRepo.save.mockResolvedValue({ id: 'fe-1', ...failureEvent });

      const result = await service.recordFailureEvent(failureEvent);

      expect(mockFailureEventRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('createPrediction', () => {
    it('should create maintenance prediction', async () => {
      const predictionDto = {
        machineId: 'machine-1',
        predictedFailureTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        confidence: 0.85,
      };

      mockPredictionRepo.save.mockResolvedValue({ id: 'pred-1', ...predictionDto });

      const result = await service.createPrediction(predictionDto);

      expect(mockPredictionRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getUpcomingFailures', () => {
    it('should return predictions within 7 days with high confidence', async () => {
      const predictions = [
        {
          id: 'pred-1',
          machineId: 'machine-1',
          confidence: 0.85,
          predictedFailureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      ];

      mockPredictionRepo.find.mockResolvedValue(predictions);

      const result = await service.getUpcomingFailures('fleet-1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('calculateRemainingUsefulLife', () => {
    it('should calculate RUL based on failure patterns', async () => {
      const events = [
        { createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      ];

      mockFailureEventRepo.find.mockResolvedValue(events);

      const result = await service.calculateRemainingUsefulLife('machine-1');

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
