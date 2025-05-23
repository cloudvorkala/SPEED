import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException } from '@nestjs/common';
import { PracticesService } from './practices.service';
import { Practice } from '../../models/practice.model';

@Controller('practices')
export class PracticesController {
  constructor(private readonly practicesService: PracticesService) {}

  @Get()
  async findAll(): Promise<Practice[]> {
    return this.practicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Practice> {
    const practice = await this.practicesService.findOne(id);
    if (!practice) throw new NotFoundException('Practice not found');
    return practice;
  }

  @Post()
  async create(@Body() practice: Partial<Practice>): Promise<Practice> {
    return this.practicesService.create(practice);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() practice: Partial<Practice>,
  ): Promise<Practice> {
    const updated = await this.practicesService.update(id, practice);
    if (!updated) throw new NotFoundException('Practice not found');
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Practice> {
    return this.practicesService.delete(id);
  }
}