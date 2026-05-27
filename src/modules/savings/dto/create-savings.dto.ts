import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSavingsDto {
  @IsString() name: string;
  @IsNumber() balance: number;
  @IsOptional() @IsString() colorHex?: string;
  @IsOptional() @IsNumber() iconCodePoint?: number;
}
