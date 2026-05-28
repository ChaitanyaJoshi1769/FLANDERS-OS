terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }

  backend "s3" {
    bucket         = "flanders-os-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "flanders-os"
      Terraform   = "true"
    }
  }
}

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name            = "flanders-os-${var.environment}"
  role_arn        = aws_iam_role.eks_role.arn
  version         = var.kubernetes_version

  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = var.public_access_cidrs
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_policy,
    aws_iam_role_policy_attachment.vpc_cni_policy
  ]

  tags = {
    Name = "flanders-os-${var.environment}"
  }
}

# Node Group
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "flanders-os-${var.environment}-ng"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = aws_subnet.private[*].id

  scaling_config {
    desired_size = var.node_desired_size
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  instance_types = var.node_instance_types

  tags = {
    Name = "flanders-os-${var.environment}-node"
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_policy,
    aws_iam_role_policy_attachment.cni_policy,
    aws_iam_role_policy_attachment.registry_policy
  ]
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier          = "flanders-os-${var.environment}"
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = var.db_instance_type
  allocated_storage   = var.db_allocated_storage
  storage_type        = "gp3"
  storage_encrypted   = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = var.db_backup_retention_days
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"
  multi_az                = var.db_multi_az

  skip_final_snapshot       = false
  final_snapshot_identifier = "flanders-os-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  enable_cloudwatch_logs_exports = ["postgresql"]
  monitoring_interval             = 60
  monitoring_role_arn            = aws_iam_role.rds_monitoring.arn

  deletion_protection = true

  tags = {
    Name = "flanders-os-${var.environment}"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "flanders-os-${var.environment}"
  engine               = "redis"
  node_type           = var.redis_node_type
  num_cache_nodes      = var.redis_num_cache_nodes
  parameter_group_name = aws_elasticache_parameter_group.redis.name
  engine_version       = "7.0"
  port                 = 6379

  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [aws_security_group.redis.id]
  automatic_failover_enabled = true

  at_rest_encryption_enabled = true
  transit_encryption_enabled = false
  auth_token                 = var.redis_auth_token

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis_slow_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "slow-log"
  }

  tags = {
    Name = "flanders-os-${var.environment}"
  }
}

# S3 for backups
resource "aws_s3_bucket" "backups" {
  bucket = "flanders-os-${var.environment}-backups-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "flanders-os-${var.environment}-backups"
  }
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "archive-old-backups"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 2555
    }
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "eks" {
  name              = "/aws/eks/flanders-os-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "flanders-os-${var.environment}-eks"
  }
}

resource "aws_cloudwatch_log_group" "redis_slow_log" {
  name              = "/aws/elasticache/flanders-os-${var.environment}/slow-log"
  retention_in_days = var.log_retention_days
}

# Data source for AWS account ID
data "aws_caller_identity" "current" {}

# Outputs
output "eks_cluster_name" {
  value = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.main.endpoint
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "s3_backup_bucket" {
  value = aws_s3_bucket.backups.id
}
