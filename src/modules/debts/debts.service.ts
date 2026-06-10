import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Debt, DebtDocument } from '../../schemas/debt.schema';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { PayDebtDto } from './dto/pay-debt.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debt.name) private debtModel: Model<DebtDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(authId: string, type?: string, status?: string, budgetProfileId?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (budgetProfileId !== undefined) {
      filter.budgetProfileId = budgetProfileId ? new Types.ObjectId(budgetProfileId) : null;
    }
    return this.debtModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.debtModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateDebtDto) {
    return this.debtModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      transactionId: dto.transactionId ? new Types.ObjectId(dto.transactionId) : null,
      budgetProfileId: dto.budgetProfileId ? new Types.ObjectId(dto.budgetProfileId) : null,
    });
  }

  async update(id: string, dto: UpdateDebtDto, authId: string) {
    const doc = await this.debtModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.debtModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async settle(id: string, authId: string) {
    const doc = await this.debtModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'settled', remainingAmount: 0, settledAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async pay(id: string, dto: PayDebtDto, authId: string) {
    const userId = new Types.ObjectId(authId);
    const debt = await this.debtModel.findOne({ _id: id, userId });
    if (!debt) throw new NotFoundException();

    const newRemaining = Math.max(0, debt.remainingAmount - dto.amount);
    const isSettled = newRemaining === 0;

    // Create transaction
    await this.transactionModel.create({
      userId,
      amount: dto.amount,
      type: debt.type === 'lending' ? 'income' : 'expense',
      description: debt.type === 'lending'
        ? `Received from ${debt.personName}`
        : `Paid to ${debt.personName}`,
      date: new Date(),
      notes: dto.notes ?? null,
      fee: dto.fee ?? 0,
      debtId: debt._id,
    });

    const doc = await this.debtModel.findByIdAndUpdate(
      id,
      {
        remainingAmount: newRemaining,
        ...(isSettled ? { status: 'settled', settledAt: new Date() } : {}),
      },
      { new: true },
    );
    return doc;
  }
}
