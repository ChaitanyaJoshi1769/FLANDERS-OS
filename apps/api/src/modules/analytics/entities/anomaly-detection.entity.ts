import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('anomaly_detections')
export class AnomalyDetection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  machineId: string;

  @Column('jsonb')
  detectionResult: any;

  @Column()
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';

  @Column({ nullable: true })
  rootCause: string;

  @CreateDateColumn()
  detectedAt: Date;
}
