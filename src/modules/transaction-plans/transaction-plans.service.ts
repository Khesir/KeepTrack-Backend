import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TransactionPlan, TransactionPlanDocument } from '../../schemas/transaction-plan.schema';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { CreateTransactionPlanDto } from './dto/create-transaction-plan.dto';
import { UpdateTransactionPlanDto } from './dto/update-transaction-plan.dto';

@Injectable()
export class TransactionPlansService {
  constructor(
    @InjectModel(TransactionPlan.name)
    private planModel: Model<TransactionPlanDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(authId: string, status?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (status) filter.status = status;
    return this.planModel.find(filter).sort({ plannedDate: 1 });
  }

  async findOne(id: string, authId: string) {
    const doc = await this.planModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateTransactionPlanDto) {
    return this.planModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      plannedDate: new Date(dto.plannedDate),
      financeCategoryId: dto.financeCategoryId ? new Types.ObjectId(dto.financeCategoryId) : null,
      budgetId: dto.budgetId ? new Types.ObjectId(dto.budgetId) : null,
      status: 'pending',
      completedTransactionId: null,
      completedAt: null,
    });
  }

  async update(id: string, dto: UpdateTransactionPlanDto, authId: string) {
    const update: any = { ...dto };
    if (dto.plannedDate) update.plannedDate = new Date(dto.plannedDate);
    if (dto.financeCategoryId) update.financeCategoryId = new Types.ObjectId(dto.financeCategoryId);
    if (dto.budgetId) update.budgetId = new Types.ObjectId(dto.budgetId);

    const doc = await this.planModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      update,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.planModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async cancel(id: string, authId: string) {
    const doc = await this.planModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'cancelled' },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async complete(id: string, authId: string, amount?: number, date?: string) {
    const plan = await this.planModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!plan) throw new NotFoundException();

    const tx = await this.transactionModel.create({
      userId: new Types.ObjectId(authId),
      amount: amount ?? plan.amount,
      type: plan.type,
      description: plan.description,
      date: date ? new Date(date) : new Date(),
      financeCategoryId: plan.financeCategoryId,
      budgetId: plan.budgetId,
      notes: plan.notes,
    });

    const updated = await this.planModel.findByIdAndUpdate(
      id,
      { status: 'completed', completedTransactionId: tx._id, completedAt: new Date() },
      { new: true },
    );

    return { plan: updated, transaction: tx };
  }
}
