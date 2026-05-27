import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { TransactionPlansService } from './transaction-plans.service';
import { CreateTransactionPlanDto } from './dto/create-transaction-plan.dto';
import { UpdateTransactionPlanDto } from './dto/update-transaction-plan.dto';

@Controller('transaction-plans')
export class TransactionPlansController {
  constructor(private readonly service: TransactionPlansService) {}

  @Get()
  findAll(@Req() req, @Query('status') status?: string) {
    return this.service.findAll(req.user.authId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateTransactionPlanDto) {
    return this.service.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionPlanDto, @Req() req) {
    return this.service.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.service.remove(id, req.user.authId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Req() req) {
    return this.service.cancel(id, req.user.authId);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { amount?: number; date?: string },
  ) {
    return this.service.complete(id, req.user.authId, body.amount, body.date);
  }
}
