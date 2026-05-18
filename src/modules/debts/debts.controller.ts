import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PayDebtDto } from './dto/pay-debt.dto';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Get()
  findAll(@Req() req, @Query('type') type?: string, @Query('status') status?: string, @Query('budgetProfileId') budgetProfileId?: string) {
    return this.debtsService.findAll(req.user.authId, type, status, budgetProfileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.debtsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateDebtDto) {
    return this.debtsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDebtDto, @Req() req) {
    return this.debtsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.debtsService.remove(id, req.user.authId);
  }

  @Post(':id/settle')
  settle(@Param('id') id: string, @Req() req) {
    return this.debtsService.settle(id, req.user.authId);
  }

  @Post(':id/pay')
  pay(@Param('id') id: string, @Body() dto: PayDebtDto, @Req() req) {
    return this.debtsService.pay(id, dto, req.user.authId);
  }
}
