import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema({ timestamps: true, collection: 'goals' })
export class Goal {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  description: string | null;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop({ default: null })
  targetDate: Date | null;

  @Prop({ default: null })
  colorHex: string | null;

  @Prop({ default: null })
  iconCodePoint: number | null;

  @Prop({ default: 'active', enum: ['active', 'completed', 'paused'], index: true })
  status: string;

  @Prop({ default: null })
  monthlyContribution: number | null;

  @Prop({ default: 0 })
  managementFeePercent: number;

  @Prop({ default: 0 })
  withdrawalFeePercent: number;

  @Prop({ default: null })
  completedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'Savings', default: null })
  savingsBucketId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'BudgetProfile', index: true })
  budgetProfileId: Types.ObjectId | null;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);

GoalSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.budgetProfileId) ret.budgetProfileId = ret.budgetProfileId.toString();
    return ret;
  },
});
