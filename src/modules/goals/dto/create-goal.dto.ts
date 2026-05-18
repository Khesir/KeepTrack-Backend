import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() targetAmount: number;
  @IsOptional() @IsNumber() currentAmount?: number;
  @IsOptional() @IsDateString() targetDate?: string;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
  @IsOptional() @IsNumber() monthlyContribution?: number;
  @IsOptional() @IsNumber() managementFeePercent?: number;
  @IsOptional() @IsNumber() withdrawalFeePercent?: number;
  @IsOptional() @IsString() savingsBucketId?: string;
  @IsOptional() @IsString() budgetProfileId?: string;
}
