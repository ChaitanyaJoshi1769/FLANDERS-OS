import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DigitalTwinService } from './digital-twin.service';
import { DigitalTwinModel } from './entities/digital-twin-model.entity';
import { SimulationRun } from './entities/simulation-run.entity';
import { VirtualEnvironment } from './entities/virtual-environment.entity';

describe('DigitalTwinService', () => {
  let service: DigitalTwinService;
  const mockTwinRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
  const mockSimRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn() };
  const mockEnvRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DigitalTwinService,
        { provide: getRepositoryToken(DigitalTwinModel), useValue: mockTwinRepo },
        { provide: getRepositoryToken(SimulationRun), useValue: mockSimRepo },
        { provide: getRepositoryToken(VirtualEnvironment), useValue: mockEnvRepo },
      ],
    }).compile();

    service = module.get<DigitalTwinService>(DigitalTwinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDigitalTwin', () => {
    it('should create a digital twin', async () => {
      const machineData = {
        machineId: 'M1',
        name: 'Machine A',
        model3D: {},
        specifications: { type: 'crane' },
        realTimeMetrics: {},
      };

      mockTwinRepo.create.mockReturnValue(machineData);
      mockTwinRepo.save.mockResolvedValue(machineData);

      const result = await service.createDigitalTwin('org1', machineData);
      expect(mockTwinRepo.save).toHaveBeenCalled();
    });
  });

  describe('runSimulation', () => {
    it('should run a simulation', async () => {
      const simData = {
        twinId: 'twin1',
        scenarioName: 'High Load',
        parameters: { temperature: 80 },
        duration: 3600,
      };

      mockSimRepo.create.mockReturnValue(simData);
      mockSimRepo.save.mockResolvedValue(simData);

      const result = await service.runSimulation('org1', simData);
      expect(mockSimRepo.save).toHaveBeenCalled();
    });
  });

  describe('createVirtualEnvironment', () => {
    it('should create virtual environment', async () => {
      const envData = {
        name: 'Environment A',
        description: 'Test environment',
        models: [],
        weatherConditions: { temp: 25, humidity: 60 },
        terrainData: {},
        obstacles: [],
      };

      mockEnvRepo.create.mockReturnValue(envData);
      mockEnvRepo.save.mockResolvedValue(envData);

      const result = await service.createVirtualEnvironment('org1', envData);
      expect(mockEnvRepo.save).toHaveBeenCalled();
    });
  });

  describe('getDigitalTwin', () => {
    it('should get a digital twin', async () => {
      mockTwinRepo.findOne.mockResolvedValue({});
      await service.getDigitalTwin('org1', 'M1');
      expect(mockTwinRepo.findOne).toHaveBeenCalled();
    });
  });

  describe('getSimulations', () => {
    it('should get simulations', async () => {
      mockSimRepo.find.mockResolvedValue([]);
      const result = await service.getSimulations('org1', 'twin1');
      expect(mockSimRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getSimulationResults', () => {
    it('should get simulation results', async () => {
      const mockSim = { id: 'sim1', status: 'completed', duration: 3600 };
      mockSimRepo.findOne.mockResolvedValue(mockSim);

      const result = await service.getSimulationResults('sim1');
      expect(mockSimRepo.findOne).toHaveBeenCalled();
      expect(result.simulationId).toBe('sim1');
    });
  });

  describe('getEnvironments', () => {
    it('should get environments', async () => {
      mockEnvRepo.find.mockResolvedValue([]);
      const result = await service.getEnvironments('org1');
      expect(mockEnvRepo.find).toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('replayHistoricalData', () => {
    it('should replay historical data', async () => {
      const dateRange = { start: '2024-01-01', end: '2024-01-31' };
      const result = await service.replayHistoricalData('org1', 'M1', dateRange);
      expect(result.status).toBe('generating');
    });
  });
});
