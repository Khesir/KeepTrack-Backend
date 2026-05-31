import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ParseReceiptDto {
  @IsString()
  @IsNotEmpty()
  imageBase64: string;

  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  mimeType: string;
}

export class ParsedTransactionItemDto {
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  categoryName: string;
}
