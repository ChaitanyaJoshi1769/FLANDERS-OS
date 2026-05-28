# FLANDERS OS - Enterprise Fleet Intelligence Platform

**Complete Enterprise-Grade Industrial Operating System for Fleet Management, Autonomous Operations, and Safety Compliance**

![Status](https://img.shields.io/badge/status-production_ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Phase](https://img.shields.io/badge/phases-12%2F12%20complete-success)

FLANDERS OS is a comprehensive, enterprise-grade industrial operating system designed for modern fleet management, autonomous operations, and regulatory compliance. All 12 development phases completed and production-ready.

## Platform Capabilities

### 🏭 Industrial Fleet Intelligence
- Real-time machine telemetry and monitoring
- Fleet utilization tracking and analytics
- Machine health diagnostics
- Predictive failure detection
- Asset geolocation and tracking

### ⚡ Electrification & Power Systems
- Motor and drive management
- Power conversion analytics
- DC-to-AC modernization workflows
- Electrical system diagnostics
- Energy efficiency optimization

### 🤖 Industrial Automation
- PLC orchestration and SCADA integration
- Industrial process control
- HMI management and visualization
- Real-time automation workflows
- Embedded safety systems

### 🚀 Autonomous Operations
- Autonomous mission planning and execution
- Fleet coordination and optimization
- Route planning and collision avoidance
- Human-in-the-loop overrides
- Semi-autonomous operations

### 🔍 Predictive Maintenance
- AI-powered failure prediction
- Remaining useful life estimation
- Anomaly detection and root-cause analysis
- Maintenance scheduling optimization
- Spare parts intelligence

### 📊 Digital Twins & Simulation
- Machine digital twin models
- Real-time simulation and visualization
- Historical playback and analysis
- Performance optimization simulations
- 3D equipment visualization

### 🛡️ Safety & Compliance
- Safety event monitoring and alerting
- Compliance workflow management
- Incident tracking and analysis
- Hazard detection systems
- Operational audit trails

## Architecture

FLANDERS OS uses a modern, scalable microservices architecture:

```
├── apps/
│   ├── web/                 # Next.js React frontend
│   ├── mobile/              # React Native mobile app
│   ├── api/                 # NestJS backend API
│   ├── edge-gateway/        # Industrial edge gateway
│   └── ai-services/         # Python AI/ML services
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types
│   ├── auth/                # Authentication library
│   ├── telemetry/           # Telemetry SDK
│   ├── fleet-engine/        # Fleet intelligence engine
│   └── integrations/        # OPC-UA, MQTT, etc.
├── infrastructure/
│   ├── terraform/           # IaC for AWS/cloud
│   ├── kubernetes/          # K8s manifests
│   └── docker/              # Docker configs
└── docs/                    # Documentation
```

## Tech Stack

**Frontend:** Next.js, React, TypeScript, TailwindCSS, shadcn/ui, Recharts, Mapbox GL, Three.js

**Backend:** NestJS, TypeScript, PostgreSQL, Redis, TimescaleDB, Kafka, Elasticsearch

**Industrial:** OPC-UA, MQTT, Modbus, CAN bus, PLC integrations

**AI/ML:** Python, LangChain/LangGraph, scikit-learn, TensorFlow

**Infrastructure:** AWS, Terraform, Docker, Kubernetes, OpenTelemetry, Prometheus, Grafana

**Mobile:** React Native

## Getting Started

### Prerequisites
- Node.js >= 20
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+
- Kafka 7.5+

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ChaitanyaJoshi1769/FLANDERS-OS.git
   cd FLANDERS-OS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start infrastructure:**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

API runs on `http://localhost:3001`
Web UI runs on `http://localhost:3000`

## API Documentation

### Authentication
```bash
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Organizations
```bash
GET /api/v1/organizations
POST /api/v1/organizations
GET /api/v1/organizations/:id
```

### Fleets & Machines
```bash
GET /api/v1/fleets
GET /api/v1/fleets/:id
GET /api/v1/fleets/:id/health
GET /api/v1/machines
GET /api/v1/machines/:id
PATCH /api/v1/machines/:id/location
PATCH /api/v1/machines/:id/status
```

### Telemetry
```bash
POST /api/v1/telemetry/events
GET /api/v1/telemetry/machines/:machineId
```

## Database Schema

The system uses PostgreSQL with TimescaleDB for time-series data:

- **Organizations** - Multi-tenant organizations
- **Users & Roles** - RBAC and access control
- **Sites & Fleets** - Organizational hierarchy
- **Machines** - Heavy equipment inventory
- **Telemetry** - Real-time sensor data
- **Maintenance** - Work orders and predictions
- **Automation** - PLC programs and workflows
- **Safety** - Incidents and compliance
- **Analytics** - AI predictions and anomalies

## Docker Compose Services

- **PostgreSQL** (port 5432) - Primary database
- **TimescaleDB** (port 5433) - Time-series data
- **Redis** (port 6379) - Caching & sessions
- **Kafka** (port 9092) - Event streaming
- **Elasticsearch** (port 9200) - Full-text search & logs
- **Prometheus** (port 9090) - Metrics collection
- **Grafana** (port 3000) - Visualization
- **Jaeger** (port 16686) - Distributed tracing
- **MinIO** (port 9000) - S3-compatible storage

## Development Workflow

### Running Tests
```bash
npm run test                  # Unit tests
npm run test:e2e            # End-to-end tests
npm run test:cov            # Coverage report
```

### Linting & Formatting
```bash
npm run lint                 # ESLint
npm run format              # Prettier
npm run type-check          # TypeScript check
```

### Building for Production
```bash
npm run build
npm run start
```

## Deployment

### Docker
```bash
docker build -t flanders-os:latest .
docker run -p 3001:3001 flanders-os:latest
```

### Kubernetes
```bash
kubectl apply -f infrastructure/kubernetes/
```

### AWS
```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

## Project Status - All 12 Phases Complete ✅

| Phase | Name | Status | Details |
|-------|------|--------|---------|
| 1 | Monorepo Foundation & Architecture | ✅ Complete | Turbo-based monorepo, TypeScript config, CI/CD |
| 2 | Authentication & Governance | ✅ Complete | JWT auth, MFA, RBAC, audit logging |
| 3 | Telemetry & Fleet Intelligence | ✅ Complete | Real-time monitoring, health metrics, analytics |
| 4 | Industrial Automation | ✅ Complete | OPC-UA, MQTT, Modbus, CAN bus integration |
| 5 | Frontend Command Center | ✅ Complete | Next.js dashboard, interactive visualization |
| 6 | Predictive Maintenance AI | ✅ Complete | ML models, RUL calculations, work orders |
| 7 | Autonomous Operations | ✅ Complete | Mission planning, fleet coordination, optimization |
| 8 | Safety & Compliance | ✅ Complete | Incident tracking, compliance auditing |
| 9 | Enterprise Integrations | ✅ Complete | ERP sync, webhooks, data synchronization |
| 10 | Mobile Application | ✅ Complete | React Native app, notifications, location tracking |
| 11 | Testing & Security Hardening | ✅ Complete | Test suites, security audit, optimization |
| 12 | Deployment & Production Ready | ✅ Complete | Kubernetes, Terraform, Docker, deployment guide |

## Contributing

FLANDERS OS is built by an elite team of industrial systems architects, electrification engineers, and AI/ML specialists.

## License

Proprietary - FLANDERS OS

## Support & Resources

- 📚 [Architecture Documentation](./docs/ARCHITECTURE.md)
- 🔧 [API Reference](./docs/API.md)
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md)
- 🛡️ [Security Guide](./docs/SECURITY.md)

---

**FLANDERS OS: Modernizing Industrial Operations Through Intelligent Automation**
