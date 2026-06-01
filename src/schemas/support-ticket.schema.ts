import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupportTicketDocument = SupportTicket & Document;

export type TicketType = 'bug' | 'question' | 'feature' | 'other';
export type TicketStatus = 'open' | 'in-review' | 'resolved';

@Schema({ timestamps: true, collection: 'support_tickets' })
export class SupportTicket {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ['bug', 'question', 'feature', 'other'] })
  type: TicketType;

  @Prop({ default: 'open', enum: ['open', 'in-review', 'resolved'] })
  status: TicketStatus;

  @Prop({ type: [String], default: [] })
  imageUrls: string[];

  @Prop()
  adminNote?: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);

SupportTicketSchema.index({ status: 1, createdAt: -1 });

SupportTicketSchema.set('toJSON', {
  virtuals: true,
  transform: (_: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
