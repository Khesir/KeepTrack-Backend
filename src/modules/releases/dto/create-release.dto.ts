import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUrl } from 'class-validator';

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
  @IsUrl()
  exeUrl?: string;

  @IsOptional()
  @IsUrl()
  apkUrl?: string;

  @IsOptional()
  @IsUrl()
  dmgUrl?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
