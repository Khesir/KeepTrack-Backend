import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ReceiptParserService } from './receipt-parser.service';
import { Transaction, TransactionSchema } from '../../schemas/transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  controllers: [TransactionsController],
  providers: [TransactionsService, ReceiptParserService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
