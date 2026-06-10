import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Release, ReleaseDocument } from '../../schemas/release.schema';
import { BlobStorageService } from '../../common/blob-storage/blob-storage.service';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';

@Injectable()
export class ReleasesService {
  constructor(
    @InjectModel(Release.name) private releaseModel: Model<ReleaseDocument>,
    private blobStorage: BlobStorageService,
  ) {}

  async create(dto: CreateReleaseDto): Promise<Release> {
    const doc = new this.releaseModel({
      ...dto,
      publishedAt: dto.published ? new Date() : undefined,
    });
    return doc.save();
  }

  async findAllPublic(): Promise<Release[]> {
    return this.releaseModel
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .lean();
  }

  async findLatestPublic(): Promise<Release> {
    const doc = await this.releaseModel
      .findOne({ published: true })
      .sort({ publishedAt: -1 })
      .lean();
    if (!doc) throw new NotFoundException('No published release found.');
    return doc;
  }

  async findAll(): Promise<Release[]> {
    return this.releaseModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Release> {
    const doc = await this.releaseModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Release not found.');
    return doc;
  }

  async update(id: string, dto: UpdateReleaseDto): Promise<Release> {
    const update: any = { ...dto };
    if (dto.published === true) update.publishedAt = new Date();
    const doc = await this.releaseModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Release not found.');
    return doc;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.releaseModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Release not found.');
  }

  async removeAll(): Promise<{ deleted: number }> {
    const result = await this.releaseModel.deleteMany({});
    return { deleted: result.deletedCount };
  }

  async uploadFile(
    platform: string,
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    return this.blobStorage.upload(`releases/${platform}`, file);
  }

  async updatePlatformField(
    id: string,
    platform: string,
    fields: Record<string, any>,
  ): Promise<Release> {
    const update: Record<string, any> = {};
    for (const [key, value] of Object.entries(fields)) {
      update[`platforms.${platform}.${key}`] = value;
    }
    const doc = await this.releaseModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Release not found.');
    return doc;
  }
}
