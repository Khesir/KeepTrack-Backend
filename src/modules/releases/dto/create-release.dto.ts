import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlatformStatus } from '../../../schemas/release.schema';

export class WindowsPlatformDto {
  @IsEnum(PlatformStatus)
  status: PlatformStatus;

  @IsOptional()
  @IsUrl()
  downloadUrl?: string;
}

export class AndroidPlatformDto {
  @IsEnum(PlatformStatus)
  status: PlatformStatus;

  @IsOptional()
  @IsUrl()
  apkUrl?: string;

  @IsOptional()
  @IsUrl()
  playStoreUrl?: string;
}

export class StorePlatformDto {
  @IsEnum(PlatformStatus)
  status: PlatformStatus;

  @IsOptional()
  @IsUrl()
  storeUrl?: string;
}

export class ReleasePlatformsDto {
  @ValidateNested()
  @Type(() => WindowsPlatformDto)
  windows: WindowsPlatformDto;

  @ValidateNested()
  @Type(() => AndroidPlatformDto)
  android: AndroidPlatformDto;

  @ValidateNested()
  @Type(() => StorePlatformDto)
  macos: StorePlatformDto;

  @ValidateNested()
  @Type(() => StorePlatformDto)
  ios: StorePlatformDto;
}

export class CreateReleaseDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReleasePlatformsDto)
  platforms?: ReleasePlatformsDto;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
