import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavedQueryDocument = SavedQuery & Document;

@Schema({ timestamps: true })
export class SavedQuery {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Practice' })
  practice: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Claim' })
  claim: Types.ObjectId;

  @Prop()
  startYear?: number;

  @Prop()
  endYear?: number;
}

export const SavedQuerySchema = SchemaFactory.createForClass(SavedQuery);