import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetCategoryDto, UpdateBudgetCategoryDto } from './dto/budget-category.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('month') month?: string,
    @Query('status') status?: string,
    @Query('budgetType') budgetType?: string,
    @Query('budgetProfileId') budgetProfileId?: string,
  ) {
    return this.budgetsService.findAll(req.user.authId, month, status, budgetType, budgetProfileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.budgetsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBudgetDto, @Req() req) {
    return this.budgetsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.budgetsService.remove(id, req.user.authId);
  }

  @Post(':id/categories')
  addCategory(@Param('id') id: string, @Body() dto: BudgetCategoryDto, @Req() req) {
    return this.budgetsService.addCategory(id, dto, req.user.authId);
  }

  @Patch(':id/categories/:categoryId')
  updateCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
    @Body() dto: UpdateBudgetCategoryDto,
    @Req() req,
  ) {
    return this.budgetsService.updateCategory(id, categoryId, dto, req.user.authId);
  }

  @Delete(':id/categories/:categoryId')
  removeCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
    @Req() req,
  ) {
    return this.budgetsService.removeCategory(id, categoryId, req.user.authId);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Req() req) {
    return this.budgetsService.close(id, req.user.authId);
  }

  // Spent amounts are calculated client-side from transactions — these are no-ops
  @Post(':id/refresh-spent')
  refreshSpent() {
    return { success: true };
  }

  @Post(':id/recalculate')
  recalculate() {
    return { success: true };
  }

  @Get(':id/debug')
  debugCategories(@Param('id') id: string, @Req() req) {
    return this.budgetsService.findOne(id, req.user.authId);
  }
}
