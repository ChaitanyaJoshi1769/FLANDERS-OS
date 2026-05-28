import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { AutonomousMission } from './entities/autonomous-mission.entity';
import { FleetCoordination } from './entities/fleet-coordination.entity';
import { MissionExecutionLog } from './entities/mission-execution-log.entity';
import { MachinesService } from '../machines/machines.service';
import { FleetsService } from '../fleets/fleets.service';

@Injectable()
export class AutonomousService {
  constructor(
    @InjectRepository(AutonomousMission)
    private missionRepository: Repository<AutonomousMission>,
    @InjectRepository(FleetCoordination)
    private coordinationRepository: Repository<FleetCoordination>,
    @InjectRepository(MissionExecutionLog)
    private logRepository: Repository<MissionExecutionLog>,
    private machinesService: MachinesService,
    private fleetsService: FleetsService,
  ) {}

  async createMission(fleetId: string, createDto: any): Promise<AutonomousMission> {
    const fleet = await this.fleetsService.findById(fleetId);
    if (!fleet) {
      throw new NotFoundException(`Fleet ${fleetId} not found`);
    }

    const mission = this.missionRepository.create({
      fleetId,
      ...createDto,
      status: 'pending',
    });

    return await this.missionRepository.save(mission) as unknown as AutonomousMission;
  }

  async assignMissionToMachine(missionId: string, machineId: string): Promise<AutonomousMission> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException(`Mission ${missionId} not found`);
    }

    if (mission.status !== 'pending') {
      throw new BadRequestException(`Cannot assign mission with status: ${mission.status}`);
    }

    const machine = await this.machinesService.findById(machineId);
    if (!machine) {
      throw new NotFoundException(`Machine ${machineId} not found`);
    }

    mission.machineId = machineId;
    mission.actualStartTime = new Date();
    mission.status = 'in_progress';

    return await this.missionRepository.save(mission) as unknown as AutonomousMission;
  }

  async getMissionById(missionId: string): Promise<AutonomousMission> {
    const mission = await this.missionRepository.findOne({
      where: { id: missionId },
      relations: ['fleet', 'machine'],
    });

    if (!mission) {
      throw new NotFoundException(`Mission ${missionId} not found`);
    }

    return mission;
  }

  async getFleetMissions(fleetId: string, status?: string): Promise<AutonomousMission[]> {
    const query = this.missionRepository.createQueryBuilder('mission')
      .where('mission.fleetId = :fleetId', { fleetId })
      .leftJoinAndSelect('mission.fleet', 'fleet')
      .leftJoinAndSelect('mission.machine', 'machine');

    if (status) {
      query.andWhere('mission.status = :status', { status });
    }

    return query.orderBy('mission.scheduledStartTime', 'DESC').getMany();
  }

  async updateMissionStatus(
    missionId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled',
    failureReason?: string
  ): Promise<AutonomousMission> {
    const mission = await this.getMissionById(missionId);

    mission.status = status;
    if (status === 'completed') {
      mission.completedTime = new Date();
      mission.actualDurationMinutes = this.calculateDuration(mission.actualStartTime, new Date());
    }
    if (status === 'failed' && failureReason) {
      mission.failureReason = failureReason;
      mission.requiresHumanIntervention = true;
    }

    return await this.missionRepository.save(mission) as unknown as AutonomousMission;
  }

  async optimizeRoute(
    waypoints: Array<{ lat: number; lon: number; action?: string }>
  ): Promise<Array<{ lat: number; lon: number; action?: string; order: number }>> {
    // Simple nearest-neighbor route optimization (production would use advanced algorithms)
    if (waypoints.length <= 2) {
      return waypoints.map((wp, idx) => ({ ...wp, order: idx }));
    }

    const optimized = [waypoints[0]];
    const remaining = [...waypoints.slice(1)];

    while (remaining.length > 0) {
      const lastPoint = optimized[optimized.length - 1];
      let nearestIdx = 0;
      let minDistance = this.calculateDistance(
        lastPoint.lat,
        lastPoint.lon,
        remaining[0].lat,
        remaining[0].lon
      );

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.calculateDistance(
          lastPoint.lat,
          lastPoint.lon,
          remaining[i].lat,
          remaining[i].lon
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIdx = i;
        }
      }

      optimized.push(remaining[nearestIdx]);
      remaining.splice(nearestIdx, 1);
    }

    return optimized.map((wp, idx) => ({ ...wp, order: idx }));
  }

  async createFleetCoordination(
    fleetId: string,
    missionIds: string[],
    coordinationStrategy?: string
  ): Promise<FleetCoordination> {
    const fleet = await this.fleetsService.findById(fleetId);
    if (!fleet) {
      throw new NotFoundException(`Fleet ${fleetId} not found`);
    }

    const missions = await this.missionRepository.find({
      where: { fleetId, id: undefined as any },
    });

    const coordination = this.coordinationRepository.create({
      fleetId,
      coordinationMode: 'planning',
      coordinationStrategy: coordinationStrategy || 'load_balancing',
      totalMissionsCount: missionIds.length,
      completedMissionsCount: 0,
      failedMissionsCount: 0,
      overallEfficiency: 0,
      estimatedCompletionMinutes: this.estimateCoordinationTime(missions),
    });

    return this.coordinationRepository.save(coordination);
  }

  async getFleetCoordinations(fleetId: string): Promise<FleetCoordination[]> {
    return this.coordinationRepository.find({
      where: { fleetId },
      relations: ['missions'],
      order: { createdAt: 'DESC' },
    });
  }

  async activateCoordination(coordinationId: string): Promise<FleetCoordination> {
    const coordination = await this.coordinationRepository.findOne({
      where: { id: coordinationId },
    });

    if (!coordination) {
      throw new NotFoundException(`Coordination ${coordinationId} not found`);
    }

    coordination.coordinationMode = 'active';
    coordination.coordinationStartTime = new Date();

    return this.coordinationRepository.save(coordination);
  }

  async completeCoordination(coordinationId: string): Promise<FleetCoordination> {
    const coordination = await this.coordinationRepository.findOne({
      where: { id: coordinationId },
      relations: ['missions'],
    });

    if (!coordination) {
      throw new NotFoundException(`Coordination ${coordinationId} not found`);
    }

    const completedCount = coordination.missions.filter((m) => m.status === 'completed').length;
    const failedCount = coordination.missions.filter((m) => m.status === 'failed').length;

    coordination.coordinationMode = 'completed';
    coordination.coordinationEndTime = new Date();
    coordination.completedMissionsCount = completedCount;
    coordination.failedMissionsCount = failedCount;
    coordination.overallEfficiency = (completedCount / coordination.totalMissionsCount) * 100;

    return this.coordinationRepository.save(coordination);
  }

  async recordMissionEvent(
    missionId: string,
    logType: string,
    message: string,
    severity: 'info' | 'warning' | 'error' | 'critical' = 'info',
    data?: any
  ): Promise<MissionExecutionLog> {
    const log = this.logRepository.create({
      missionId,
      logType: logType as any,
      message,
      severity: severity as any,
      timestamp: new Date(),
      latitude: data?.latitude,
      longitude: data?.longitude,
      waypointIndex: data?.waypointIndex,
      machineId: data?.machineId,
      machineState: data?.machineState || {},
      environmentData: data?.environmentData || {},
    } as any);

    return await this.logRepository.save(log) as unknown as MissionExecutionLog;
  }

  async getMissionExecutionLogs(missionId: string): Promise<MissionExecutionLog[]> {
    return this.logRepository.find({
      where: { missionId },
      order: { timestamp: 'DESC' },
    });
  }

  async getRecentErrors(fleetId: string, hoursBack: number = 24): Promise<MissionExecutionLog[]> {
    const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000);

    return this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.mission', 'mission')
      .where('mission.fleetId = :fleetId', { fleetId })
      .andWhere('log.severity IN (:...severities)', { severities: ['error', 'critical'] })
      .andWhere('log.timestamp >= :since', { since })
      .orderBy('log.timestamp', 'DESC')
      .getMany();
  }

  async getAutonomousStats(fleetId: string, daysBack: number = 30): Promise<any> {
    const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    const missions = await this.missionRepository.find({
      where: {
        fleetId,
        createdAt: MoreThan(since),
      },
    });

    const completed = missions.filter((m) => m.status === 'completed').length;
    const failed = missions.filter((m) => m.status === 'failed').length;
    const inProgress = missions.filter((m) => m.status === 'in_progress').length;

    const totalDuration = missions
      .filter((m) => m.actualDurationMinutes)
      .reduce((sum, m) => sum + (m.actualDurationMinutes || 0), 0);

    return {
      totalMissions: missions.length,
      completedMissions: completed,
      failedMissions: failed,
      inProgressMissions: inProgress,
      successRate: missions.length > 0 ? (completed / missions.length) * 100 : 0,
      averageDurationMinutes: missions.length > 0 ? totalDuration / missions.length : 0,
      requiresIntervention: missions.filter((m) => m.requiresHumanIntervention).length,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateDuration(startTime: Date, endTime: Date): number {
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  }

  private estimateCoordinationTime(missions: AutonomousMission[]): number {
    const validEstimates = missions.filter((m) => m.estimatedDurationMinutes).map((m) => m.estimatedDurationMinutes);
    return validEstimates.length > 0 ? validEstimates.reduce((a, b) => a + b, 0) : 0;
  }
}
