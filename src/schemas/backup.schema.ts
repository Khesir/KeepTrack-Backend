import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BackupDocument = Backup & Document;

@Schema({ timestamps: true, collection: 'backups' })
export class Backup {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  data: string;
}

export const BackupSchema = SchemaFactory.createForClass(Backup);

BackupSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
