import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ReleasesService } from './releases.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { AdminSecretGuard } from '../../common/guards/admin-secret.guard';
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

  @UseGuards(AdminSecretGuard)
  @Get('admin')
  findAll() {
    return this.releasesService.findAll();
  }

  @UseGuards(AdminSecretGuard)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.releasesService.findOne(id);
  }

  @UseGuards(AdminSecretGuard)
  @Post()
  create(@Body() dto: CreateReleaseDto) {
    return this.releasesService.create(dto);
  }

  @UseGuards(AdminSecretGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReleaseDto) {
    return this.releasesService.update(id, dto);
  }

  @UseGuards(AdminSecretGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releasesService.remove(id);
  }
}
