import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(
    authId: string,
    query: {
      savingsId?: string;
      type?: string;
      dateFrom?: string;
      dateTo?: string;
      startDate?: string;  // alias for dateFrom
      endDate?: string;    // alias for dateTo
      budgetId?: string;
      debtId?: string;
      goalId?: string;
      plannedPaymentId?: string;
      financeCategoryId?: string;
      page?: string;
      limit?: string;
    },
  ) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (query.savingsId) filter.savingsId = new Types.ObjectId(query.savingsId);
    if (query.type) filter.type = query.type;
    if (query.budgetId) filter.budgetId = new Types.ObjectId(query.budgetId);
    if (query.debtId) filter.debtId = new Types.ObjectId(query.debtId);
    if (query.goalId) filter.goalId = new Types.ObjectId(query.goalId);
    if (query.plannedPaymentId)
      filter.plannedPaymentId = new Types.ObjectId(query.plannedPaymentId);
    if (query.financeCategoryId)
      filter.financeCategoryId = new Types.ObjectId(query.financeCategoryId);

    const from = query.dateFrom ?? query.startDate;
    const to = query.dateTo ?? query.endDate;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '100');
    const skip = (page - 1) * limit;

    return this.transactionModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit);
  }

  async getSummary(
    authId: string,
    type: string,
    startDate?: string,
    endDate?: string,
  ) {
    const filter: any = { userId: new Types.ObjectId(authId), type };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const result = await this.transactionModel.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return { total: result[0]?.total ?? 0, type };
  }

  async findOne(id: string, authId: string) {
    const doc = await this.transactionModel.findOne({
      _id: id,
      userId: new Types.ObjectId(authId),
    });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  private toObjectId(val?: string) {
    return val ? new Types.ObjectId(val) : null;
  }

  create(authId: string, dto: CreateTransactionDto) {
    return this.transactionModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      savingsId: this.toObjectId(dto.savingsId),
      financeCategoryId: this.toObjectId(dto.financeCategoryId),
      budgetId: this.toObjectId(dto.budgetId),
      debtId: this.toObjectId(dto.debtId),
      goalId: this.toObjectId(dto.goalId),
      plannedPaymentId: this.toObjectId(dto.plannedPaymentId),
      refundedTransactionId: this.toObjectId(dto.refundedTransactionId),
    });
  }

  async update(id: string, dto: UpdateTransactionDto, authId: string) {
    const doc = await this.transactionModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.transactionModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(authId),
    });
    if (result.deletedCount === 0) throw new NotFoundException();
  }
}
