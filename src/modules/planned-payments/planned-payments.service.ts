import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlannedPayment, PlannedPaymentDocument } from '../../schemas/planned-payment.schema';
import { Transaction, TransactionDocument } from '../../schemas/transaction.schema';
import { CreatePlannedPaymentDto } from './dto/create-planned-payment.dto';
import { UpdatePlannedPaymentDto } from './dto/update-planned-payment.dto';
import { PayPlannedPaymentDto } from './dto/pay-planned-payment.dto';

function advanceDate(current: Date, frequency: string): Date {
  const d = new Date(current);
  switch (frequency) {
    case 'daily': d.setDate(d.getDate() + 1); break;
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'biweekly': d.setDate(d.getDate() + 14); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
  }
  return d;
}

@Injectable()
export class PlannedPaymentsService {
  constructor(
    @InjectModel(PlannedPayment.name)
    private plannedPaymentModel: Model<PlannedPaymentDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  findAll(authId: string, status?: string, category?: string, upcoming?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (upcoming === 'true') {
      const in7Days = new Date();
      in7Days.setDate(in7Days.getDate() + 7);
      filter.nextPaymentDate = { $lte: in7Days };
    }
    return this.plannedPaymentModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.plannedPaymentModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreatePlannedPaymentDto) {
    return this.plannedPaymentModel.create({
      ...dto,
      userId: new Types.ObjectId(authId),
    });
  }

  async update(id: string, dto: UpdatePlannedPaymentDto, authId: string) {
    const doc = await this.plannedPaymentModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.plannedPaymentModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async pay(id: string, dto: PayPlannedPaymentDto, authId: string) {
    const payment = await this.plannedPaymentModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!payment) throw new NotFoundException();

    const nextDate =
      payment.frequency === 'oneTime'
        ? payment.nextPaymentDate
        : advanceDate(new Date(dto.paidDate), payment.frequency);

    const updates: any = {
      lastPaymentDate: new Date(dto.paidDate),
      nextPaymentDate: nextDate,
    };

    if (payment.remainingInstallments != null) {
      updates.remainingInstallments = Math.max(0, payment.remainingInstallments - 1);
      if (updates.remainingInstallments === 0) updates.status = 'closed';
    }

    if (dto.createTransaction) {
      await this.transactionModel.create({
        userId: new Types.ObjectId(authId),
        amount: payment.amount,
        type: 'expense',
        description: payment.name,
        date: new Date(dto.paidDate),
        notes: dto.transactionNotes ?? null,
        plannedPaymentId: payment._id,
      });
    }

    return this.plannedPaymentModel.findByIdAndUpdate(id, updates, { new: true });
  }

  async pause(id: string, authId: string) {
    const doc = await this.plannedPaymentModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'paused' },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async resume(id: string, authId: string) {
    const doc = await this.plannedPaymentModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'active' },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async cancel(id: string, authId: string) {
    const doc = await this.plannedPaymentModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'cancelled' },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async skip(id: string, authId: string) {
    const payment = await this.plannedPaymentModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!payment) throw new NotFoundException();
    if (payment.frequency === 'oneTime') return payment; // can't skip one-time

    const nextDate = advanceDate(new Date(payment.nextPaymentDate ?? new Date()), payment.frequency);
    const doc = await this.plannedPaymentModel.findByIdAndUpdate(
      id,
      { nextPaymentDate: nextDate },
      { new: true },
    );
    return doc;
  }
}
