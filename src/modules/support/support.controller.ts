import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { CrmGuard } from '../../common/guards/crm.guard';
import { Public } from '../auth/public.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed.'), false);
      }
      cb(null, true);
    },
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.supportService.uploadImage(file);
  }

  @Public()
  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.supportService.create(dto);
  }

  @UseGuards(CrmGuard)
  @Get()
  findAll(@Query('status') status?: string) {
    return this.supportService.findAll(status);
  }

  @UseGuards(CrmGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(id);
  }

  @UseGuards(CrmGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.supportService.update(id, dto);
  }

  @UseGuards(CrmGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportService.remove(id);
  }
}
