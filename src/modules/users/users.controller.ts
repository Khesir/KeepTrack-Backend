import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Public } from '../auth/public.decorator';
import { CrmGuard } from '../../common/guards/crm.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdatePomodoroSettingsDto } from './dto/update-pomodoro-settings.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(CrmGuard)
  @Get('admin/stats')
  getStats() {
    return this.usersService.getStats();
  }

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getMe(req.user.authId);
  }

  @Patch('me')
  updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.authId, dto);
  }

  @Patch('me/notification-settings')
  updateNotificationSettings(
    @Req() req,
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.usersService.updateNotificationSettings(req.user.authId, dto);
  }

  @Patch('me/pomodoro-settings')
  updatePomodoroSettings(@Req() req, @Body() dto: UpdatePomodoroSettingsDto) {
    return this.usersService.updatePomodoroSettings(req.user.authId, dto);
  }

  @Get('me/photo')
  streamPhoto(@Req() req, @Res() res: Response) {
    return this.usersService.streamPhoto(req.user.authId, res);
  }

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadPhoto(req.user.authId, file);
  }

  @Public()
  @Post('internal/subscription')
  updateSubscriptionStatus(
    @Headers('x-internal-secret') secret: string,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    if (secret !== process.env.INTERNAL_SECRET) throw new ForbiddenException();
    return this.usersService.updateSubscriptionStatus(dto.email, dto.status);
  }
}
