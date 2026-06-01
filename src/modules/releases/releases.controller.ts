import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ReleasesService } from './releases.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { CrmGuard } from '../../common/guards/crm.guard';
import { Public } from '../auth/public.decorator';

@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Public()
  @Get()
  findAllPublic() {
    return this.releasesService.findAllPublic();
  }

  @Public()
  @Get('latest')
  findLatest() {
    return this.releasesService.findLatestPublic();
  }

  @UseGuards(CrmGuard)
  @Get('admin')
  findAll() {
    return this.releasesService.findAll();
  }

  @UseGuards(CrmGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('platform') platform: string,
  ) {
    return this.releasesService.uploadFile(platform, file);
  }

  @UseGuards(CrmGuard)
  @Delete('all')
  removeAll() {
    return this.releasesService.removeAll();
  }

  @UseGuards(CrmGuard)
  @Patch(':id/platforms/:platform')
  updatePlatform(
    @Param('id') id: string,
    @Param('platform') platform: string,
    @Body() fields: Record<string, any>,
  ) {
    return this.releasesService.updatePlatformField(id, platform, fields);
  }

  @UseGuards(CrmGuard)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.releasesService.findOne(id);
  }

  @UseGuards(CrmGuard)
  @Post()
  create(@Body() dto: CreateReleaseDto) {
    return this.releasesService.create(dto);
  }

  @UseGuards(CrmGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReleaseDto) {
    return this.releasesService.update(id, dto);
  }

  @UseGuards(CrmGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releasesService.remove(id);
  }
}
