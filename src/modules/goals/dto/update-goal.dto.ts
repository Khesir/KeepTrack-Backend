import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() targetAmount?: number;
  @IsOptional() @IsNumber() currentAmount?: number;
  @IsOptional() @IsDateString() targetDate?: string;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
  @IsOptional() @IsEnum(['active', 'completed', 'paused']) status?: string;
  @IsOptional() @IsNumber() monthlyContribution?: number;
  @IsOptional() @IsString() savingsBucketId?: string;
}
