import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { BudgetProfilesService } from './budget-profiles.service';
import { CreateBudgetProfileDto } from './dto/create-budget-profile.dto';
import { UpdateBudgetProfileDto } from './dto/update-budget-profile.dto';

@Controller('budget-profiles')
export class BudgetProfilesController {
  constructor(private readonly service: BudgetProfilesService) {}

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.authId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateBudgetProfileDto) {
    return this.service.create(req.user.authId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBudgetProfileDto, @Req() req) {
    return this.service.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.service.remove(id, req.user.authId);
  }

  @Patch(':id/set-main')
  setAsMain(@Param('id') id: string, @Req() req) {
    return this.service.setAsMain(id, req.user.authId);
  }

  @Get(':id/groups')
  getBudgetGroups(@Param('id') id: string, @Req() req) {
    return this.service.getBudgetGroups(id, req.user.authId);
  }
}
