import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  findAll(@Req() req, @Query('status') status?: string, @Query('budgetProfileId') budgetProfileId?: string) {
    return this.subscriptionsService.findAll(req.user.authId, status, budgetProfileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.subscriptionsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto, @Req() req) {
    return this.subscriptionsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.subscriptionsService.remove(id, req.user.authId);
  }

  @Post(':id/pay')
  pay(@Param('id') id: string, @Req() req, @Body() body: { budgetId?: string }) {
    return this.subscriptionsService.pay(id, req.user.authId, body.budgetId);
  }
}
