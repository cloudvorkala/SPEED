import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { Claim } from '../../models/claim.model';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Get()
  async findAll(@Query('practice') practiceId?: string): Promise<Claim[]> {
    if (practiceId) {
      return this.claimsService.findByPractice(practiceId);
    }
    return this.claimsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Claim> {
    return this.claimsService.findOne(id);
  }

  @Post()
  async create(@Body() claim: Partial<Claim>): Promise<Claim> {
    return this.claimsService.create(claim);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() claim: Partial<Claim>,
  ): Promise<Claim> {
    return this.claimsService.update(id, claim);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Claim> {
    return this.claimsService.delete(id);
  }
}