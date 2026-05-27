import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get()
  findAll(@Req() req) {
    return this.savingsService.findAll(req.user.authId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.savingsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateSavingsDto) {
    return this.savingsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSavingsDto, @Req() req) {
    return this.savingsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.savingsService.remove(id, req.user.authId);
  }
}
