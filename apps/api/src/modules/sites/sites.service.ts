import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './site.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>
  ) {}

  async create(createSiteDto: Partial<Site>): Promise<Site> {
    const site = this.sitesRepository.create(createSiteDto);
    return this.sitesRepository.save(site);
  }

  async findById(id: string): Promise<Site> {
    const site = await this.sitesRepository.findOne({ where: { id } });
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  async findByOrganization(organizationId: string): Promise<Site[]> {
    return this.sitesRepository.find({ where: { organizationId } });
  }

  async update(id: string, updateDto: Partial<Site>): Promise<Site> {
    await this.sitesRepository.update(id, updateDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.sitesRepository.delete(id);
  }
}
