import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonthPlanDocument = MonthPlan & Document;

@Schema({ timestamps: true, collection: 'month_plans' })
export class MonthPlan {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Account' })
  accountId: Types.ObjectId | null;

  // null for profile plans; required for monthly plans
  @Prop({ default: null, index: true })
  month: string | null;

  // null for monthly plans; required for profile plans
  @Prop({ default: null, type: Types.ObjectId, ref: 'BudgetProfile', index: true })
  budgetProfileId: Types.ObjectId | null;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ type: [Types.ObjectId], ref: 'Budget', default: [] })
  budgetIds: Types.ObjectId[];
}

export const MonthPlanSchema = SchemaFactory.createForClass(MonthPlan);

// Separate sparse unique indexes so monthly and profile plans don't conflict
MonthPlanSchema.index({ userId: 1, month: 1 }, { unique: true, sparse: true });
MonthPlanSchema.index({ userId: 1, budgetProfileId: 1 }, { unique: true, sparse: true });

MonthPlanSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
