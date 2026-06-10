import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional() @IsString() financeCategoryId?: string;
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsEnum(['income', 'expense', 'transfer']) type?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() feeDescription?: string;
  @IsOptional() @IsString() budgetId?: string;
  @IsOptional() @IsString() debtId?: string;
  @IsOptional() @IsString() goalId?: string;
  @IsOptional() @IsString() savingsId?: string;
}
