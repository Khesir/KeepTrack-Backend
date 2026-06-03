import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Release, ReleaseSchema } from '../../schemas/release.schema';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Release.name, schema: ReleaseSchema }])],
  controllers: [ReleasesController],
  providers: [ReleasesService],
})
export class ReleasesModule {}
