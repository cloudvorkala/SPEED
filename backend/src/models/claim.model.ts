import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClaimDocument = Claim & Document;

@Schema()
export class Claim {
  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Practice', required: true })
  practice: Types.ObjectId;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);