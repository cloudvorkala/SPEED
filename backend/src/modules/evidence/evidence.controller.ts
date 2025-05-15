import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { Evidence } from '../../models/evidence.model';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get()
  async find(
    @Query('article') articleId?: string,
    @Query('claim') claimId?: string,
    @Query('practice') practiceId?: string,
  ): Promise<Evidence[]> {
    if (articleId) {
      return this.evidenceService.findByArticle(articleId);
    } else if (claimId) {
      return this.evidenceService.findByClaim(claimId);
    } else if (practiceId) {
      return this.evidenceService.findByPracticeAndClaim(practiceId, claimId);
    }
    return this.evidenceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Evidence> {
    return this.evidenceService.findOne(id);
  }

  @Post()
  async create(@Body() evidence: Partial<Evidence>): Promise<Evidence> {
    return this.evidenceService.create(evidence);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() evidence: Partial<Evidence>,
  ): Promise<Evidence> {
    return this.evidenceService.update(id, evidence);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Evidence> {
    return this.evidenceService.delete(id);
  }
}