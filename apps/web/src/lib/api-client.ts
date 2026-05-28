import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

class APIClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    if (!this.accessToken) {
      this.accessToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
    }
    return this.accessToken;
  }

  private handleUnauthorized() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  // Auth endpoints
  async login(organizationId: string, email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      organizationId,
      email,
      password,
    });
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response.data;
  }

  async register(
    organizationId: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const response = await this.client.post('/auth/register', {
      organizationId,
      email,
      password,
      firstName,
      lastName,
    });
    if (response.data.accessToken) {
      this.setToken(response.data.accessToken);
    }
    return response.data;
  }

  // Organizations
  async getOrganizations() {
    const response = await this.client.get('/organizations');
    return response.data;
  }

  async getOrganization(id: string) {
    const response = await this.client.get(`/organizations/${id}`);
    return response.data;
  }

  // Fleets
  async getFleets(organizationId: string) {
    const response = await this.client.get(`/fleets/organization/${organizationId}`);
    return response.data;
  }

  async getFleet(id: string) {
    const response = await this.client.get(`/fleets/${id}`);
    return response.data;
  }

  async getFleetHealth(id: string) {
    const response = await this.client.get(`/fleets/${id}/health`);
    return response.data;
  }

  // Machines
  async getMachines(fleetId: string) {
    const response = await this.client.get(`/machines/fleet/${fleetId}`);
    return response.data;
  }

  async getMachine(id: string) {
    const response = await this.client.get(`/machines/${id}`);
    return response.data;
  }

  // Telemetry
  async getMachineTelemetry(machineId: string, limit = 100) {
    const response = await this.client.get(
      `/telemetry/machines/${machineId}?limit=${limit}`
    );
    return response.data;
  }

  async ingestSensorEvent(machineId: string, eventData: any) {
    const response = await this.client.post('/telemetry/sensor-events', {
      machineId,
      ...eventData,
    });
    return response.data;
  }

  // Fleet Intelligence
  async getFleetIntelligence(fleetId: string) {
    const response = await this.client.get(
      `/fleet-intelligence/fleets/${fleetId}/health`
    );
    return response.data;
  }

  async getMachineHealth(machineId: string) {
    const response = await this.client.get(
      `/fleet-intelligence/machines/${machineId}/health`
    );
    return response.data;
  }

  async getFleetUtilizationTrend(fleetId: string, hoursBack = 24) {
    const response = await this.client.get(
      `/fleet-intelligence/fleets/${fleetId}/utilization-trend?hoursBack=${hoursBack}`
    );
    return response.data;
  }
}

export const apiClient = new APIClient();
