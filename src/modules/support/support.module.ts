import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportTicket, SupportTicketSchema } from '../../schemas/support-ticket.schema';
import { BlobStorageModule } from '../../common/blob-storage/blob-storage.module';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SupportTicket.name, schema: SupportTicketSchema }]),
    BlobStorageModule,
  ],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
