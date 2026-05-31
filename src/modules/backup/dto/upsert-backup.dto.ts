import { IsString, IsNotEmpty } from 'class-validator';

export class UpsertBackupDto {
  @IsString()
  @IsNotEmpty()
  data: string;
}
