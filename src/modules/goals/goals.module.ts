import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { Goal, GoalSchema } from '../../schemas/goal.schema';
import { Savings, SavingsSchema } from '../../schemas/savings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: Savings.name, schema: SavingsSchema },
    ]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
