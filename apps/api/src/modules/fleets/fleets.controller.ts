import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FleetsService } from './fleets.service';
import { Fleet } from './fleet.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('fleets')
export class FleetsController {
  constructor(private fleetsService: FleetsService) {}

  @Post()
  async create(@Body() createFleetDto: Partial<Fleet>) {
    return this.fleetsService.create(createFleetDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fleetsService.findById(id);
  }

  @Get(':id/health')
  async getFleetHealth(@Param('id') id: string) {
    return this.fleetsService.getFleetHealth(id);
  }

  @Get('site/:siteId')
  async findBySite(@Param('siteId') siteId: string) {
    return this.fleetsService.findBySite(siteId);
  }

  @Get('organization/:organizationId')
  async findByOrganization(@Param('organizationId') organizationId: string) {
    return this.fleetsService.findByOrganization(organizationId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFleetDto: Partial<Fleet>) {
    return this.fleetsService.update(id, updateFleetDto);
  }
}
