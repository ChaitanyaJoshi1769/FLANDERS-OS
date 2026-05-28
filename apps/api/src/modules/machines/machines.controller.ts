import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Machine } from './machine.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('machines')
export class MachinesController {
  constructor(private machinesService: MachinesService) {}

  @Post()
  async create(@Body() createMachineDto: Partial<Machine>) {
    return this.machinesService.create(createMachineDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.machinesService.findById(id);
  }

  @Get('serial/:serialNumber')
  async findBySerial(@Param('serialNumber') serialNumber: string) {
    return this.machinesService.findBySerialNumber(serialNumber);
  }

  @Get('fleet/:fleetId')
  async findByFleet(@Param('fleetId') fleetId: string) {
    return this.machinesService.findByFleet(fleetId);
  }

  @Get('site/:siteId')
  async findBySite(@Param('siteId') siteId: string) {
    return this.machinesService.findBySite(siteId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMachineDto: Partial<Machine>) {
    return this.machinesService.update(id, updateMachineDto);
  }

  @Patch(':id/location')
  async updateLocation(
    @Param('id') id: string,
    @Body() dto: { lat: number; lon: number; heading?: number }
  ) {
    return this.machinesService.updateLocation(id, dto.lat, dto.lon, dto.heading);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: { status: Machine['status'] }
  ) {
    return this.machinesService.updateStatus(id, dto.status);
  }
}
