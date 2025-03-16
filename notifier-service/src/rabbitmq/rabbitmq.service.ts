import { Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, connect, Connection } from 'amqplib';
import { EmailSenderService } from '../email-sender/email-sender.service';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private connection: Connection;
  private channel: Channel;
  private readonly queueName = 'daily_sales_report';

  constructor(private readonly emailSenderService: EmailSenderService) {}

  async onModuleInit() {
    await this.connect();
    await this.consumeMessages();
  }

  async connect() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async consumeMessages() {
    if (!this.channel) {
      await this.connect();
    }

    this.channel.consume(
      this.queueName,
      async (msg) => {
        if (msg) {
          const messageContent = JSON.parse(msg.content.toString());
          console.log(
            `Received message from queue ${this.queueName}:`,
            messageContent,
          );

          await this.emailSenderService.sendEmailReport(messageContent);

          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );
  }

  async closeConnection() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
