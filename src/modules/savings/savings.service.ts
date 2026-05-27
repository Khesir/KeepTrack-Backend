import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Savings, SavingsDocument } from '../../schemas/savings.schema';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

@Injectable()
export class SavingsService {
  constructor(
    @InjectModel(Savings.name) private savingsModel: Model<SavingsDocument>,
  ) {}

  findAll(authId: string) {
    return this.savingsModel.find({ userId: new Types.ObjectId(authId) });
  }

  async findOne(id: string, authId: string) {
    const doc = await this.savingsModel.findOne({
      _id: id,
      userId: new Types.ObjectId(authId),
    });
    if (!doc) throw new NotFoundException();
    return doc;
  }

  create(authId: string, dto: CreateSavingsDto) {
    return this.savingsModel.create({ ...dto, userId: new Types.ObjectId(authId) });
  }

  async update(id: string, dto: UpdateSavingsDto, authId: string) {
    const doc = await this.savingsModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(authId) },
      dto,
      { new: true },
    );
    if (!doc) throw new NotFoundException();
    return doc;
  }

  async remove(id: string, authId: string) {
    const result = await this.savingsModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(authId),
    });
    if (result.deletedCount === 0) throw new NotFoundException();
  }
}
