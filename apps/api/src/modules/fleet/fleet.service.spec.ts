import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FleetService } from './fleet.service';
import { Fleet } from './entities/fleet.entity';

describe('FleetService', () => {
  let service: FleetService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FleetService,
        {
          provide: getRepositoryToken(Fleet),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FleetService>(FleetService);
  });

  describe('createFleet', () => {
    it('should create a new fleet', async () => {
      const createFleetDto = {
        name: 'Test Fleet',
        organizationId: 'org-1',
        description: 'Test Description',
      };

      const fleet = { id: 'fleet-1', ...createFleetDto };
      mockRepository.create.mockReturnValue(fleet);
      mockRepository.save.mockResolvedValue(fleet);

      const result = await service.createFleet(createFleetDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createFleetDto);
      expect(mockRepository.save).toHaveBeenCalledWith(fleet);
      expect(result).toEqual(fleet);
    });
  });

  describe('getFleets', () => {
    it('should return all fleets for organization', async () => {
      const fleets = [
        { id: 'fleet-1', name: 'Fleet 1', organizationId: 'org-1' },
        { id: 'fleet-2', name: 'Fleet 2', organizationId: 'org-1' },
      ];

      mockRepository.find.mockResolvedValue(fleets);

      const result = await service.getFleets('org-1');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { organizationId: 'org-1' },
      });
      expect(result).toEqual(fleets);
    });
  });

  describe('getFleetById', () => {
    it('should return fleet by id', async () => {
      const fleet = { id: 'fleet-1', name: 'Test Fleet', organizationId: 'org-1' };

      mockRepository.findOne.mockResolvedValue(fleet);

      const result = await service.getFleetById('fleet-1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'fleet-1' },
      });
      expect(result).toEqual(fleet);
    });

    it('should return null if fleet not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getFleetById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateFleet', () => {
    it('should update fleet', async () => {
      const updateFleetDto = { name: 'Updated Fleet' };

      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue({ id: 'fleet-1', ...updateFleetDto });

      const result = await service.updateFleet('fleet-1', updateFleetDto);

      expect(mockRepository.update).toHaveBeenCalledWith('fleet-1', updateFleetDto);
      expect(result).toBeDefined();
    });
  });

  describe('deleteFleet', () => {
    it('should delete fleet', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteFleet('fleet-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('fleet-1');
    });
  });
});
