import { IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum ArticleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  READY_FOR_ANALYSIS = 'READY_FOR_ANALYSIS',
  ANALYZED = 'ANALYZED'
}

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsNumber()
  year: number;

  @IsString()
  journal: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsString()
  @IsOptional()
  researchType?: string;

  @IsString()
  @IsOptional()
  participantType?: string;

  @IsString()
  @IsOptional()
  findings?: string;
}