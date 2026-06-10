import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DebtDocument = Debt & Document;

@Schema({ timestamps: true, collection: 'debts' })
export class Debt {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'Transaction' })
  transactionId: Types.ObjectId | null;

  @Prop({ required: true, enum: ['lending', 'borrowing'] })
  type: string;

  @Prop({ required: true })
  personName: string;

  @Prop({ default: null })
  description: string | null;

  @Prop({ required: true })
  originalAmount: number;

  @Prop({ required: true })
  remainingAmount: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: null, index: true })
  dueDate: Date | null;

  @Prop({ default: 'active', enum: ['active', 'overdue', 'settled'], index: true })
  status: string;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ default: null })
  monthlyPaymentAmount: number | null;

  @Prop({ default: 0 })
  feeAmount: number;

  @Prop({ default: null })
  nextPaymentDate: Date | null;

  @Prop({
    default: null,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly', null],
  })
  paymentFrequency: string | null;

  @Prop({ default: null })
  settledAt: Date | null;

  @Prop({ default: null, type: Types.ObjectId, ref: 'BudgetProfile', index: true })
  budgetProfileId: Types.ObjectId | null;
}

export const DebtSchema = SchemaFactory.createForClass(Debt);

DebtSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.budgetProfileId) ret.budgetProfileId = ret.budgetProfileId.toString();
    return ret;
  },
});
