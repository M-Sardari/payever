import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { EmailSenderService } from '../email-sender/email-sender.service';

@Injectable()
export class NotifierService {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  startDailyReportJob() {
    cron.schedule('0 12 * * *', async () => {
      try {
        await this.rabbitmqService.consumeMessages();
        console.log('Daily report sent successfully');
      } catch (error) {
        console.error('Error sending daily report:', error);
      }
    });
  }
}
