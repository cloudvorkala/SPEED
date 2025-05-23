import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Practice, PracticeSchema } from '../../models/practice.model';
import { Claim, ClaimSchema } from '../../models/claim.model';
import { Evidence, EvidenceSchema } from '../../models/evidence.model';
import { PracticesController } from './practices.controller';
import { PracticesService } from './practices.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Practice.name, schema: PracticeSchema },
      { name: Claim.name, schema: ClaimSchema },
      { name: Evidence.name, schema: EvidenceSchema },
    ]),
  ],
  controllers: [PracticesController],
  providers: [PracticesService],
  exports: [PracticesService],
})
export class PracticesModule {}