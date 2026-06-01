import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from '../../schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    const doc = new this.announcementModel({
      ...dto,
      publishedAt: dto.published ? new Date() : undefined,
    });
    return doc.save();
  }

  async findAllPublished(): Promise<Announcement[]> {
    return this.announcementModel
      .find({ published: true })
      .sort({ publishedAt: -1 })
      .lean();
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<Announcement> {
    const doc = await this.announcementModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Announcement not found.');
    return doc;
  }

  async update(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    const update: any = { ...dto };
    if (dto.published === true) update.publishedAt = new Date();
    const doc = await this.announcementModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Announcement not found.');
    return doc;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.announcementModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Announcement not found.');
  }
}
