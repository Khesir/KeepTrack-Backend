import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AnnouncementType } from '../../../schemas/announcement.schema';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(AnnouncementType)
  type?: AnnouncementType;

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
