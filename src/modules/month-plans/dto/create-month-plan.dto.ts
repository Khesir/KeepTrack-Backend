import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMonthPlanDto {
  @IsOptional() @IsString() month?: string;
  @IsOptional() @IsString() budgetProfileId?: string;
  @IsOptional() @IsString() accountId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() budgetIds?: string[];
}
