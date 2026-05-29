import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IndustrySpecificService } from './industry-specific.service';
import { IndustryConfiguration } from './entities/industry-configuration.entity';

describe('IndustrySpecificService', () => {
  let service: IndustrySpecificService;
  const mockConfigRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustrySpecificService,
        { provide: getRepositoryToken(IndustryConfiguration), useValue: mockConfigRepo },
      ],
    }).compile();

    service = module.get<IndustrySpecificService>(IndustrySpecificService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setupIndustryConfiguration', () => {
    it('should setup construction industry', async () => {
      const config = { projectName: 'Main Site' };
      mockConfigRepo.create.mockReturnValue({});
      mockConfigRepo.save.mockResolvedValue({});

      await service.setupIndustryConfiguration('org1', 'construction', config);
      expect(mockConfigRepo.save).toHaveBeenCalled();
    });

    it('should setup mining industry', async () => {
      const config = { mineName: 'Mine A' };
      mockConfigRepo.create.mockReturnValue({});
      mockConfigRepo.save.mockResolvedValue({});

      await service.setupIndustryConfiguration('org1', 'mining', config);
      expect(mockConfigRepo.save).toHaveBeenCalled();
    });

    it('should setup agriculture industry', async () => {
      const config = { cropType: 'wheat' };
      mockConfigRepo.create.mockReturnValue({});
      mockConfigRepo.save.mockResolvedValue({});

      await service.setupIndustryConfiguration('org1', 'agriculture', config);
      expect(mockConfigRepo.save).toHaveBeenCalled();
    });

    it('should setup manufacturing industry', async () => {
      const config = { lineCount: 5 };
      mockConfigRepo.create.mockReturnValue({});
      mockConfigRepo.save.mockResolvedValue({});

      await service.setupIndustryConfiguration('org1', 'manufacturing', config);
      expect(mockConfigRepo.save).toHaveBeenCalled();
    });

    it('should setup logistics industry', async () => {
      const config = { fleetSize: 50 };
      mockConfigRepo.create.mockReturnValue({});
      mockConfigRepo.save.mockResolvedValue({});

      await service.setupIndustryConfiguration('org1', 'logistics', config);
      expect(mockConfigRepo.save).toHaveBeenCalled();
    });
  });

  describe('getConfiguration', () => {
    it('should get industry configuration', async () => {
      mockConfigRepo.findOne.mockResolvedValue({});
      await service.getConfiguration('org1', 'construction');
      expect(mockConfigRepo.findOne).toHaveBeenCalled();
    });
  });

  describe('updateConfiguration', () => {
    it('should update industry configuration', async () => {
      const existing = { id: 'config1', industry: 'construction' };
      mockConfigRepo.findOne.mockResolvedValue(existing);
      mockConfigRepo.save.mockResolvedValue({ ...existing, configuration: { updated: true } });

      await service.updateConfiguration('org1', 'construction', { updated: true });
      expect(mockConfigRepo.save).toHaveBeenCalled();
    });

    it('should return null if configuration not found', async () => {
      mockConfigRepo.findOne.mockResolvedValue(null);
      const result = await service.updateConfiguration('org1', 'construction', {});
      expect(result).toBeNull();
    });
  });
});
