'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { apiClient } from '@/lib/api-client';
import { RootState } from '@/lib/store';
import FleetHealthCard from '@/components/dashboard/FleetHealthCard';
import MachineGridView from '@/components/dashboard/MachineGridView';
import UtilizationChart from '@/components/dashboard/UtilizationChart';

export default function DashboardPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const fleet = useSelector((state: RootState) => state.fleet);
  const [selectedFleetId, setSelectedFleetId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedFleetId(fleet.selectedFleetId);
  }, [fleet.selectedFleetId]);

  const { data: fleetHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['fleetHealth', selectedFleetId],
    queryFn: () =>
      selectedFleetId
        ? apiClient.getFleetIntelligence(selectedFleetId)
        : Promise.resolve(null),
    enabled: !!selectedFleetId,
  });

  const { data: machines, isLoading: machinesLoading } = useQuery({
    queryKey: ['machines', selectedFleetId],
    queryFn: () =>
      selectedFleetId ? apiClient.getMachines(selectedFleetId) : Promise.resolve([]),
    enabled: !!selectedFleetId,
  });

  const { data: trend } = useQuery({
    queryKey: ['utilizationTrend', selectedFleetId],
    queryFn: () =>
      selectedFleetId
        ? apiClient.getFleetUtilizationTrend(selectedFleetId, 24)
        : Promise.resolve(null),
    enabled: !!selectedFleetId,
  });

  if (!auth.isAuthenticated) {
    return <div className="p-8 text-center">Please log in to access the dashboard</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fleet Operations Dashboard</h1>
        <div className="text-sm text-slate-400">
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Fleet Health Overview */}
      {fleetHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FleetHealthCard
            title="Active Machines"
            value={fleetHealth.statusCounts?.active || 0}
            total={fleetHealth.totalMachines}
            status="active"
          />
          <FleetHealthCard
            title="In Maintenance"
            value={fleetHealth.statusCounts?.maintenance || 0}
            total={fleetHealth.totalMachines}
            status="maintenance"
          />
          <FleetHealthCard
            title="Average Utilization"
            value={fleetHealth.averageUtilization || 0}
            unit="%"
            status={
              fleetHealth.averageUtilization > 75
                ? 'good'
                : 'warning'
            }
          />
          <FleetHealthCard
            title="Critical Anomalies"
            value={fleetHealth.criticalAnomalies || 0}
            status={
              fleetHealth.criticalAnomalies > 0 ? 'critical' : 'healthy'
            }
          />
        </div>
      )}

      {/* Fleet Status */}
      {fleetHealth && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Fleet Status: {fleetHealth.health}</h2>
          <p className="text-slate-300">
            {fleetHealth.fleetName} is {fleetHealth.health === 'healthy' ? 'operating normally' : 'requires attention'}
          </p>
        </div>
      )}

      {/* Utilization Trend */}
      {trend && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Utilization Trend (24h)</h2>
          <UtilizationChart data={trend.trend} />
        </div>
      )}

      {/* Machines Grid */}
      {machines && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Active Machines</h2>
          <MachineGridView machines={machines.slice(0, 12)} />
        </div>
      )}

      {/* Loading States */}
      {(healthLoading || machinesLoading) && (
        <div className="text-center text-slate-400">Loading fleet data...</div>
      )}
    </div>
  );
}
