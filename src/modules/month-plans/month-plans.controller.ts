import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { MonthPlansService } from './month-plans.service';
import { CreateMonthPlanDto } from './dto/create-month-plan.dto';
import { UpdateMonthPlanDto } from './dto/update-month-plan.dto';

@Controller('month-plans')
export class MonthPlansController {
  constructor(private readonly monthPlansService: MonthPlansService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('month') month?: string,
    @Query('budgetProfileId') budgetProfileId?: string,
  ) {
    return this.monthPlansService.findAll(req.user.authId, month, budgetProfileId);
  }

  @Post('profile/:profileId/get-or-create')
  getOrCreateForProfile(@Param('profileId') profileId: string, @Req() req) {
    return this.monthPlansService.getOrCreateForProfile(profileId, req.user.authId);
  }

  @Get('by-month/:month')
  findByMonth(@Param('month') month: string, @Req() req) {
    return this.monthPlansService.findByMonth(month, req.user.authId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.monthPlansService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateMonthPlanDto) {
    return this.monthPlansService.create(req.user.authId, dto);
  }

  @Post('copy')
  copy(
    @Req() req,
    @Body('sourceMonth') sourceMonth: string,
    @Body('targetMonth') targetMonth: string,
  ) {
    return this.monthPlansService.copy(sourceMonth, targetMonth, req.user.authId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMonthPlanDto, @Req() req) {
    return this.monthPlansService.update(id, dto, req.user.authId);
  }

  @Post(':id/budgets')
  addBudget(@Param('id') id: string, @Body('budgetId') budgetId: string, @Req() req) {
    return this.monthPlansService.addBudget(id, budgetId, req.user.authId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req,
    @Query('includeBudgets') includeBudgets?: string,
  ) {
    return this.monthPlansService.remove(id, req.user.authId, includeBudgets === 'true');
  }
}
