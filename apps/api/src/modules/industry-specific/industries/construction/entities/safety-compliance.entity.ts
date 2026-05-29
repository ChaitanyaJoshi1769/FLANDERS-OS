import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('construction_safety_compliance')
export class SafetyCompliance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  siteId: string;

  @Column('jsonb')
  dailyInspections: Array<{ date: string; issues: string[]; resolution: string }>;

  @Column('jsonb')
  incidents: Array<{ date: string; severity: string; description: string; status: string }>;

  @Column('float')
  safetyScore: number;

  @Column('jsonb')
  certifications: Array<{ name: string; expiryDate: string; status: string }>;

  @Column({ default: 'compliant' })
  complianceStatus: 'compliant' | 'non-compliant' | 'pending';

  @CreateDateColumn()
  lastAuditDate: Date;
}
