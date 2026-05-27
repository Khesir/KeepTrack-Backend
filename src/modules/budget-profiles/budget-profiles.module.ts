import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetProfilesController } from './budget-profiles.controller';
import { BudgetProfilesService } from './budget-profiles.service';
import { BudgetProfile, BudgetProfileSchema } from '../../schemas/budget-profile.schema';
import { Budget, BudgetSchema } from '../../schemas/budget.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BudgetProfile.name, schema: BudgetProfileSchema },
      { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  controllers: [BudgetProfilesController],
  providers: [BudgetProfilesService],
})
export class BudgetProfilesModule {}
