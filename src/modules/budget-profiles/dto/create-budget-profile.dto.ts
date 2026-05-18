import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateBudgetProfileDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsEnum(['monthly', 'custom']) profileType?: string;
}
