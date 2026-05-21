import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTransactionPlanDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsEnum(['income', 'expense'])
  type?: string;

  @IsOptional()
  @IsDateString()
  plannedDate?: string;

  @IsOptional()
  @IsString()
  financeCategoryId?: string;

  @IsOptional()
  @IsString()
  budgetId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
