# FLANDERS OS Deployment & Production Readiness Guide

Comprehensive guide for deploying FLANDERS OS to production environments using Terraform, Kubernetes, and Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Infrastructure Setup](#infrastructure-setup)
3. [Docker Build & Push](#docker-build--push)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Database Migration](#database-migration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Production Checklist](#production-checklist)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Tools Required
- Terraform >= 1.0
- kubectl >= 1.28
- Helm >= 3.10
- Docker >= 20.10
- AWS CLI >= 2.0
- jq

### AWS Account Setup
```bash
# Configure AWS credentials
aws configure

# Verify access
aws sts get-caller-identity

# Create S3 bucket for Terraform state
aws s3 mb s3://flanders-os-terraform-state --region us-east-1

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1
```

### Environment Variables
```bash
# Create terraform.tfvars
cat > terraform/terraform.tfvars << EOF
aws_region     = "us-east-1"
environment    = "prod"
db_password    = "$(openssl rand -base64 32)"
redis_auth_token = "$(openssl rand -base64 32)"
EOF

# Export variables
export AWS_REGION=us-east-1
export ENVIRONMENT=prod
export ECR_REGISTRY="$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com"
```

## Infrastructure Setup

### Step 1: Create AWS Resources with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan infrastructure
terraform plan -out=tfplan

# Apply configuration (requires approval)
terraform apply tfplan
```

### Step 2: Configure kubectl Context

```bash
# Update kubeconfig
aws eks update-kubeconfig \
  --name flanders-os-prod \
  --region us-east-1

# Verify cluster access
kubectl get nodes

# Expected output:
# NAME                          STATUS   ROLES    AGE   VERSION
# ip-10-0-1-xxx.ec2.internal   Ready    <none>   5m    v1.28.x
```

### Step 3: Create Namespaces and Secrets

```bash
# Create namespace
kubectl create namespace flanders-os

# Create secrets
kubectl create secret generic api-secrets \
  --from-literal=JWT_SECRET=$(openssl rand -base64 32) \
  --from-literal=DATABASE_PASSWORD=<from-tfvars> \
  --from-literal=REDIS_PASSWORD=<from-tfvars> \
  -n flanders-os

kubectl create secret generic postgres-secret \
  --from-literal=password=<from-tfvars> \
  -n flanders-os
```

## Docker Build & Push

### Step 1: Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name flanders-os/api \
  --region us-east-1

aws ecr create-repository \
  --repository-name flanders-os/web \
  --region us-east-1

# Get registry URL
export ECR_REGISTRY="$(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com"
```

### Step 2: Build Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $ECR_REGISTRY

# Build API image
docker build \
  -f apps/api/Dockerfile.prod \
  -t $ECR_REGISTRY/flanders-os/api:latest \
  -t $ECR_REGISTRY/flanders-os/api:$(git describe --tags --always) \
  .

# Build Web image
docker build \
  -f apps/web/Dockerfile.prod \
  -t $ECR_REGISTRY/flanders-os/web:latest \
  -t $ECR_REGISTRY/flanders-os/web:$(git describe --tags --always) \
  .

# Verify images
docker images | grep flanders-os
```

### Step 3: Push to ECR

```bash
# Push API image
docker push $ECR_REGISTRY/flanders-os/api:latest
docker push $ECR_REGISTRY/flanders-os/api:$(git describe --tags --always)

# Push Web image
docker push $ECR_REGISTRY/flanders-os/web:latest
docker push $ECR_REGISTRY/flanders-os/web:$(git describe --tags --always)

# Verify pushed images
aws ecr describe-images \
  --repository-name flanders-os/api \
  --region us-east-1
```

## Kubernetes Deployment

### Step 1: Update Deployment Manifests

```bash
# Update image references in k8s manifests
export IMAGE_TAG=$(git describe --tags --always)

for file in k8s/*.yaml; do
  sed -i "s|image: flanders-os/api:latest|image: $ECR_REGISTRY/flanders-os/api:$IMAGE_TAG|g" "$file"
  sed -i "s|image: flanders-os/web:latest|image: $ECR_REGISTRY/flanders-os/web:$IMAGE_TAG|g" "$file"
done
```

### Step 2: Deploy to Kubernetes

```bash
# Deploy PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod \
  -l app=postgres \
  -n flanders-os \
  --timeout=300s

# Deploy API
kubectl apply -f k8s/api-deployment.yaml

# Verify API deployment
kubectl rollout status deployment/api -n flanders-os

# Check pod status
kubectl get pods -n flanders-os

# View logs
kubectl logs -f deployment/api -n flanders-os
```

### Step 3: Verify Deployment

```bash
# Check all resources
kubectl get all -n flanders-os

# Test API connectivity
kubectl port-forward svc/api 3000:80 -n flanders-os

# In another terminal
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2026-05-28T..."}
```

## Database Migration

### Step 1: Run Migrations

```bash
# Port-forward to database
kubectl port-forward svc/postgres 5432:5432 -n flanders-os &

# Run migrations
npm run migrate -- --database-url="postgresql://postgres:password@localhost:5432/flanders_os"

# Verify migration
npm run migrate -- --check
```

### Step 2: Seed Initial Data

```bash
# Run seed script
npm run seed

# Verify data
psql -h localhost -U postgres -d flanders_os -c "SELECT COUNT(*) FROM organizations;"
```

## Monitoring & Logging

### Step 1: Deploy Prometheus & Grafana

```bash
# Add Prometheus Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --values monitoring/prometheus-values.yaml

# Install Grafana (included in kube-prometheus-stack)
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

### Step 2: Configure CloudWatch

```bash
# Enable container insights
aws eks update-cluster-config \
  --name flanders-os-prod \
  --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true}]}' \
  --region us-east-1

# Verify logging
aws logs describe-log-groups | grep "/aws/eks/flanders-os"
```

### Step 3: Setup Alerts

```bash
# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name flanders-os-api-errors \
  --alarm-description "Alert on high API error rate" \
  --metric-name ErrorCount \
  --namespace AWS/ECS \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Configure SNS notifications
aws sns create-topic --name flanders-os-alerts
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT:flanders-os-alerts \
  --protocol email \
  --notification-endpoint ops@flanders-os.io
```

## Backup & Recovery

### Step 1: Enable Automated Backups

```bash
# Verify RDS backups are enabled
aws rds describe-db-instances \
  --db-instance-identifier flanders-os-prod \
  --query 'DBInstances[0].BackupRetentionPeriod'

# Create snapshot
aws rds create-db-snapshot \
  --db-instance-identifier flanders-os-prod \
  --db-snapshot-identifier flanders-os-prod-backup-$(date +%Y%m%d-%H%M%S)
```

### Step 2: Test Recovery

```bash
# Create test instance from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier flanders-os-prod-test \
  --db-snapshot-identifier flanders-os-prod-backup-YYYYMMDD-HHMMSS

# Verify restoration
aws rds describe-db-instances \
  --db-instance-identifier flanders-os-prod-test
```

### Step 3: Disaster Recovery Plan

Document procedures for:
1. **RTO (Recovery Time Objective)**: 4 hours
2. **RPO (Recovery Point Objective)**: 1 hour
3. **Failover Procedure**: Promote read replica or restore from snapshot
4. **Communication Plan**: Notify stakeholders, update status page

## Production Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Database migrations tested
- [ ] Disaster recovery plan documented
- [ ] Team trained on deployment process
- [ ] Monitoring and alerting configured
- [ ] Backup strategy verified
- [ ] DNS and SSL certificates ready

### Deployment Day
- [ ] Maintenance window scheduled
- [ ] Rollback plan prepared
- [ ] Team on standby
- [ ] Communications channels active
- [ ] Infrastructure provisioned
- [ ] Docker images built and tested
- [ ] Database migrations validated
- [ ] Health checks configured
- [ ] Deployment initiated
- [ ] Smoke tests passed
- [ ] Monitoring verified
- [ ] Users notified of deployment

### Post-Deployment
- [ ] All services healthy
- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] Logs collected and analyzed
- [ ] Security scan completed
- [ ] Performance baseline established
- [ ] Runbook updated
- [ ] Lessons learned documented
- [ ] Team debriefing completed

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod POD_NAME -n flanders-os

# View logs
kubectl logs POD_NAME -n flanders-os

# Common issues:
# - ImagePullBackOff: Check ECR credentials
# - CrashLoopBackOff: Check application logs
# - Pending: Check resource availability
```

### Database Connection Issues

```bash
# Verify database is running
kubectl get pod postgres-0 -n flanders-os

# Check database logs
kubectl logs postgres-0 -n flanders-os

# Port-forward and test connection
kubectl port-forward svc/postgres 5432:5432 -n flanders-os
psql -h localhost -U postgres
```

### API Health Check Failing

```bash
# Check API logs
kubectl logs -f deployment/api -n flanders-os

# Verify endpoints
kubectl exec -it deployment/api -n flanders-os -- curl localhost:3000/health

# Check environment variables
kubectl describe deployment api -n flanders-os
```

### Resource Exhaustion

```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n flanders-os

# Scale deployment
kubectl scale deployment api --replicas=5 -n flanders-os

# Check HPA status
kubectl get hpa -n flanders-os
```

## Rollback Procedure

If issues occur post-deployment:

```bash
# View deployment history
kubectl rollout history deployment/api -n flanders-os

# Rollback to previous version
kubectl rollout undo deployment/api -n flanders-os

# Verify rollback
kubectl rollout status deployment/api -n flanders-os

# Alternatively, redeploy previous version
kubectl set image deployment/api \
  api=$ECR_REGISTRY/flanders-os/api:PREVIOUS_TAG \
  -n flanders-os
```

## Scaling Considerations

### Horizontal Pod Autoscaling (HPA)
- CPU threshold: 70%
- Memory threshold: 80%
- Min replicas: 3
- Max replicas: 10
- Scale-up time: 1 minute
- Scale-down time: 5 minutes

### Database Optimization
- Connection pooling: 5-20 connections
- Read replicas: Consider for >1000 RPS
- Query caching: Redis for hot data
- Partitioning: Consider for >100GB data

### Load Balancing
- API distribution: Round-robin
- Sticky sessions: Only if required
- Health checks: Every 30 seconds
- Timeout: 30 seconds

---

**Last Updated**: 2026-05-28
**Maintenance Window**: Sunday 2-4 AM UTC
**Emergency Contact**: ops@flanders-os.io
