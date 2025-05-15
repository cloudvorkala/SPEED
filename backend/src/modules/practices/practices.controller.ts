import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
    return this.practicesService.findOne(id);
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
    return this.practicesService.update(id, practice);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Practice> {
    return this.practicesService.delete(id);
  }
}