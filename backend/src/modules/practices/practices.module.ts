import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Practice, PracticeSchema } from '../../models/practice.model';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }]),
  ],
  controllers: [PracticesController],
  providers: [PracticesService],
  exports: [PracticesService],
})
export class PracticesModule {}