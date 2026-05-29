import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mining_ore_extraction')
export class OreExtraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  mineId: string;

  @Column('float')
  oreExtracted: number;

  @Column('float')
  oreGrade: number;

  @Column()
  extractionMethod: string;

  @Column('jsonb')
  qualityAssay: any;

  @Column('float')
  extractionRate: number;

  @Column('jsonb')
  equipmentUsed: Array<{ equipmentId: string; hours: number; efficiency: number }>;

  @Column('float')
  costPerTon: number;

  @CreateDateColumn()
  recordedAt: Date;
}
