export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface Fleet {
  id: string;
  name: string;
  organizationId: string;
  status: 'active' | 'inactive' | 'maintenance';
  machineCount: number;
  description?: string;
  createdAt: string;
}

export interface Machine {
  id: string;
  machineId: string;
  fleetId: string;
  organizationId: string;
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned' | 'unknown';
  description: string;
  health: number;
  uptime: number;
  temperature: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: string;
  name: string;
  organizationId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'aborted';
  operationMode: 'autonomous' | 'semi_autonomous' | 'manual' | 'remote';
  waypointCount: number;
  progress: number;
  estimatedDuration: number;
  actualDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'catastrophic';
  status: 'open' | 'investigating' | 'resolved' | 'closed' | 'pending_review';
  organizationId: string;
  rootCause?: string;
  injurySeverity?: 'none' | 'minor' | 'major' | 'fatal';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FleetState {
  fleets: Fleet[];
  selectedFleet: Fleet | null;
  isLoading: boolean;
  error: string | null;
}

export interface MachineState {
  machines: Machine[];
  selectedMachine: Machine | null;
  isLoading: boolean;
  error: string | null;
}

export interface MissionState {
  missions: Mission[];
  selectedMission: Mission | null;
  isLoading: boolean;
  error: string | null;
}

export interface IncidentState {
  incidents: Incident[];
  selectedIncident: Incident | null;
  isLoading: boolean;
  error: string | null;
}
