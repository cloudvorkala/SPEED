import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
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

  @Prop({ required: true, unique: true })
  doi: string;

  @Prop({ enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  ratingCount: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  submitter: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  moderator?: Types.ObjectId;

  @Prop()
  moderationDate?: Date;

  @Prop()
  rejectionReason?: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);