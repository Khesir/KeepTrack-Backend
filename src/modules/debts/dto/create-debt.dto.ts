import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDebtDto {
  @IsEnum(['lending', 'borrowing']) type: string;
  @IsString() personName: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() originalAmount: number;
  @IsNumber() remainingAmount: number;
  @IsDateString() startDate: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsString() transactionId?: string;
  @IsOptional() @IsNumber() monthlyPaymentAmount?: number;
  @IsOptional() @IsNumber() feeAmount?: number;
  @IsOptional()
  @IsEnum(['weekly', 'biweekly', 'monthly', 'quarterly'])
  paymentFrequency?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() budgetProfileId?: string;
}
