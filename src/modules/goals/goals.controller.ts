import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContributeGoalDto } from './dto/contribute-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  findAll(@Req() req, @Query('status') status?: string, @Query('budgetProfileId') budgetProfileId?: string) {
    return this.goalsService.findAll(req.user.authId, status, budgetProfileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.goalsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGoalDto, @Req() req) {
    return this.goalsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.goalsService.remove(id, req.user.authId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Req() req) {
    return this.goalsService.complete(id, req.user.authId);
  }

  @Post(':id/contribute')
  contribute(@Param('id') id: string, @Body() dto: ContributeGoalDto, @Req() req) {
    return this.goalsService.contribute(id, dto, req.user.authId);
  }

  @Post(':id/withdraw')
  withdraw(@Param('id') id: string, @Body('amount') amount: number, @Req() req) {
    return this.goalsService.withdraw(id, amount, req.user.authId);
  }
}
