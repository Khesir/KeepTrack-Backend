import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BudgetProfileDocument = BudgetProfile & Document;

@Schema({ timestamps: true, collection: 'budget_profiles' })
export class BudgetProfile {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string | null;

  @Prop({ default: null })
  startDate: Date | null;

  @Prop({ default: null })
  endDate: Date | null;

  @Prop({ default: null })
  colorHex: string | null;

  @Prop({ default: 'active', enum: ['active', 'completed', 'archived'], index: true })
  status: string;

  @Prop({ default: 'custom', enum: ['monthly', 'custom'] })
  profileType: string;

  @Prop({ default: false, index: true })
  isMain: boolean;
}

export const BudgetProfileSchema = SchemaFactory.createForClass(BudgetProfile);

BudgetProfileSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
