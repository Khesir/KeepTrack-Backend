import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlannedPaymentDto {
  @IsString() name: string;
  @IsOptional() @IsString() payee?: string;
  @IsNumber() amount: number;
  @IsEnum(['bills', 'subscriptions', 'insurance', 'loan', 'rent', 'utilities', 'other'])
  category: string;
  @IsEnum(['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'oneTime'])
  frequency: string;
  @IsDateString() nextPaymentDate: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() totalInstallments?: number;
  @IsOptional() @IsNumber() remainingInstallments?: number;
  @IsOptional() @IsDateString() endDate?: string;
}
