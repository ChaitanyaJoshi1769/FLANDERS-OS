import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SafetyService } from './safety.service';
import { SafetyIncident } from './entities/safety-incident.entity';
import { ComplianceAudit } from './entities/compliance-audit.entity';

describe('SafetyService', () => {
  let service: SafetyService;
  let mockIncidentRepo: any;
  let mockAuditRepo: any;

  beforeEach(async () => {
    mockIncidentRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    mockAuditRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SafetyService,
        {
          provide: getRepositoryToken(SafetyIncident),
          useValue: mockIncidentRepo,
        },
        {
          provide: getRepositoryToken(ComplianceAudit),
          useValue: mockAuditRepo,
        },
      ],
    }).compile();

    service = module.get<SafetyService>(SafetyService);
  });

  describe('reportIncident', () => {
    it('should create safety incident', async () => {
      const incidentDto = {
        title: 'Safety Incident',
        description: 'Test incident',
        type: 'near_miss',
        severity: 'high',
        organizationId: 'org-1',
      };

      const incident = { id: 'incident-1', status: 'open', ...incidentDto };
      mockIncidentRepo.create.mockReturnValue(incident);
      mockIncidentRepo.save.mockResolvedValue(incident);

      const result = await service.reportIncident(incidentDto);

      expect(mockIncidentRepo.create).toHaveBeenCalledWith(incidentDto);
      expect(result).toEqual(incident);
    });
  });

  describe('getIncidents', () => {
    it('should retrieve incidents with filters', async () => {
      const incidents = [
        { id: 'incident-1', severity: 'high', organizationId: 'org-1' },
        { id: 'incident-2', severity: 'critical', organizationId: 'org-1' },
      ];

      mockIncidentRepo.find.mockResolvedValue(incidents);

      const result = await service.getIncidents('org-1');

      expect(mockIncidentRepo.find).toHaveBeenCalled();
      expect(result).toEqual(incidents);
    });
  });

  describe('getIncidentStatistics', () => {
    it('should calculate incident statistics', async () => {
      const incidents = [
        { severity: 'high', createdAt: new Date() },
        { severity: 'critical', createdAt: new Date() },
      ];

      mockIncidentRepo.find.mockResolvedValue(incidents);

      const result = await service.getIncidentStatistics('org-1');

      expect(result).toHaveProperty('totalIncidents');
      expect(result).toHaveProperty('bySeverity');
    });
  });

  describe('conductComplianceAudit', () => {
    it('should create compliance audit', async () => {
      const auditDto = {
        organizationId: 'org-1',
        framework: 'OSHA',
        scope: 'facility-wide',
      };

      const audit = { id: 'audit-1', status: 'scheduled', ...auditDto };
      mockAuditRepo.create.mockReturnValue(audit);
      mockAuditRepo.save.mockResolvedValue(audit);

      const result = await service.conductComplianceAudit(auditDto);

      expect(result).toBeDefined();
    });
  });

  describe('getComplianceScore', () => {
    it('should calculate compliance score', async () => {
      const audits = [
        { framework: 'OSHA', status: 'completed', complianceScore: 95 },
      ];

      mockAuditRepo.find.mockResolvedValue(audits);

      const result = await service.getComplianceScore('org-1', 'OSHA');

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });
});
