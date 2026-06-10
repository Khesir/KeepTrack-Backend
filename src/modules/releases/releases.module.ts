import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Release, ReleaseSchema } from '../../schemas/release.schema';
import { BlobStorageModule } from '../../common/blob-storage/blob-storage.module';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Release.name, schema: ReleaseSchema }]),
    BlobStorageModule,
  ],
  controllers: [ReleasesController],
  providers: [ReleasesService],
})
export class ReleasesModule {}
