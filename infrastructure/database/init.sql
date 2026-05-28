-- FLANDERS OS Database Initialization
-- Enterprise multi-tenant industrial operating system

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS fleet;
CREATE SCHEMA IF NOT EXISTS telemetry;
CREATE SCHEMA IF NOT EXISTS automation;
CREATE SCHEMA IF NOT EXISTS maintenance;
CREATE SCHEMA IF NOT EXISTS safety;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS auth;

-- Set search path
ALTER USER flanders SET search_path = public, core, fleet, telemetry, automation, maintenance, safety, analytics, auth;

-- Core domain types
CREATE TYPE core.organization_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE core.user_status AS ENUM ('active', 'inactive', 'invited', 'deactivated');
CREATE TYPE fleet.machine_status AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned', 'unknown');
CREATE TYPE fleet.machine_type AS ENUM ('excavator', 'haul_truck', 'drill', 'loader', 'dozer', 'motor', 'generator', 'other');
CREATE TYPE telemetry.telemetry_status AS ENUM ('healthy', 'degraded', 'critical', 'offline');
CREATE TYPE maintenance.work_order_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE maintenance.failure_severity AS ENUM ('info', 'warning', 'critical', 'catastrophic');

-- ============================================================
-- CORE: Organizations and Governance
-- ============================================================

CREATE TABLE core.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status core.organization_status DEFAULT 'active',
  description TEXT,
  logo_url VARCHAR(500),
  tier VARCHAR(50) DEFAULT 'enterprise',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
CREATE INDEX idx_organizations_slug ON core.organizations(slug);
CREATE INDEX idx_organizations_status ON core.organizations(status);

CREATE TABLE core.industrial_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  name VARCHAR(255) NOT NULL,
  location_lat FLOAT,
  location_lon FLOAT,
  region VARCHAR(100),
  site_type VARCHAR(50), -- mining, manufacturing, power, etc.
  timezone VARCHAR(50) DEFAULT 'UTC',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, name)
);
CREATE INDEX idx_industrial_sites_org ON core.industrial_sites(organization_id);
CREATE INDEX idx_industrial_sites_location ON core.industrial_sites(location_lat, location_lon);

-- ============================================================
-- AUTH: Users and Access Control
-- ============================================================

CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  status core.user_status DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  mfa_enabled BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  password_hash VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, email)
);
CREATE INDEX idx_users_org ON auth.users(organization_id);
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_status ON auth.users(status);

CREATE TABLE auth.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, name)
);

CREATE TABLE auth.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role_id UUID NOT NULL REFERENCES auth.roles(id),
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP,
  UNIQUE(user_id, role_id)
);
CREATE INDEX idx_user_roles_user ON auth.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON auth.user_roles(role_id);

CREATE TABLE auth.access_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  scope VARCHAR(500),
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_access_tokens_user ON auth.access_tokens(user_id);
CREATE INDEX idx_access_tokens_expires ON auth.access_tokens(expires_at);

-- ============================================================
-- FLEET: Machines and Fleet Management
-- ============================================================

CREATE TABLE fleet.fleets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  site_id UUID NOT NULL REFERENCES core.industrial_sites(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fleet_type VARCHAR(50), -- mining, construction, logistics, etc.
  total_machines INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(organization_id, site_id, name)
);
CREATE INDEX idx_fleets_org ON fleet.fleets(organization_id);
CREATE INDEX idx_fleets_site ON fleet.fleets(site_id);

CREATE TABLE fleet.machines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  fleet_id UUID NOT NULL REFERENCES fleet.fleets(id),
  site_id UUID NOT NULL REFERENCES core.industrial_sites(id),
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) UNIQUE,
  machine_type fleet.machine_type NOT NULL,
  status fleet.machine_status DEFAULT 'unknown',
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  year_manufactured INTEGER,
  acquisition_date DATE,
  location_lat FLOAT,
  location_lon FLOAT,
  heading FLOAT,
  battery_level FLOAT,
  fuel_level FLOAT,
  operating_hours INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_machines_org ON fleet.machines(organization_id);
CREATE INDEX idx_machines_fleet ON fleet.machines(fleet_id);
CREATE INDEX idx_machines_serial ON fleet.machines(serial_number);
CREATE INDEX idx_machines_status ON fleet.machines(status);
CREATE INDEX idx_machines_location ON fleet.machines(location_lat, location_lon);

CREATE TABLE fleet.machine_sensors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  sensor_name VARCHAR(100) NOT NULL,
  sensor_type VARCHAR(50), -- temperature, vibration, pressure, etc.
  unit VARCHAR(20),
  min_threshold FLOAT,
  max_threshold FLOAT,
  alert_enabled BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(machine_id, sensor_name)
);
CREATE INDEX idx_machine_sensors_machine ON fleet.machine_sensors(machine_id);

-- ============================================================
-- TELEMETRY: Real-time Machine Data
-- ============================================================

CREATE TABLE telemetry.telemetry_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  stream_name VARCHAR(100) NOT NULL,
  stream_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(machine_id, stream_name)
);
CREATE INDEX idx_telemetry_streams_machine ON telemetry.telemetry_streams(machine_id);

CREATE TABLE telemetry.sensor_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  sensor_id UUID REFERENCES fleet.machine_sensors(id),
  sensor_name VARCHAR(100),
  value FLOAT NOT NULL,
  unit VARCHAR(20),
  status telemetry.telemetry_status DEFAULT 'healthy',
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);
CREATE INDEX idx_sensor_events_machine ON telemetry.sensor_events(machine_id);
CREATE INDEX idx_sensor_events_sensor ON telemetry.sensor_events(sensor_id);
CREATE INDEX idx_sensor_events_timestamp ON telemetry.sensor_events(timestamp);

CREATE TABLE telemetry.operational_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  utilization_percent FLOAT,
  fuel_consumption_rate FLOAT,
  power_output FLOAT,
  cycle_time_seconds FLOAT,
  payload_weight FLOAT,
  temperature_celsius FLOAT,
  vibration_level FLOAT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_operational_metrics_machine ON telemetry.operational_metrics(machine_id);
CREATE INDEX idx_operational_metrics_timestamp ON telemetry.operational_metrics(timestamp);

-- ============================================================
-- MAINTENANCE: Predictive and Preventive Maintenance
-- ============================================================

CREATE TABLE maintenance.work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status maintenance.work_order_status DEFAULT 'open',
  priority VARCHAR(20), -- low, medium, high, critical
  assigned_to UUID REFERENCES auth.users(id),
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  estimated_duration_hours FLOAT,
  actual_duration_hours FLOAT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_work_orders_org ON maintenance.work_orders(organization_id);
CREATE INDEX idx_work_orders_machine ON maintenance.work_orders(machine_id);
CREATE INDEX idx_work_orders_status ON maintenance.work_orders(status);

CREATE TABLE maintenance.failure_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  failure_type VARCHAR(100),
  severity maintenance.failure_severity DEFAULT 'warning',
  root_cause TEXT,
  time_to_repair INTERVAL,
  detected_at TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_failure_events_machine ON maintenance.failure_events(machine_id);
CREATE INDEX idx_failure_events_severity ON maintenance.failure_events(severity);
CREATE INDEX idx_failure_events_detected ON maintenance.failure_events(detected_at);

CREATE TABLE maintenance.maintenance_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  failure_type VARCHAR(100),
  predicted_failure_date TIMESTAMP,
  confidence_percent FLOAT,
  recommended_action TEXT,
  model_version VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_maintenance_predictions_machine ON maintenance.maintenance_predictions(machine_id);
CREATE INDEX idx_maintenance_predictions_failure_date ON maintenance.maintenance_predictions(predicted_failure_date);

-- ============================================================
-- AUTOMATION: Industrial Control Systems
-- ============================================================

CREATE TABLE automation.plc_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  program_type VARCHAR(50), -- ladder, structured_text, il, etc.
  version VARCHAR(20),
  content BYTEA,
  is_deployed BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_plc_programs_org ON automation.plc_programs(organization_id);

CREATE TABLE automation.automation_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  name VARCHAR(255) NOT NULL,
  workflow_definition JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_automation_workflows_org ON automation.automation_workflows(organization_id);

CREATE TABLE automation.control_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES automation.automation_workflows(id),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  event_type VARCHAR(50),
  event_data JSONB,
  executed_by UUID REFERENCES auth.users(id),
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_control_events_workflow ON automation.control_events(workflow_id);
CREATE INDEX idx_control_events_machine ON automation.control_events(machine_id);

-- ============================================================
-- SAFETY: Safety and Compliance
-- ============================================================

CREATE TABLE safety.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  site_id UUID NOT NULL REFERENCES core.industrial_sites(id),
  machine_id UUID REFERENCES fleet.machines(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20), -- minor, major, critical
  reported_by UUID NOT NULL REFERENCES auth.users(id),
  incident_date TIMESTAMP NOT NULL,
  resolved_date TIMESTAMP,
  root_cause TEXT,
  corrective_actions TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_incidents_org ON safety.incidents(organization_id);
CREATE INDEX idx_incidents_site ON safety.incidents(site_id);
CREATE INDEX idx_incidents_machine ON safety.incidents(machine_id);

CREATE TABLE safety.safety_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  event_type VARCHAR(100),
  severity VARCHAR(20),
  description TEXT,
  detected_at TIMESTAMP NOT NULL,
  acknowledged_at TIMESTAMP,
  acknowledged_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_safety_events_machine ON safety.safety_events(machine_id);
CREATE INDEX idx_safety_events_severity ON safety.safety_events(severity);

-- ============================================================
-- ANALYTICS: AI Predictions and Insights
-- ============================================================

CREATE TABLE analytics.ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  prediction_type VARCHAR(100),
  predicted_value FLOAT,
  confidence_percent FLOAT,
  input_features JSONB,
  model_version VARCHAR(50),
  valid_until TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ai_predictions_machine ON analytics.ai_predictions(machine_id);
CREATE INDEX idx_ai_predictions_type ON analytics.ai_predictions(prediction_type);

CREATE TABLE analytics.anomaly_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES fleet.machines(id),
  anomaly_type VARCHAR(100),
  severity VARCHAR(20),
  anomaly_score FLOAT,
  description TEXT,
  detected_at TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_anomaly_events_machine ON analytics.anomaly_events(machine_id);
CREATE INDEX idx_anomaly_events_detected ON analytics.anomaly_events(detected_at);

-- ============================================================
-- AUDIT AND LOGGING
-- ============================================================

CREATE TABLE core.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES core.organizations(id),
  user_id UUID REFERENCES auth.users(id),
  resource_type VARCHAR(50),
  resource_id UUID,
  action VARCHAR(50),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_org ON core.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON core.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON core.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_timestamp ON core.audit_logs(created_at);

-- ============================================================
-- Trigger for updated_at timestamps
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON core.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_industrial_sites_updated_at BEFORE UPDATE ON core.industrial_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON fleet.machines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON maintenance.work_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_plc_programs_updated_at BEFORE UPDATE ON automation.plc_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON automation.automation_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Verify schema setup
SELECT 'FLANDERS OS Database initialized successfully' AS status;
