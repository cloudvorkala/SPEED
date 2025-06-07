import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AnalysisDataDto {
  @IsString()
  @IsNotEmpty()
  researchType: string;

  @IsString()
  @IsNotEmpty()
  participantType: string;

  @IsString()
  @IsNotEmpty()
  methodology: string;

  @IsString()
  @IsNotEmpty()
  findings: string;

  @IsString()
  @IsOptional()
  limitations?: string;

  @IsString()
  @IsOptional()
  recommendations?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}