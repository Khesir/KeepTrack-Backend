import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AdminSecretGuard } from '../../common/guards/admin-secret.guard';
import { Public } from '../auth/public.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.supportService.create(dto);
  }

  @UseGuards(AdminSecretGuard)
  @Get()
  findAll(@Query('status') status?: string) {
    return this.supportService.findAll(status);
  }

  @UseGuards(AdminSecretGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportService.findOne(id);
  }

  @UseGuards(AdminSecretGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.supportService.update(id, dto);
  }

  @UseGuards(AdminSecretGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportService.remove(id);
  }
}
