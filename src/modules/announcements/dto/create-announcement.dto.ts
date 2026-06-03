import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AnnouncementType } from '../../../schemas/announcement.schema';

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEnum(AnnouncementType)
  type: AnnouncementType;

  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
