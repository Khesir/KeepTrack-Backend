import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CrmGuard } from '../../common/guards/crm.guard';
import { Public } from '../auth/public.decorator';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Public()
  @Get()
  findAll() {
    return this.announcementsService.findAllPublished();
  }

  @UseGuards(CrmGuard)
  @Get('admin')
  findAllAdmin() {
    return this.announcementsService.findAll();
  }

  @UseGuards(CrmGuard)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @UseGuards(CrmGuard)
  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @UseGuards(CrmGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @UseGuards(CrmGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
