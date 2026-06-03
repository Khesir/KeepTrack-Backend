import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReleaseDocument = Release & Document;

export enum PlatformStatus {
  AVAILABLE = 'available',
  COMING_SOON = 'coming_soon',
  NOT_AVAILABLE = 'not_available',
}

export class WindowsPlatform {
  status: PlatformStatus;
  downloadUrl?: string;
}

export class AndroidPlatform {
  status: PlatformStatus;
  apkUrl?: string;
  playStoreUrl?: string;
}

export class StorePlatform {
  status: PlatformStatus;
  storeUrl?: string;
}

export class ReleasePlatforms {
  windows: WindowsPlatform;
  android: AndroidPlatform;
  macos: StorePlatform;
  ios: StorePlatform;
}

const defaultPlatforms = (): ReleasePlatforms => ({
  windows: { status: PlatformStatus.COMING_SOON },
  android: { status: PlatformStatus.COMING_SOON },
  macos: { status: PlatformStatus.COMING_SOON },
  ios: { status: PlatformStatus.COMING_SOON },
});

@Schema({ timestamps: true, collection: 'releases' })
export class Release {
  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Object, default: defaultPlatforms })
  platforms: ReleasePlatforms;

  @Prop({ default: false })
  published: boolean;

  @Prop()
  publishedAt?: Date;
}

export const ReleaseSchema = SchemaFactory.createForClass(Release);

ReleaseSchema.index({ publishedAt: -1 });

ReleaseSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
