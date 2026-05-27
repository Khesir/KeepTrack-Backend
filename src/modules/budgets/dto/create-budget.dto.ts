import {
  IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BudgetCategoryDto {
  @IsString() financeCategoryId: string;
  @IsNumber() targetAmount: number;
}

export class CreateBudgetDto {
  @IsString() month: string;
  @IsString() title: string;
  @IsEnum(['income', 'expense']) budgetType: string;
  @IsEnum(['monthly', 'oneTime', 'profile']) periodType: string;
  @IsOptional() @IsString() accountId?: string;
  @IsOptional() @IsString() budgetProfileId?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsNumber() customTargetAmount?: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetCategoryDto)
  categories?: BudgetCategoryDto[];
}
