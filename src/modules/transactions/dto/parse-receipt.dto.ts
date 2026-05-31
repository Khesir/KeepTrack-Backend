import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ParseReceiptDto {
  @IsString()
  @IsNotEmpty()
  imageBase64: string;

  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  mimeType: string;
}

export class ParseTextDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class ParsedTransactionItemDto {
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  categoryName: string;
  entityType: 'subscription' | 'debt_payment' | 'lending' | 'goal' | null;
  entityHint: string | null;
  walletHint: string | null;
}
