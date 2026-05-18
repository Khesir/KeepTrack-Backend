import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionPlansController } from './transaction-plans.controller';
import { TransactionPlansService } from './transaction-plans.service';
import { TransactionPlan, TransactionPlanSchema } from '../../schemas/transaction-plan.schema';
import { Transaction, TransactionSchema } from '../../schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionPlan.name, schema: TransactionPlanSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionPlansController],
  providers: [TransactionPlansService],
})
export class TransactionPlansModule {}
