import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional() @IsString() savingsId?: string;
  @IsOptional() @IsString() financeCategoryId?: string;
  @IsNumber() amount: number;
  @IsEnum(['income', 'expense', 'transfer']) type: string;
  @IsOptional() @IsString() description?: string;
  @IsDateString() date: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() feeDescription?: string;
  @IsOptional() @IsString() budgetId?: string;
  @IsOptional() @IsString() debtId?: string;
  @IsOptional() @IsString() goalId?: string;
  @IsOptional() @IsString() plannedPaymentId?: string;
  @IsOptional() @IsString() refundedTransactionId?: string;
}
