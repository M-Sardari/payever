import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailSenderService } from '../email-sender/email-sender.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFIER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'daily_sales_report',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [RabbitmqService],
  providers: [RabbitmqService, EmailSenderService],
})
export class RabbitmqModule {}
