import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetCategoryDto, UpdateBudgetCategoryDto } from './dto/budget-category.dto';
import { CreateBudgetCategoryFlatDto } from './dto/create-budget-category-flat.dto';
import { Budget, BudgetDocument } from '../../schemas/budget.schema';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  findAll(authId: string, month?: string, status?: string, budgetType?: string, budgetProfileId?: string) {
    const filter: any = { userId: new Types.ObjectId(authId) };
    if (month) filter.month = month;
    if (status) filter.status = status;
    if (budgetType) filter.budgetType = budgetType;
    if (budgetProfileId) filter.budgetProfileId = new Types.ObjectId(budgetProfileId);
    return this.budgetModel.find(filter).populate('categories.financeCategoryId');
  }

  async findOne(id: string, authId: string) {
    const doc = await this.budgetModel
      .findOne({ _id: id, userId: new Types.ObjectId(authId) })
      .populate('categories.financeCategoryId');
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateBudgetDto) {
    const userId = new Types.ObjectId(authId);
    const categories = (dto.categories ?? []).map((c) => ({
      financeCategoryId: new Types.ObjectId(c.financeCategoryId),
      targetAmount: c.targetAmount,
      userId,
    }));
    return this.budgetModel.create({
      ...dto,
      userId,
      budgetProfileId: dto.budgetProfileId ? new Types.ObjectId(dto.budgetProfileId) : null,
      categories,
    });
  }

  async update(id: string, dto: UpdateBudgetDto, authId: string) {
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.budgetModel.deleteOne({ _id: id, userId: new Types.ObjectId(authId) });
    if (result.deletedCount === 0) throw new NotFoundException();
  }

  async addCategory(id: string, dto: BudgetCategoryDto, authId: string) {
    const userId = new Types.ObjectId(authId);
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: id, userId },
      {
        $push: {
          categories: {
            financeCategoryId: new Types.ObjectId(dto.financeCategoryId),
            targetAmount: dto.targetAmount,
            userId,
          },
        },
      },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async updateCategory(
    id: string,
    categoryId: string,
    dto: UpdateBudgetCategoryDto,
    authId: string,
  ) {
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId), 'categories._id': categoryId },
      { $set: { 'categories.$.targetAmount': dto.targetAmount } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async removeCategory(id: string, categoryId: string, authId: string) {
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { $pull: { categories: { _id: new Types.ObjectId(categoryId) } } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  // ── Flat /budget-categories routes ───────────────────────────────────────

  async findCategoriesByBudgetId(budgetId: string, authId: string) {
    const doc = await this.budgetModel.findOne({
      _id: budgetId,
      userId: new Types.ObjectId(authId),
    });
    if (!doc) throw new NotFoundException();
    return doc.categories;
  }

  async createCategoryFlat(dto: CreateBudgetCategoryFlatDto, authId: string) {
    const userId = new Types.ObjectId(authId);
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: dto.budgetId, userId },
      {
        $push: {
          categories: {
            financeCategoryId: new Types.ObjectId(dto.financeCategoryId),
            targetAmount: dto.targetAmount,
            userId,
          },
        },
      },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc.categories[doc.categories.length - 1];
  }

  async updateCategoryByIdFlat(
    categoryId: string,
    dto: UpdateBudgetCategoryDto,
    authId: string,
  ) {
    const doc = await this.budgetModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(authId),
        'categories._id': new Types.ObjectId(categoryId),
      },
      { $set: { 'categories.$.targetAmount': dto.targetAmount } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc.categories.find((c: any) => c._id.toString() === categoryId);
  }

  async removeCategoryByIdFlat(categoryId: string, authId: string) {
    const doc = await this.budgetModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(authId),
        'categories._id': new Types.ObjectId(categoryId),
      },
      { $pull: { categories: { _id: new Types.ObjectId(categoryId) } } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
  }

  async removeCategoriesByBudgetIdFlat(budgetId: string, authId: string) {
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: budgetId, userId: new Types.ObjectId(authId) },
      { $set: { categories: [] } },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
  }

  async close(id: string, authId: string) {
    const doc = await this.budgetModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      { status: 'closed', closedAt: new Date() },
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }
}
