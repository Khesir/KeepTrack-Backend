import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

export enum AnnouncementType {
  INFO = 'info',
  WARNING = 'warning',
  RELEASE = 'release',
  UPDATE = 'update',
}

@Schema({ timestamps: true, collection: 'announcements' })
export class Announcement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, enum: AnnouncementType, default: AnnouncementType.INFO })
  type: AnnouncementType;

  @Prop()
  ctaLabel?: string;

  @Prop()
  ctaUrl?: string;

  @Prop({ default: false })
  published: boolean;

  @Prop()
  publishedAt?: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

AnnouncementSchema.index({ publishedAt: -1 });
AnnouncementSchema.index({ published: 1, publishedAt: -1 });

AnnouncementSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
