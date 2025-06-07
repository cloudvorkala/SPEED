import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: [String] })
  authors: string[];

  @Prop({ required: true })
  journal: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  volume?: string;

  @Prop()
  number?: string;

  @Prop()
  pages?: string;

  @Prop()
  doi?: string;

  @Prop({ required: true, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @Prop({ type: Types.ObjectId, ref: 'User' })
  moderatedBy?: Types.ObjectId;

  @Prop()
  moderatedAt?: Date;

  @Prop({ default: false })
  isPeerReviewed: boolean;

  @Prop({ default: false })
  isRelevantToSE: boolean;

  @Prop({ default: false })
  isDuplicateChecked: boolean;

  @Prop()
  duplicateCheckResult?: string;

  @Prop()
  rejectionCheckResult?: string;

  @Prop()
  rejectionReason?: string;

  @Prop()
  rating?: number;

  _id: Types.ObjectId;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);