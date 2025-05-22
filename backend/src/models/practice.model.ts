import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PracticeDocument = Practice & Document;

@Schema()
export class Practice {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);