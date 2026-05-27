import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavingsDocument = Savings & Document;

@Schema({ timestamps: true, collection: 'savings' })
export class Savings {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ default: null })
  colorHex: string | null;

  @Prop({ default: null })
  iconCodePoint: number | null;
}

export const SavingsSchema = SchemaFactory.createForClass(Savings);

SavingsSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
