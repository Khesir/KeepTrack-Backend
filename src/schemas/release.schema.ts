import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReleaseDocument = Release & Document;

@Schema({ timestamps: true, collection: 'releases' })
export class Release {
  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  exeUrl?: string;

  @Prop()
  apkUrl?: string;

  @Prop()
  dmgUrl?: string;

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
