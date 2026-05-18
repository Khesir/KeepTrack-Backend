import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() provider?: string;
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsEnum(['weekly', 'monthly', 'quarterly', 'annual']) billingCycle?: string;
  @IsOptional() @IsEnum(['active', 'paused', 'cancelled']) status?: string;
  @IsOptional() @IsDateString() nextBillingDate?: string;
  @IsOptional() @IsString() budgetCategoryId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
}
