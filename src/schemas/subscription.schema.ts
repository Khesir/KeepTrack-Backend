import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true, collection: 'subscriptions' })
export class Subscription {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  provider: string | null;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['weekly', 'monthly', 'quarterly', 'annual'] })
  billingCycle: string;

  @Prop({ required: true, enum: ['active', 'paused', 'cancelled'], default: 'active' })
  status: string;

  @Prop({ required: true })
  nextBillingDate: Date;

  @Prop({ default: null })
  lastBilledDate: Date | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'FinanceCategory' })
  budgetCategoryId: Types.ObjectId | null;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ default: null })
  colorHex: string | null;

  @Prop({ default: null })
  iconCodePoint: number | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'BudgetProfile', index: true })
  budgetProfileId: Types.ObjectId | null;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.budgetProfileId) ret.budgetProfileId = ret.budgetProfileId.toString();
    if (ret.budgetCategoryId) ret.budgetCategoryId = ret.budgetCategoryId.toString();
    return ret;
  },
});
