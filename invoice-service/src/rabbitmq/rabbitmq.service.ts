import { Injectable } from '@nestjs/common';
import { Channel, Connection, connect } from 'amqplib';

@Injectable()
export class RabbitmqService {
  private connection: Connection;
  private channel: Channel;
  private readonly queueName = 'daily_sales_report';

  constructor() {}

  async connect() {
    this.connection = await connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async sendMessage(message: any) {
    if (!this.channel) {
      await this.connect();
    }

    this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
    console.log(`Sent message to queue ${this.queueName}:`, message);
  }

  async closeConnection() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
