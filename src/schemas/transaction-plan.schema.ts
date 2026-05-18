import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionPlanDocument = TransactionPlan & Document;

@Schema({ timestamps: true, collection: 'transactionplans' })
export class TransactionPlan {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({ required: true, index: true })
  plannedDate: Date;

  @Prop({ required: true, enum: ['pending', 'completed', 'cancelled'], default: 'pending', index: true })
  status: string;

  @Prop({ default: null, type: Types.ObjectId, ref: 'FinanceCategory' })
  financeCategoryId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Budget' })
  budgetId: Types.ObjectId | null;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Transaction' })
  completedTransactionId: Types.ObjectId | null;

  @Prop({ default: null })
  completedAt: Date | null;
}

export const TransactionPlanSchema = SchemaFactory.createForClass(TransactionPlan);

TransactionPlanSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
