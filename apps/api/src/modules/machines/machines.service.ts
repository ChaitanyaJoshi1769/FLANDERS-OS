import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machinesRepository: Repository<Machine>
  ) {}

  async create(createMachineDto: Partial<Machine>): Promise<Machine> {
    const machine = this.machinesRepository.create(createMachineDto);
    return this.machinesRepository.save(machine);
  }

  async findById(id: string): Promise<Machine> {
    const machine = await this.machinesRepository.findOne({ where: { id } });
    if (!machine) throw new NotFoundException('Machine not found');
    return machine;
  }

  async findBySerialNumber(serialNumber: string): Promise<Machine> {
    return this.machinesRepository.findOne({ where: { serialNumber } });
  }

  async findByFleet(fleetId: string): Promise<Machine[]> {
    return this.machinesRepository.find({ where: { fleetId } });
  }

  async findBySite(siteId: string): Promise<Machine[]> {
    return this.machinesRepository.find({ where: { siteId } });
  }

  async update(id: string, updateMachineDto: Partial<Machine>): Promise<Machine> {
    await this.machinesRepository.update(id, updateMachineDto);
    return this.findById(id);
  }

  async updateLocation(
    id: string,
    lat: number,
    lon: number,
    heading?: number
  ): Promise<Machine> {
    return this.update(id, {
      locationLat: lat,
      locationLon: lon,
      heading,
      lastTelemetryAt: new Date(),
    } as any);
  }

  async updateStatus(id: string, status: Machine['status']): Promise<Machine> {
    return this.update(id, { status } as any);
  }

  async delete(id: string): Promise<void> {
    await this.machinesRepository.delete(id);
  }
}
