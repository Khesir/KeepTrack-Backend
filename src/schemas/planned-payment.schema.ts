import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlannedPaymentDocument = PlannedPayment & Document;

@Schema({ timestamps: true, collection: 'planned_payments' })
export class PlannedPayment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  payee: string | null;

  @Prop({ required: true })
  amount: number;

  @Prop({
    required: true,
    enum: ['bills', 'subscriptions', 'insurance', 'loan', 'rent', 'utilities', 'other'],
  })
  category: string;

  @Prop({
    required: true,
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly', 'oneTime'],
  })
  frequency: string;

  @Prop({ required: true, index: true })
  nextPaymentDate: Date;

  @Prop({ default: null })
  lastPaymentDate: Date | null;

  @Prop({ default: null })
  endDate: Date | null;

  @Prop({ default: 'active', enum: ['active', 'paused', 'cancelled', 'closed'], index: true })
  status: string;

  @Prop({ default: null })
  notes: string | null;

  @Prop({ default: null })
  totalInstallments: number | null;

  @Prop({ default: null })
  remainingInstallments: number | null;
}

export const PlannedPaymentSchema = SchemaFactory.createForClass(PlannedPayment);

PlannedPaymentSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
