import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { Site } from './site.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sites')
export class SitesController {
  constructor(private sitesService: SitesService) {}

  @Post()
  async create(@Body() createSiteDto: Partial<Site>) {
    return this.sitesService.create(createSiteDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sitesService.findById(id);
  }

  @Get('organization/:organizationId')
  async findByOrganization(@Param('organizationId') organizationId: string) {
    return this.sitesService.findByOrganization(organizationId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<Site>) {
    return this.sitesService.update(id, updateDto);
  }
}
