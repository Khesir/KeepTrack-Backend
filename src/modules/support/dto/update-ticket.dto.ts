import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsIn(['open', 'in-review', 'resolved'])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNote?: string;
}
