import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ArticleStatus } from '../modules/articles/dto/create-article.dto';

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

  @Prop({ type: String, enum: ArticleStatus, default: ArticleStatus.PENDING })
  status: ArticleStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  moderatedBy?: Types.ObjectId;

  @Prop()
  moderatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  analyzedBy?: Types.ObjectId;

  @Prop()
  analyzedAt?: Date;

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

  @Prop({ type: Object })
  analysisResult?: {
    researchType: string;
    participantType: string;
    methodology: string;
    findings: string;
    limitations: string;
    recommendations: string;
    notes: string;
  };

  @Prop()
  researchType?: string;

  @Prop()
  participantType?: string;

  @Prop()
  findings?: string;

  _id: Types.ObjectId;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);