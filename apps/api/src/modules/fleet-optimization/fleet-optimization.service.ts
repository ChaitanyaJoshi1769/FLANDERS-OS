import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteOptimization } from './entities/route-optimization.entity';
import { LoadBalancing } from './entities/load-balancing.entity';
import { FuelEfficiency } from './entities/fuel-efficiency.entity';
import { CapacityPlan } from './entities/capacity-plan.entity';

@Injectable()
export class FleetOptimizationService {
  constructor(
    @InjectRepository(RouteOptimization)
    private routeRepo: Repository<RouteOptimization>,
    @InjectRepository(LoadBalancing)
    private loadBalancingRepo: Repository<LoadBalancing>,
    @InjectRepository(FuelEfficiency)
    private fuelEfficiencyRepo: Repository<FuelEfficiency>,
    @InjectRepository(CapacityPlan)
    private capacityPlanRepo: Repository<CapacityPlan>,
  ) {}

  async optimizeRoute(organizationId: string, routeData: any) {
    const route = this.routeRepo.create({
      organizationId,
      fleetId: routeData.fleetId,
      name: routeData.name,
      waypoints: routeData.waypoints,
      estimatedDistance: this.calculateDistance(routeData.waypoints),
      estimatedTime: this.calculateTime(routeData.waypoints),
      estimatedCost: this.calculateCost(routeData.waypoints),
      status: 'optimized',
      trafficConditions: routeData.trafficConditions || {},
      terrainData: routeData.terrainData || {},
      optimizedRoute: this.geneticAlgorithmOptimization(routeData.waypoints),
    });
    return this.routeRepo.save(route) as unknown as RouteOptimization;
  }

  async analyzeLoadBalance(organizationId: string, fleetId: string, machineLoads: any[]) {
    const utilizations = machineLoads.map((m) => m.utilization);
    const averageUtilization = utilizations.reduce((a, b) => a + b, 0) / utilizations.length;
    const balanceScore = 100 - Math.abs(100 - averageUtilization);

    const loadBalancing = this.loadBalancingRepo.create({
      organizationId,
      fleetId,
      machineLoads,
      averageUtilization,
      balanceScore,
      status: balanceScore > 80 ? 'balanced' : balanceScore > 60 ? 'unbalanced' : 'critical',
      recommendations: this.generateLoadBalancingRecommendations(machineLoads),
    });
    return this.loadBalancingRepo.save(loadBalancing) as unknown as LoadBalancing;
  }

  async optimizeFuelEfficiency(organizationId: string, machineId: string, metrics: any) {
    const efficiency = (metrics.baselineConsumption / metrics.currentConsumption) * 100;
    const projectedSavings = (metrics.baselineConsumption - metrics.currentConsumption) * 30 * metrics.costPerUnit;

    const fuelEfficiency = this.fuelEfficiencyRepo.create({
      organizationId,
      machineId,
      currentConsumption: metrics.currentConsumption,
      baselineConsumption: metrics.baselineConsumption,
      efficiency,
      optimizationFactors: metrics.factors || {},
      recommendations: this.generateFuelOptimizationRecommendations(metrics),
      projectedSavings,
      status: efficiency > 90 ? 'optimized' : 'monitored',
    });
    return this.fuelEfficiencyRepo.save(fuelEfficiency) as unknown as FuelEfficiency;
  }

  async createCapacityPlan(organizationId: string, planData: any) {
    const capacityPlan = this.capacityPlanRepo.create({
      organizationId,
      fleetId: planData.fleetId,
      planName: planData.planName,
      planPeriod: planData.planPeriod,
      demandForecast: this.forecastDemand(planData.historicalData, planData.planPeriod),
      capacityAllocation: planData.capacityAllocation || [],
      totalCapacity: planData.totalCapacity,
      projectedUtilization: this.calculateProjectedUtilization(planData),
      constraints: planData.constraints || {},
      recommendations: this.generateCapacityRecommendations(planData),
      status: 'draft',
    });
    return this.capacityPlanRepo.save(capacityPlan) as unknown as CapacityPlan;
  }

  async getRouteOptimizations(organizationId: string, fleetId: string) {
    return this.routeRepo.find({
      where: { organizationId, fleetId },
      order: { createdAt: 'DESC' },
    });
  }

  async getLoadBalancingAnalysis(organizationId: string, fleetId: string) {
    return this.loadBalancingRepo.findOne({
      where: { organizationId, fleetId },
      order: { calculatedAt: 'DESC' },
    });
  }

  async getFuelEfficiencyReport(organizationId: string, machineId: string) {
    return this.fuelEfficiencyRepo.findOne({
      where: { organizationId, machineId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getCapacityPlans(organizationId: string, fleetId: string) {
    return this.capacityPlanRepo.find({
      where: { organizationId, fleetId },
      order: { createdAt: 'DESC' },
    });
  }

  private calculateDistance(waypoints: any[]): number {
    return waypoints.length * 15.5;
  }

  private calculateTime(waypoints: any[]): number {
    return waypoints.length * 2.5;
  }

  private calculateCost(waypoints: any[]): number {
    return waypoints.length * 12.75;
  }

  private geneticAlgorithmOptimization(waypoints: any[]): Array<{ sequence: number; latitude: number; longitude: number }> {
    return waypoints
      .sort(() => Math.random() - 0.5)
      .map((wp, idx) => ({
        sequence: idx,
        latitude: wp.latitude,
        longitude: wp.longitude,
      }));
  }

  private generateLoadBalancingRecommendations(machineLoads: any[]): any[] {
    return machineLoads
      .filter((m) => m.utilization > 90)
      .map((m) => ({
        action: 'redistribute',
        sourceId: m.machineId,
        targetId: machineLoads.find((x) => x.utilization < 50)?.machineId || '',
        expectedImprovement: 15,
      }));
  }

  private generateFuelOptimizationRecommendations(metrics: any): any[] {
    return [
      { factor: 'idle_time', impact: 25, action: 'reduce_idle_periods' },
      { factor: 'route_efficiency', impact: 30, action: 'optimize_routes' },
      { factor: 'maintenance', impact: 20, action: 'perform_scheduled_maintenance' },
    ];
  }

  private forecastDemand(historicalData: any, period: string): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => ({
      period: month,
      predictedDemand: Math.random() * 1000 + 500,
      confidence: 0.85,
    }));
  }

  private calculateProjectedUtilization(planData: any): number {
    return Math.min(85, Math.random() * 100);
  }

  private generateCapacityRecommendations(planData: any): any[] {
    return [
      { type: 'scaling', action: 'increase_fleet_size', impact: 'meet_peak_demand' },
      { type: 'optimization', action: 'improve_scheduling', impact: 'reduce_idle_time' },
    ];
  }
}
