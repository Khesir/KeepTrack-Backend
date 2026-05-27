import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal, GoalDocument } from '../../schemas/goal.schema';
import { Savings, SavingsDocument } from '../../schemas/savings.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContributeGoalDto } from './dto/contribute-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    @InjectModel(Savings.name) private savingsModel: Model<SavingsDocument>,
  ) {}

  findAll(authId: string, status?: string, budgetProfileId?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (status) filter.status = status;
    if (budgetProfileId !== undefined) {
      filter.budgetProfileId = budgetProfileId ? new Types.ObjectId(budgetProfileId) : null;
    }
    return this.goalModel.find(filter);
  }

  async findOne(id: string, authId: string) {
    const doc = await this.goalModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateGoalDto) {
    const data: any = { ...dto, userId: new Types.ObjectId(authId) };
    if (dto.savingsBucketId) data.savingsBucketId = new Types.ObjectId(dto.savingsBucketId);
    if (dto.budgetProfileId) data.budgetProfileId = new Types.ObjectId(dto.budgetProfileId);
    return this.goalModel.create(data);
  }

  async update(id: string, dto: UpdateGoalDto, authId: string) {
    const data: any = { ...dto };
    if (dto.savingsBucketId) data.savingsBucketId = new Types.ObjectId(dto.savingsBucketId);
    const doc = await this.goalModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      data,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.goalModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async complete(id: string, authId: string) {
    const doc = await this.goalModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'completed', completedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  /**
   * Contribute an amount toward a goal.
   * - Increments goal.currentAmount
   * - Deposits the same amount into the linked savings bucket (if set)
   * - Marks goal as completed if target is reached
   */
  async contribute(id: string, dto: ContributeGoalDto, authId: string) {
    const userId = new Types.ObjectId(authId);
    const goal = await this.goalModel.findOne({ _id: id, userId });
    if (!goal) throw new NotFoundException();

    const newAmount = goal.currentAmount + dto.amount;
    const isCompleted = newAmount >= goal.targetAmount;

    // Deposit into linked savings bucket
    if (goal.savingsBucketId) {
      await this.savingsModel.findOneAndUpdate(
        { _id: goal.savingsBucketId, userId },
        { $inc: { balance: dto.amount } },
      );
    }

    const doc = await this.goalModel.findByIdAndUpdate(
      id,
      {
        currentAmount: newAmount,
        ...(isCompleted ? { status: 'completed', completedAt: new Date() } : {}),
      },
      { new: true },
    );
    return doc;
  }

  /**
   * Withdraw an amount from a goal.
   * - Decrements goal.currentAmount
   * - Withdraws the same amount from the linked savings bucket (if set)
   */
  async withdraw(id: string, amount: number, authId: string) {
    const userId = new Types.ObjectId(authId);
    const goal = await this.goalModel.findOne({ _id: id, userId });
    if (!goal) throw new NotFoundException();
    if (amount > goal.currentAmount) throw new BadRequestException('Amount exceeds current savings');

    const newAmount = goal.currentAmount - amount;

    if (goal.savingsBucketId) {
      const bucket = await this.savingsModel.findOne({ _id: goal.savingsBucketId, userId });
      if (bucket && amount > bucket.balance) throw new BadRequestException('Insufficient savings balance');
      await this.savingsModel.findOneAndUpdate(
        { _id: goal.savingsBucketId, userId },
        { $inc: { balance: -amount } },
      );
    }

    return this.goalModel.findByIdAndUpdate(
      id,
      { currentAmount: newAmount, ...(newAmount < goal.targetAmount && goal.status === 'completed' ? { status: 'active', completedAt: null } : {}) },
      { new: true },
    );
  }
}
