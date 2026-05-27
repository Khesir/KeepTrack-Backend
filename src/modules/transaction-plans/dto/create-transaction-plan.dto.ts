import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionPlanDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsEnum(['income', 'expense'])
  type: string;

  @IsDateString()
  plannedDate: string;

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
