import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString() name: string;
  @IsOptional() @IsString() provider?: string;
  @IsNumber() amount: number;
  @IsEnum(['weekly', 'monthly', 'quarterly', 'annual']) billingCycle: string;
  @IsDateString() nextBillingDate: string;
  @IsOptional() @IsString() budgetCategoryId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
  @IsOptional() @IsString() budgetProfileId?: string;
}
