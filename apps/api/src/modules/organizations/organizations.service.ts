import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>
  ) {}

  async create(createOrgDto: Partial<Organization>): Promise<Organization> {
    const existing = await this.organizationsRepository.findOne({
      where: { slug: createOrgDto.slug },
    });

    if (existing) {
      throw new ConflictException('Organization slug already exists');
    }

    const org = this.organizationsRepository.create(createOrgDto);
    return this.organizationsRepository.save(org);
  }

  async findById(id: string): Promise<Organization> {
    const org = await this.organizationsRepository.findOne({
      where: { id },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async findBySlug(slug: string): Promise<Organization> {
    const org = await this.organizationsRepository.findOne({
      where: { slug },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find({
      where: { status: 'active' },
    });
  }

  async update(
    id: string,
    updateOrgDto: Partial<Organization>
  ): Promise<Organization> {
    await this.organizationsRepository.update(id, updateOrgDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const org = await this.findById(id);
    org.status = 'inactive';
    await this.organizationsRepository.save(org);
  }
}
