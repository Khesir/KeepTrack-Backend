import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Savings, SavingsSchema } from '../../schemas/savings.schema';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Savings.name, schema: SavingsSchema }])],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [SavingsService],
})
export class SavingsModule {}
