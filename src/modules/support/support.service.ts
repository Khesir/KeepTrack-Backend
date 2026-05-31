import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportTicket, SupportTicketDocument } from '../../schemas/support-ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportTicket.name)
    private ticketModel: Model<SupportTicketDocument>,
  ) {}

  async create(dto: CreateTicketDto): Promise<SupportTicket> {
    return new this.ticketModel(dto).save();
  }

  async findAll(status?: string): Promise<SupportTicket[]> {
    const filter = status ? { status } : {};
    return this.ticketModel.find(filter).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string): Promise<SupportTicket> {
    const doc = await this.ticketModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Ticket not found.');
    return doc;
  }

  async update(id: string, dto: UpdateTicketDto): Promise<SupportTicket> {
    const doc = await this.ticketModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Ticket not found.');
    return doc;
  }

  async remove(id: string): Promise<void> {
    const doc = await this.ticketModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Ticket not found.');
  }
}
