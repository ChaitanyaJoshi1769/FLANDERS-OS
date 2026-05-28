# FLANDERS OS API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

**Header:**
```
Authorization: Bearer <access_token>
```

## Health Check

### GET `/health`
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-28T10:30:00Z",
  "service": "FLANDERS OS API",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### POST `/auth/register`
Register a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "organizationId": "uuid",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "status": "active"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900
}
```

### POST `/auth/login`
User login.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "organizationId": "uuid"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900
}
```

### POST `/auth/refresh`
Refresh access token (requires valid JWT).

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 900
}
```

### POST `/auth/logout`
Logout user (requires valid JWT).

---

## Organizations Endpoints

### POST `/organizations`
Create a new organization.

**Body:**
```json
{
  "name": "Acme Mining Corp",
  "slug": "acme-mining",
  "description": "Global mining operations",
  "tier": "enterprise"
}
```

### GET `/organizations`
List all organizations.

### GET `/organizations/:id`
Get organization details.

### GET `/organizations/slug/:slug`
Get organization by slug.

### PATCH `/organizations/:id`
Update organization (requires JWT).

---

## Machines & Fleet Endpoints

### POST `/fleets`
Create a new fleet (requires JWT).

**Body:**
```json
{
  "organizationId": "uuid",
  "siteId": "uuid",
  "name": "Main Fleet",
  "fleetType": "mining",
  "description": "Primary mining fleet"
}
```

### GET `/fleets/:id`
Get fleet details with machines.

### GET `/fleets/:id/health`
Get fleet health metrics.

**Response:**
```json
{
  "fleetId": "uuid",
  "fleetName": "Main Fleet",
  "totalMachines": 50,
  "statusCounts": {
    "active": 45,
    "maintenance": 3,
    "inactive": 2,
    "offline": 0
  },
  "averageUtilization": 78,
  "criticalAnomalies": 2,
  "health": "healthy",
  "lastUpdate": "2026-05-28T10:30:00Z"
}
```

### POST `/machines`
Create a new machine (requires JWT).

**Body:**
```json
{
  "organizationId": "uuid",
  "fleetId": "uuid",
  "siteId": "uuid",
  "name": "Excavator-01",
  "serialNumber": "EXC-2024-001",
  "machineType": "excavator",
  "manufacturer": "Caterpillar",
  "model": "CAT 390F",
  "yearManufactured": 2023,
  "acquisitionDate": "2023-06-15"
}
```

### GET `/machines/:id`
Get machine details.

### GET `/machines/serial/:serialNumber`
Get machine by serial number.

### GET `/machines/fleet/:fleetId`
List machines in a fleet.

### PATCH `/machines/:id`
Update machine (requires JWT).

### PATCH `/machines/:id/location`
Update machine location (requires JWT).

**Body:**
```json
{
  "lat": 40.7128,
  "lon": -74.0060,
  "heading": 45.5
}
```

### PATCH `/machines/:id/status`
Update machine status (requires JWT).

**Body:**
```json
{
  "status": "active" | "inactive" | "maintenance" | "decommissioned"
}
```

---

## Telemetry Endpoints

### POST `/telemetry/sensor-events`
Ingest a single sensor event (requires JWT).

**Body:**
```json
{
  "machineId": "uuid",
  "sensorName": "temperature_sensor_01",
  "value": 78.5,
  "unit": "°C",
  "minThreshold": 20,
  "maxThreshold": 85,
  "metadata": {
    "location": "engine"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "machineId": "uuid",
  "sensorName": "temperature_sensor_01",
  "value": 78.5,
  "unit": "°C",
  "status": "healthy",
  "timestamp": "2026-05-28T10:30:00Z"
}
```

### POST `/telemetry/batch-events`
Ingest multiple sensor events in batch (requires JWT).

**Body:**
```json
{
  "events": [
    {
      "machineId": "uuid",
      "sensorName": "temp_01",
      "value": 78.5,
      "unit": "°C"
    },
    {
      "machineId": "uuid",
      "sensorName": "vibration_01",
      "value": 2.3,
      "unit": "mm/s"
    }
  ]
}
```

### POST `/telemetry/operational-metrics`
Ingest operational metrics (requires JWT).

**Body:**
```json
{
  "machineId": "uuid",
  "utilizationPercent": 85.5,
  "fuelConsumptionRate": 42.3,
  "powerOutput": 380,
  "cycleTimeSeconds": 120,
  "payloadWeight": 45000,
  "temperatureCelsius": 78.5,
  "vibrationLevel": 2.3
}
```

### GET `/telemetry/machines/:machineId`
Get machine telemetry (requires JWT).

**Query Parameters:**
- `limit` (default: 100) - Number of events to return

**Response:**
```json
{
  "machineId": "uuid",
  "sensorEvents": [...],
  "operationalMetrics": [...],
  "lastUpdate": "2026-05-28T10:30:00Z"
}
```

### GET `/telemetry/machines/:machineId/latest`
Get latest telemetry for machine (requires JWT).

### GET `/telemetry/machines/:machineId/anomalies`
Get anomaly events for machine (requires JWT).

---

## Fleet Intelligence Endpoints

### GET `/fleet-intelligence/fleets/:fleetId/health`
Get comprehensive fleet health report (requires JWT).

### GET `/fleet-intelligence/machines/:machineId/health`
Get machine health metrics (requires JWT).

**Response:**
```json
{
  "machineId": "uuid",
  "machineName": "Excavator-01",
  "status": "active",
  "serialNumber": "EXC-2024-001",
  "operatingHours": 1250,
  "batteryLevel": 85,
  "utilization": 78,
  "temperature": 78.5,
  "vibration": 2.3,
  "anomalies": 0,
  "lastUpdate": "2026-05-28T10:30:00Z"
}
```

### GET `/fleet-intelligence/fleets/:fleetId/utilization-trend`
Get fleet utilization trend (requires JWT).

**Query Parameters:**
- `hoursBack` (default: 24) - Number of hours to analyze

**Response:**
```json
{
  "fleetId": "uuid",
  "timeRange": {
    "from": "2026-05-27T10:30:00Z",
    "to": "2026-05-28T10:30:00Z"
  },
  "hoursBack": 24,
  "trend": [
    {
      "timestamp": "2026-05-27T10:00:00Z",
      "averageUtilization": 75,
      "averageFuelConsumption": "38.5",
      "averageTemperature": "76.2"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

- Rate limit: 1000 requests per minute per IP
- Rate limit header: `X-RateLimit-Remaining`

## Pagination

List endpoints support pagination:
- `page` (default: 1)
- `limit` (default: 20, max: 100)

## Sorting

List endpoints support sorting:
- `sort` parameter: `field:asc` or `field:desc`
- Example: `?sort=createdAt:desc`
