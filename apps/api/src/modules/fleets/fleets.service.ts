import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fleet } from './fleet.entity';

@Injectable()
export class FleetsService {
  constructor(
    @InjectRepository(Fleet)
    private fleetsRepository: Repository<Fleet>
  ) {}

  async create(createFleetDto: Partial<Fleet>): Promise<Fleet> {
    const fleet = this.fleetsRepository.create(createFleetDto);
    return this.fleetsRepository.save(fleet);
  }

  async findById(id: string): Promise<Fleet> {
    const fleet = await this.fleetsRepository.findOne({
      where: { id },
      relations: ['machines'],
    });
    if (!fleet) throw new NotFoundException('Fleet not found');
    return fleet;
  }

  async findBySite(siteId: string): Promise<Fleet[]> {
    return this.fleetsRepository.find({
      where: { siteId },
      relations: ['machines'],
    });
  }

  async findByOrganization(organizationId: string): Promise<Fleet[]> {
    return this.fleetsRepository.find({
      where: { organizationId },
      relations: ['machines'],
    });
  }

  async update(id: string, updateFleetDto: Partial<Fleet>): Promise<Fleet> {
    await this.fleetsRepository.update(id, updateFleetDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.fleetsRepository.delete(id);
  }

  async getFleetHealth(fleetId: string): Promise<any> {
    const fleet = await this.findById(fleetId);
    const machines = fleet.machines || [];

    const healthMetrics = {
      totalMachines: machines.length,
      activeMachines: machines.filter((m) => m.status === 'active').length,
      inMaintenanceMachines: machines.filter(
        (m) => m.status === 'maintenance'
      ).length,
      offlineMachines: machines.filter((m) => m.status === 'unknown').length,
      averageBatteryLevel:
        machines.reduce((sum, m) => sum + (m.batteryLevel || 0), 0) /
        (machines.length || 1),
    };

    return healthMetrics;
  }
}
