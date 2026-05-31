import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { put, del } from '@vercel/blob';
import { Backup, BackupDocument } from '../../schemas/backup.schema';
import { UpsertBackupDto } from './dto/upsert-backup.dto';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel(Backup.name) private backupModel: Model<BackupDocument>,
  ) {}

  async upsert(authId: string, dto: UpsertBackupDto) {
    const existing = await this.backupModel.findOne({ userId: new Types.ObjectId(authId) });

    const blob = await put(`backups/${authId}.ktbak`, Buffer.from(dto.data, 'utf-8'), {
      access: 'private' as any,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: 'application/octet-stream',
      addRandomSuffix: true,
    });

    if (existing?.blobUrl) {
      await del(existing.blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => {});
    }

    return this.backupModel.findOneAndUpdate(
      { userId: new Types.ObjectId(authId) },
      { userId: new Types.ObjectId(authId), blobUrl: blob.url },
      { upsert: true, new: true },
    );
  }

  async get(authId: string) {
    const doc = await this.backupModel.findOne({ userId: new Types.ObjectId(authId) });
    if (!doc) throw new NotFoundException('No backup found');

    const res = await fetch(doc.blobUrl, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) throw new NotFoundException('Backup file not found');

    return { data: await res.text() };
  }
}
