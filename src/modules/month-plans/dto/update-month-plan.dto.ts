import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMonthPlanDto {
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() budgetIds?: string[];
}
