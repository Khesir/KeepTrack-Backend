import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Backup, BackupSchema } from '../../schemas/backup.schema';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Backup.name, schema: BackupSchema }])],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
