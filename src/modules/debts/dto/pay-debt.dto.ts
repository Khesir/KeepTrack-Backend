import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PayDebtDto {
  @IsNumber() amount: number;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() notes?: string;
}
