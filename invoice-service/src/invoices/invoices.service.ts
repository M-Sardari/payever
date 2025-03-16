import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly rabbitMQService: RabbitmqService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }

  @Cron('0 0 */12 * * *') // Runs every 12 hours
  async sendDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const invoices = await this.invoiceModel.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const totalSales = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const report = {
      date: today.toISOString().split('T')[0],
      totalSales,
      totalInvoices: invoices.length,
    };

    await this.rabbitMQService.sendMessage(report);
  }
}
