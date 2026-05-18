import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PayDebtDto {
  @IsOptional() @IsString() accountId?: string;
  @IsNumber() amount: number;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() notes?: string;
}
