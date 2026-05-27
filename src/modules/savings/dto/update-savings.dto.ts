import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSavingsDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() balance?: number;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
}
