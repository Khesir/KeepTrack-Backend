import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { BackupService } from './backup.service';
import { UpsertBackupDto } from './dto/upsert-backup.dto';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  upsert(@Req() req, @Body() dto: UpsertBackupDto) {
    return this.backupService.upsert(req.user.authId, dto);
  }

  @Get('meta')
  getMeta(@Req() req) {
    return this.backupService.getMeta(req.user.authId);
  }

  @Get()
  get(@Req() req) {
    return this.backupService.get(req.user.authId);
  }
}
