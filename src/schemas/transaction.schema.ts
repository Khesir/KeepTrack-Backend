import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Savings', index: true })
  savingsId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'FinanceCategory' })
  financeCategoryId: Types.ObjectId | null;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['income', 'expense', 'transfer'], index: true })
  type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ default: 0 })
  fee: number;

  @Prop({ default: null })
  feeDescription: string | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Budget', index: true })
  budgetId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Debt', index: true })
  debtId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Goal', index: true })
  goalId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'PlannedPayment' })
  plannedPaymentId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Transaction' })
  refundedTransactionId: Types.ObjectId | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Subscription', index: true })
  subscriptionId: Types.ObjectId | null;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
