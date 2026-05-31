import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ReceiptParserService } from './receipt-parser.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ParseReceiptDto } from './dto/parse-receipt.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly receiptParserService: ReceiptParserService,
  ) {}

  @Get()
  findAll(@Req() req, @Query() query: any) {
    return this.transactionsService.findAll(req.user.authId, query);
  }

  @Get('summary')
  getSummary(
    @Req() req,
    @Query('type') type: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.getSummary(req.user.authId, type, startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.transactionsService.findOne(id, req.user.authId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.authId, dto);
  }

  @Post('parse-receipt')
  parseReceipt(@Body() dto: ParseReceiptDto) {
    return this.receiptParserService.parseReceipt(dto.imageBase64, dto.mimeType);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto, @Req() req) {
    return this.transactionsService.update(id, dto, req.user.authId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.transactionsService.remove(id, req.user.authId);
  }
}
