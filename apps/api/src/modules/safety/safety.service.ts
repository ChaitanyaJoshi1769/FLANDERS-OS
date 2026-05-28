import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { SafetyIncident } from './entities/safety-incident.entity';
import { ComplianceAudit } from './entities/compliance-audit.entity';
import { SafetyMonitoring } from './entities/safety-monitoring.entity';

@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(SafetyIncident)
    private incidentRepository: Repository<SafetyIncident>,
    @InjectRepository(ComplianceAudit)
    private auditRepository: Repository<ComplianceAudit>,
    @InjectRepository(SafetyMonitoring)
    private monitoringRepository: Repository<SafetyMonitoring>,
  ) {}

  async reportIncident(createDto: any): Promise<SafetyIncident> {
    const incident = this.incidentRepository.create({
      ...createDto,
      status: 'open',
      reportedTime: new Date(),
    });

    return await this.incidentRepository.save(incident) as unknown as SafetyIncident;
  }

  async getIncidentById(incidentId: string): Promise<SafetyIncident> {
    const incident = await this.incidentRepository.findOne({
      where: { id: incidentId },
      relations: ['fleet', 'machine'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident ${incidentId} not found`);
    }

    return incident;
  }

  async getFleetIncidents(fleetId: string, status?: string, severityFilter?: string): Promise<SafetyIncident[]> {
    const query = this.incidentRepository.createQueryBuilder('incident')
      .where('incident.fleetId = :fleetId', { fleetId })
      .leftJoinAndSelect('incident.fleet', 'fleet')
      .leftJoinAndSelect('incident.machine', 'machine');

    if (status) {
      query.andWhere('incident.status = :status', { status });
    }

    if (severityFilter) {
      query.andWhere('incident.severity = :severity', { severity: severityFilter });
    }

    return query.orderBy('incident.createdAt', 'DESC').getMany();
  }

  async updateIncidentStatus(
    incidentId: string,
    status: 'open' | 'investigating' | 'resolved' | 'closed' | 'pending_review',
    rootCause?: string,
    correctionAction?: string
  ): Promise<SafetyIncident> {
    const incident = await this.getIncidentById(incidentId);

    incident.status = status;
    if (status === 'investigating') {
      incident.investigatedBy = incident.investigatedBy || 'system';
    }
    if (status === 'resolved' || status === 'closed') {
      incident.resolutionTime = new Date();
    }
    if (rootCause) {
      incident.rootCause = rootCause;
    }
    if (correctionAction) {
      incident.correctionAction = correctionAction;
    }

    return await this.incidentRepository.save(incident) as unknown as SafetyIncident;
  }

  async createComplianceAudit(createDto: any): Promise<ComplianceAudit> {
    const audit = this.auditRepository.create({
      ...createDto,
      status: 'planned',
    });

    return await this.auditRepository.save(audit) as unknown as ComplianceAudit;
  }

  async getAuditById(auditId: string): Promise<ComplianceAudit> {
    const audit = await this.auditRepository.findOne({
      where: { id: auditId },
      relations: ['organization', 'fleet'],
    });

    if (!audit) {
      throw new NotFoundException(`Audit ${auditId} not found`);
    }

    return audit;
  }

  async getOrganizationAudits(organizationId: string): Promise<ComplianceAudit[]> {
    return this.auditRepository.find({
      where: { organizationId },
      relations: ['organization', 'fleet'],
      order: { auditDate: 'DESC' },
    });
  }

  async updateAuditStatus(
    auditId: string,
    status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'remediation',
    complianceScore?: number,
    findings?: string
  ): Promise<ComplianceAudit> {
    const audit = await this.getAuditById(auditId);

    audit.status = status;
    if (status === 'completed') {
      audit.completionDate = new Date();
    }
    if (complianceScore !== undefined) {
      audit.complianceScore = complianceScore;
    }
    if (findings) {
      audit.findings = findings;
    }

    return await this.auditRepository.save(audit) as unknown as ComplianceAudit;
  }

  async recordSafetyMonitoring(createDto: any): Promise<SafetyMonitoring> {
    const monitoring = this.monitoringRepository.create({
      ...createDto,
      timestamp: new Date(),
    });

    return await this.monitoringRepository.save(monitoring) as unknown as SafetyMonitoring;
  }

  async getFleetSafetyMonitoring(fleetId: string, hoursBack: number = 24): Promise<SafetyMonitoring[]> {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    return this.monitoringRepository
      .createQueryBuilder('monitoring')
      .where('monitoring.fleetId = :fleetId', { fleetId })
      .andWhere('monitoring.timestamp >= :since', { since })
      .leftJoinAndSelect('monitoring.fleet', 'fleet')
      .leftJoinAndSelect('monitoring.machine', 'machine')
      .orderBy('monitoring.timestamp', 'DESC')
      .getMany();
  }

  async getActiveAlerts(fleetId: string): Promise<SafetyMonitoring[]> {
    return this.monitoringRepository
      .createQueryBuilder('monitoring')
      .where('monitoring.fleetId = :fleetId', { fleetId })
      .andWhere('monitoring.alertLevel IN (:...levels)', { levels: ['warning', 'critical', 'emergency'] })
      .leftJoinAndSelect('monitoring.fleet', 'fleet')
      .leftJoinAndSelect('monitoring.machine', 'machine')
      .orderBy('monitoring.timestamp', 'DESC')
      .getMany();
  }

  async getIncidentStats(fleetId: string, daysBack: number = 30): Promise<any> {
    const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const incidents = await this.incidentRepository.find({
      where: {
        fleetId,
        createdAt: MoreThan(since),
      },
    });

    const openIncidents = incidents.filter((i) => i.status === 'open').length;
    const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;
    const criticalIncidents = incidents.filter((i) => i.severity === 'critical' || i.severity === 'catastrophic').length;

    const avgResolutionTime = incidents
      .filter((i) => i.resolutionTime)
      .reduce((sum, i) => sum + (i.resolutionTime.getTime() - i.incidentTime.getTime()), 0) / (1000 * 60);

    return {
      totalIncidents: incidents.length,
      openIncidents,
      resolvedIncidents,
      criticalIncidents,
      resolutionRate: incidents.length > 0 ? (resolvedIncidents / incidents.length) * 100 : 0,
      averageResolutionTimeMinutes: incidents.filter((i) => i.resolutionTime).length > 0
        ? avgResolutionTime / incidents.filter((i) => i.resolutionTime).length
        : 0,
      highestSeverity: incidents.length > 0 ? incidents.map((i) => i.severity).sort()[incidents.length - 1] : 'none',
    };
  }

  async getComplianceStatus(organizationId: string): Promise<any> {
    const audits = await this.auditRepository.find({
      where: { organizationId },
    });

    const completedAudits = audits.filter((a) => a.status === 'completed');
    const passedAudits = completedAudits.filter((a) => (a.complianceScore || 0) >= 80);

    const avgComplianceScore =
      completedAudits.length > 0
        ? completedAudits.reduce((sum, a) => sum + (a.complianceScore || 0), 0) / completedAudits.length
        : 0;

    return {
      totalAudits: audits.length,
      completedAudits: completedAudits.length,
      passedAudits: passedAudits.length,
      complianceRate: audits.length > 0 ? (passedAudits.length / completedAudits.length) * 100 : 0,
      averageComplianceScore: avgComplianceScore,
      remediationRequired: audits.filter((a) => a.status === 'remediation').length,
    };
  }

  async getIncidentsByType(fleetId: string, incidentType: string): Promise<SafetyIncident[]> {
    return this.incidentRepository.find({
      where: { fleetId, incidentType },
      relations: ['fleet', 'machine'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSafetyTrendAnalysis(fleetId: string, daysBack: number = 90): Promise<any> {
    const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const incidents = await this.incidentRepository.find({
      where: {
        fleetId,
        createdAt: MoreThan(since),
      },
    });

    const monitoring = await this.monitoringRepository.find({
      where: {
        fleetId,
        timestamp: MoreThan(since),
      },
    });

    const incidentsByType: Record<string, number> = {};
    incidents.forEach((i) => {
      incidentsByType[i.incidentType] = (incidentsByType[i.incidentType] || 0) + 1;
    });

    const alertsByLevel: Record<string, number> = {};
    monitoring.forEach((m) => {
      alertsByLevel[m.alertLevel] = (alertsByLevel[m.alertLevel] || 0) + 1;
    });

    return {
      totalIncidents: incidents.length,
      totalAlerts: monitoring.length,
      incidentsByType,
      alertsByLevel,
      trend: incidents.length > 5 ? 'stable' : incidents.length > 10 ? 'increasing' : 'decreasing',
    };
  }
}
