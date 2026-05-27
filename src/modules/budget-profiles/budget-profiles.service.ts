import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BudgetProfile, BudgetProfileDocument } from '../../schemas/budget-profile.schema';
import { Budget, BudgetDocument } from '../../schemas/budget.schema';
import { CreateBudgetProfileDto } from './dto/create-budget-profile.dto';
import { UpdateBudgetProfileDto } from './dto/update-budget-profile.dto';

@Injectable()
export class BudgetProfilesService {
  constructor(
    @InjectModel(BudgetProfile.name) private profileModel: Model<BudgetProfileDocument>,
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  findAll(authId: string) {
    return this.profileModel
      .find({ userId: new Types.ObjectId(authId) })
      .sort({ isMain: -1, createdAt: -1 });
  }

  async findOne(id: string, authId: string) {
    const doc = await this.profileModel.findOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateBudgetProfileDto) {
    return this.profileModel.create({ ...dto, userId: new Types.ObjectId(authId) });
  }

  async update(id: string, dto: UpdateBudgetProfileDto, authId: string) {
    const doc = await this.profileModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const userId = new Types.ObjectId(authId);
    const result = await this.profileModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) throw new NotFoundException();
    // Also remove all budget groups belonging to this profile
    await this.budgetModel.deleteMany({ budgetProfileId: new Types.ObjectId(id), userId });
  }

  async setAsMain(id: string, authId: string) {
    const userId = new Types.ObjectId(authId);
    const profile = await this.profileModel.findOne({ _id: id, userId });
    if (!profile) throw new NotFoundException();
    // Clear isMain from all profiles for this user, then set on target
    await this.profileModel.updateMany({ userId }, { $set: { isMain: false } });
    return this.profileModel.findByIdAndUpdate(id, { $set: { isMain: true } }, { new: true });
  }

  /** Return all budget groups linked to a profile */
  getBudgetGroups(profileId: string, authId: string) {
    return this.budgetModel
      .find({ budgetProfileId: new Types.ObjectId(profileId), userId: new Types.ObjectId(authId) })
      .populate('categories.financeCategoryId');
  }
}
