import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EvidenceDocument = Evidence & Document;

@Schema({ timestamps: true })
export class Evidence {
  @Prop({ type: Types.ObjectId, ref: 'Article', required: true })
  article: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Claim', required: true })
  claim: Types.ObjectId;

  @Prop({ enum: ['AGREE', 'DISAGREE', 'NEUTRAL'], required: true })
  result: string;

  @Prop({
    enum: ['CASE_STUDY', 'EXPERIMENT', 'SURVEY', 'LITERATURE_REVIEW', 'OTHER'],
    required: true,
  })
  researchType: string;

  @Prop({ enum: ['STUDENT', 'PRACTITIONER', 'MIXED', 'OTHER'], required: true })
  participantType: string;

  @Prop()
  notes: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  analyst: Types.ObjectId;
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);