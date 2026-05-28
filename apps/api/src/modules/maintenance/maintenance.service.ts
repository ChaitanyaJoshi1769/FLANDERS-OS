import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { FailureEvent } from './entities/failure-event.entity';
import { MaintenancePrediction } from './entities/maintenance-prediction.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(FailureEvent)
    private failureEventRepository: Repository<FailureEvent>,
    @InjectRepository(MaintenancePrediction)
    private predictionRepository: Repository<MaintenancePrediction>
  ) {}

  async createWorkOrder(createDto: Partial<WorkOrder>): Promise<WorkOrder> {
    const workOrder = this.workOrderRepository.create(createDto);
    return this.workOrderRepository.save(workOrder);
  }

  async getWorkOrders(machineId: string): Promise<WorkOrder[]> {
    return this.workOrderRepository.find({
      where: { machineId },
      order: { createdAt: 'DESC' },
    });
  }

  async getWorkOrder(id: string): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });
    if (!workOrder) throw new NotFoundException('Work order not found');
    return workOrder;
  }

  async updateWorkOrder(id: string, updateDto: Partial<WorkOrder>): Promise<WorkOrder> {
    await this.workOrderRepository.update(id, updateDto);
    return this.getWorkOrder(id);
  }

  async recordFailureEvent(createDto: Partial<FailureEvent>): Promise<FailureEvent> {
    const failureEvent = this.failureEventRepository.create(createDto);
    return this.failureEventRepository.save(failureEvent);
  }

  async getFailureHistory(machineId: string, days: number = 30): Promise<FailureEvent[]> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.failureEventRepository.find({
      where: {
        machineId,
      },
      order: { detectedAt: 'DESC' },
    });
  }

  async createPrediction(createDto: Partial<MaintenancePrediction>): Promise<MaintenancePrediction> {
    const prediction = this.predictionRepository.create(createDto);
    return this.predictionRepository.save(prediction);
  }

  async getPredictions(machineId: string): Promise<MaintenancePrediction[]> {
    return this.predictionRepository.find({
      where: { machineId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getUpcomingFailures(organizationId: string): Promise<MaintenancePrediction[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.predictionRepository
      .createQueryBuilder('prediction')
      .leftJoinAndSelect('prediction.machine', 'machine')
      .where('machine.organizationId = :organizationId', { organizationId })
      .andWhere('prediction.predictedFailureDate BETWEEN :now AND :nextWeek', {
        now,
        nextWeek,
      })
      .andWhere('prediction.confidencePercent >= :confidence', { confidence: 75 })
      .orderBy('prediction.predictedFailureDate', 'ASC')
      .getMany();
  }

  async getMaintenanceSchedule(organizationId: string): Promise<any> {
    const workOrders = await this.workOrderRepository
      .createQueryBuilder('wo')
      .leftJoinAndSelect('wo.machine', 'machine')
      .where('machine.organizationId = :organizationId', { organizationId })
      .andWhere('wo.status IN (:...statuses)', { statuses: ['open', 'in_progress'] })
      .orderBy('wo.scheduledDate', 'ASC')
      .getMany();

    const upcomingPredictions = await this.getUpcomingFailures(organizationId);

    return {
      scheduledMaintenance: workOrders,
      predictedFailures: upcomingPredictions,
      totalOpenWorkOrders: workOrders.length,
      criticalPredictions: upcomingPredictions.filter((p) => p.confidencePercent >= 90).length,
    };
  }

  async calculateRemainingUsefulLife(machineId: string): Promise<any> {
    const failures = await this.getFailureHistory(machineId, 365);
    if (failures.length === 0) return null;

    const averageFailureInterval = failures.length > 1
      ? (failures[0].detectedAt.getTime() - failures[failures.length - 1].detectedAt.getTime()) /
        failures.length / (24 * 60 * 60 * 1000)
      : 365;

    const lastFailure = failures[0];
    const daysSinceLastFailure = (Date.now() - lastFailure.detectedAt.getTime()) / (24 * 60 * 60 * 1000);
    const ruleRemaining = Math.max(0, averageFailureInterval - daysSinceLastFailure);

    return {
      estimatedRUL: Math.round(ruleRemaining),
      averageFailureInterval: Math.round(averageFailureInterval),
      daysSinceLastFailure: Math.round(daysSinceLastFailure),
      confidenceScore: failures.length >= 5 ? 0.95 : 0.5,
    };
  }
}
