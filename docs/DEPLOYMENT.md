# FLANDERS OS Deployment Guide

## Local Development Setup

### 1. Prerequisites
- Node.js >= 20.0.0
- Docker Desktop (with Docker Compose)
- Git
- PostgreSQL 16 (if running outside Docker)
- Redis 7 (if running outside Docker)

### 2. Clone Repository
```bash
git clone https://github.com/ChaitanyaJoshi1769/FLANDERS-OS.git
cd FLANDERS-OS
```

### 3. Environment Setup
```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local

# Edit with your settings
nano apps/api/.env.local
nano apps/web/.env.local
```

### 4. Start Infrastructure
```bash
# Start all services (PostgreSQL, Redis, Kafka, Elasticsearch, etc.)
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
docker-compose ps
```

### 5. Install Dependencies
```bash
# Install monorepo dependencies
npm install

# This installs dependencies for all workspaces
```

### 6. Initialize Database
```bash
# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 7. Start Development Servers
```bash
# Start all apps in development mode (API, Web, etc.)
npm run dev

# This starts:
# - API server on http://localhost:3001
# - Web frontend on http://localhost:3000
```

### 8. Verify Setup
```bash
# Check API health
curl http://localhost:3001/api/v1/health

# Check frontend
open http://localhost:3000
```

## Docker Compose Services

The `docker-compose.yml` defines:

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database |
| TimescaleDB | 5433 | Time-series data |
| Redis | 6379 | Caching & sessions |
| Kafka | 9092 | Event streaming |
| Elasticsearch | 9200 | Search & logging |
| Prometheus | 9090 | Metrics |
| Grafana | 3000 | Dashboards |
| Jaeger | 16686 | Distributed tracing |
| MinIO | 9000 | Object storage |

## Production Deployment

### 1. Build Docker Images
```bash
# Build API image
docker build -f apps/api/Dockerfile -t flanders-api:latest apps/api/

# Build Web image
docker build -f apps/web/Dockerfile -t flanders-web:latest apps/web/

# Tag for registry
docker tag flanders-api:latest myregistry.azurecr.io/flanders-api:latest
docker tag flanders-web:latest myregistry.azurecr.io/flanders-web:latest

# Push to registry
docker push myregistry.azurecr.io/flanders-api:latest
docker push myregistry.azurecr.io/flanders-web:latest
```

### 2. Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS)
- kubectl configured
- Helm 3+
- Ingress controller

#### Deploy with Helm
```bash
# Add Helm repository (when available)
helm repo add flanders https://charts.flanders-os.com
helm repo update

# Install chart
helm install flanders flanders/flanders-os \
  --namespace production \
  --create-namespace \
  --values values-prod.yaml

# Verify deployment
kubectl get pods -n production
kubectl get svc -n production
```

#### Manual Kubectl Deployment
```bash
# Create namespace
kubectl create namespace production

# Apply configurations
kubectl apply -f infrastructure/kubernetes/ -n production

# Verify
kubectl get all -n production
```

### 3. AWS ECS Deployment
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker tag flanders-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/flanders-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/flanders-api:latest

# Update ECS service
aws ecs update-service \
  --cluster flanders-prod \
  --service flanders-api \
  --force-new-deployment
```

### 4. Infrastructure as Code (Terraform)
```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var-file=prod.tfvars

# Apply configuration
terraform apply -var-file=prod.tfvars

# Outputs (API endpoint, database URL, etc.)
terraform output
```

## Database Management

### Migrations
```bash
# Create new migration
npm run migrate:create -- -n add_new_table

# Run pending migrations
npm run db:migrate

# Rollback (if applicable)
npm run migrate:revert
```

### Backups
```bash
# Backup PostgreSQL
pg_dump -h localhost -U flanders -d flanders > backup.sql

# Restore
psql -h localhost -U flanders -d flanders < backup.sql

# Backup with S3
pg_dump -h localhost -U flanders -d flanders | gzip | \
  aws s3 cp - s3://backups/flanders/db-$(date +%Y%m%d).sql.gz
```

## Monitoring & Observability

### Prometheus
- Access: http://localhost:9090
- Scrapes API metrics every 15 seconds
- Retention: 30 days by default

### Grafana
- Access: http://localhost:3000
- Default credentials: admin/admin
- Pre-configured dashboards for:
  - API performance
  - Database health
  - Kafka metrics
  - Fleet health

### Jaeger Tracing
- Access: http://localhost:16686
- Traces API requests end-to-end
- Sample rate: 100% in dev, 10% in prod

### Logs (Elasticsearch + Kibana)
```bash
# View logs
curl -s http://localhost:9200/_cat/indices

# Search logs
curl -X GET "localhost:9200/flanders-logs/_search?pretty" -H 'Content-Type: application/json' -d'{
  "query": {
    "match": {
      "level": "error"
    }
  }
}'
```

## Health Checks & Readiness

### API Health
```bash
curl http://localhost:3001/api/v1/health
```

Response:
```json
{
  "status": "ok",
  "service": "FLANDERS OS API",
  "version": "1.0.0"
}
```

### Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /api/v1/health
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/v1/health
    port: 3001
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Scaling

### Horizontal Scaling
```bash
# Scale API deployment
kubectl scale deployment flanders-api --replicas=5 -n production

# Scale with HPA (Horizontal Pod Autoscaler)
kubectl apply -f infrastructure/kubernetes/hpa.yaml -n production
```

### Database Scaling
```bash
# RDS Read Replicas
aws rds create-db-instance-read-replica \
  --db-instance-identifier flanders-read-1 \
  --source-db-instance-identifier flanders-prod
```

## Updating

### Rolling Update
```bash
# Update image
kubectl set image deployment/flanders-api \
  api=myregistry.azurecr.io/flanders-api:v1.1.0 \
  -n production --record

# Monitor rollout
kubectl rollout status deployment/flanders-api -n production

# Rollback if needed
kubectl rollout undo deployment/flanders-api -n production
```

## Security

### Secrets Management
```bash
# Create secret
kubectl create secret generic flanders-secrets \
  --from-literal=db-password=XXX \
  --from-literal=jwt-secret=XXX \
  -n production

# Mount in deployment
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: flanders-secrets
      key: db-password
```

### SSL/TLS
```bash
# Create certificate
kubectl create secret tls flanders-tls \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem \
  -n production

# Use in Ingress
spec:
  tls:
  - hosts:
    - api.flanders-os.com
    secretName: flanders-tls
```

## Troubleshooting

### Check Logs
```bash
# API logs
docker logs flanders-api

# Kubernetes logs
kubectl logs -f deployment/flanders-api -n production

# Stream logs from all pods
kubectl logs -f -l app=flanders-api --all-containers=true -n production
```

### Port Forwarding
```bash
# Forward local port to Kubernetes service
kubectl port-forward -n production svc/flanders-api 3001:3001

# Now access API on localhost:3001
curl http://localhost:3001/api/v1/health
```

### Database Connection Issues
```bash
# Test connection
psql -h postgres.example.com -U flanders -d flanders -c "SELECT 1;"

# Check connection pool
SELECT count(*) FROM pg_stat_activity;
```

## Disaster Recovery

### Automated Backups
```bash
# Daily automated backups via AWS Backup
aws backup create-backup-plan \
  --backup-plan file://backup-plan.json

# Restore from backup
aws backup start-restore-job \
  --recovery-point-arn arn:aws:backup:...
```

### Multi-Region Setup
```bash
# Deploy to multiple regions
terraform apply -var region=us-west-2
terraform apply -var region=eu-west-1

# Configure Route53 failover
```

## Cost Optimization

- Use Reserved Instances for stable workloads
- Schedule scaling down during off-hours
- Use Spot instances for non-critical jobs
- Monitor CloudWatch for cost anomalies
- Implement data lifecycle policies
