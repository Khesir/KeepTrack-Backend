import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Backup, BackupDocument } from '../../schemas/backup.schema';
import { UpsertBackupDto } from './dto/upsert-backup.dto';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel(Backup.name) private backupModel: Model<BackupDocument>,
  ) {}

  async upsert(authId: string, dto: UpsertBackupDto) {
    return this.backupModel.findOneAndUpdate(
      { userId: new Types.ObjectId(authId) },
      { userId: new Types.ObjectId(authId), data: dto.data },
      { upsert: true, new: true },
    );
  }

  async getMeta(authId: string) {
    const doc = await this.backupModel.findOne(
      { userId: new Types.ObjectId(authId) },
      { updatedAt: 1 },
    );
    if (!doc) return { lastSyncedAt: null };
    return { lastSyncedAt: (doc as any).updatedAt ?? null };
  }

  async get(authId: string) {
    const doc = await this.backupModel.findOne({ userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException('No backup found');
    return { data: doc.data };
  }
}
