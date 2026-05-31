import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SavingsModule } from './modules/savings/savings.module';
import { BucketsModule } from './modules/buckets/buckets.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { FinanceCategoriesModule } from './modules/finance-categories/finance-categories.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { BudgetProfilesModule } from './modules/budget-profiles/budget-profiles.module';
import { MonthPlansModule } from './modules/month-plans/month-plans.module';
import { DebtsModule } from './modules/debts/debts.module';
import { GoalsModule } from './modules/goals/goals.module';
import { PlannedPaymentsModule } from './modules/planned-payments/planned-payments.module';
import { TransactionPlansModule } from './modules/transaction-plans/transaction-plans.module';
import { BackupModule } from './modules/backup/backup.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';

let cachedConnection: any = null;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
        autoIndex: false,
        connectionFactory: (connection) => {
          if (cachedConnection) return cachedConnection;
          cachedConnection = connection;
          return connection;
        },
      }),
    }),
    AuthModule,
    UsersModule,
    SavingsModule,
    BucketsModule,
    SubscriptionsModule,
    TransactionsModule,
    FinanceCategoriesModule,
    BudgetsModule,
    BudgetProfilesModule,
    MonthPlansModule,
    DebtsModule,
    GoalsModule,
    PlannedPaymentsModule,
    TransactionPlansModule,
    BackupModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
