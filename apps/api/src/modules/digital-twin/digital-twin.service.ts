import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalTwinModel } from './entities/digital-twin-model.entity';
import { SimulationRun } from './entities/simulation-run.entity';
import { VirtualEnvironment } from './entities/virtual-environment.entity';

@Injectable()
export class DigitalTwinService {
  constructor(
    @InjectRepository(DigitalTwinModel)
    private twinRepo: Repository<DigitalTwinModel>,
    @InjectRepository(SimulationRun)
    private simulationRepo: Repository<SimulationRun>,
    @InjectRepository(VirtualEnvironment)
    private environmentRepo: Repository<VirtualEnvironment>,
  ) {}

  async createDigitalTwin(organizationId: string, machineData: any) {
    const twin = this.twinRepo.create({
      organizationId,
      machineId: machineData.machineId,
      name: machineData.name,
      model3D: machineData.model3D,
      specifications: machineData.specifications,
      realTimeMetrics: machineData.realTimeMetrics,
      status: 'active',
    });
    return this.twinRepo.save(twin);
  }

  async runSimulation(organizationId: string, simulationData: any) {
    const simulation = this.simulationRepo.create({
      organizationId,
      twinId: simulationData.twinId,
      scenarioName: simulationData.scenarioName,
      parameters: simulationData.parameters,
      duration: simulationData.duration,
      status: 'running',
      startTime: new Date(),
    });
    return this.simulationRepo.save(simulation);
  }

  async createVirtualEnvironment(organizationId: string, envData: any) {
    const environment = this.environmentRepo.create({
      organizationId,
      name: envData.name,
      description: envData.description,
      models: envData.models,
      weatherConditions: envData.weatherConditions,
      terrainData: envData.terrainData,
      obstacles: envData.obstacles,
    });
    return this.environmentRepo.save(environment);
  }

  async getDigitalTwin(organizationId: string, machineId: string) {
    return this.twinRepo.findOne({
      where: { organizationId, machineId },
    });
  }

  async getSimulations(organizationId: string, twinId: string) {
    return this.simulationRepo.find({
      where: { organizationId, twinId },
      order: { startTime: 'DESC' },
    });
  }

  async getSimulationResults(simulationId: string) {
    const sim = await this.simulationRepo.findOne({
      where: { id: simulationId },
    });
    return {
      simulationId,
      status: sim?.status,
      results: {
        performance: 0.95,
        efficiency: 0.88,
        fuelConsumption: 15.2,
        stressPoints: [],
        recommendations: [],
      },
      duration: sim?.duration,
    };
  }

  async getEnvironments(organizationId: string) {
    return this.environmentRepo.find({
      where: { organizationId },
    });
  }

  async replayHistoricalData(organizationId: string, machineId: string, dateRange: any) {
    return {
      machineId,
      startDate: dateRange.start,
      endDate: dateRange.end,
      events: [],
      performance: [],
      status: 'generating',
    };
  }
}
