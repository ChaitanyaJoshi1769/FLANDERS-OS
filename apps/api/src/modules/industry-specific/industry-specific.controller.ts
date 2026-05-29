import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { IndustrySpecificService } from './industry-specific.service';

@Controller('industry-specific')
@UseGuards(JwtGuard)
export class IndustrySpecificController {
  constructor(private industrySpecificService: IndustrySpecificService) {}

  @Post('setup')
  async setupConfiguration(@Body() data: any) {
    return this.industrySpecificService.setupIndustryConfiguration(
      data.organizationId,
      data.industry,
      data.configuration,
    );
  }

  @Get(':organizationId/:industry')
  async getConfiguration(
    @Param('organizationId') organizationId: string,
    @Param('industry') industry: string,
  ) {
    return this.industrySpecificService.getConfiguration(organizationId, industry);
  }

  @Put(':organizationId/:industry')
  async updateConfiguration(
    @Param('organizationId') organizationId: string,
    @Param('industry') industry: string,
    @Body() updates: any,
  ) {
    return this.industrySpecificService.updateConfiguration(organizationId, industry, updates);
  }
}
