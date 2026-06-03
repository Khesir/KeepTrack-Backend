import { IsEmail, IsIn, IsString } from 'class-validator';

export class UpdateSubscriptionStatusDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['active', 'cancelled'])
  status: 'active' | 'cancelled';
}
