import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription, SubscriptionDocument } from '../../schemas/subscription.schema';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

const CYCLE_DAYS: Record<string, number> = {
  weekly: 7,
  monthly: 30,
  quarterly: 91,
  annual: 365,
};

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(authId: string, status?: string, budgetProfileId?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (status) filter.status = status;
    if (budgetProfileId !== undefined) {
      filter.budgetProfileId = budgetProfileId ? new Types.ObjectId(budgetProfileId) : null;
    }
    return this.subscriptionModel.find(filter).sort({ nextBillingDate: 1 });
  }

  async findOne(id: string, authId: string) {
    const doc = await this.subscriptionModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateSubscriptionDto) {
    return this.subscriptionModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
      budgetCategoryId: dto.budgetCategoryId ? new Types.ObjectId(dto.budgetCategoryId) : null,
      budgetProfileId: dto.budgetProfileId ? new Types.ObjectId(dto.budgetProfileId) : null,
    });
  }

  async update(id: string, dto: UpdateSubscriptionDto, authId: string) {
    const update: any = { ...dto };
    if (dto.budgetCategoryId) update.budgetCategoryId = new Types.ObjectId(dto.budgetCategoryId);
    const doc = await this.subscriptionModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      update,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.subscriptionModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async pay(id: string, authId: string, budgetId?: string) {
    const sub = await this.findOne(id, authId);

    const now = new Date();
    const days = CYCLE_DAYS[sub.billingCycle] ?? 30;
    const nextDate = new Date(sub.nextBillingDate);
    nextDate.setDate(nextDate.getDate() + days);

    await this.subscriptionModel.findByIdAndUpdate(id, {
      lastBilledDate: now,
      nextBillingDate: nextDate,
    });

    const tx = await this.transactionModel.create({
      userId: new Types.ObjectId(authId),
      amount: sub.amount,
      type: 'expense',
      description: `${sub.name} subscription`,
      date: now,
      subscriptionId: sub._id,
      financeCategoryId: sub.budgetCategoryId ?? null,
      budgetId: budgetId ? new Types.ObjectId(budgetId) : null,
      accountId: null,
    });

    return { subscription: await this.findOne(id, authId), transaction: tx };
  }
}
