import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ContributeGoalDto {
  @IsNumber() amount: number;
  @IsOptional() @IsNumber() fee?: number;
  @IsOptional() @IsString() notes?: string;
}
