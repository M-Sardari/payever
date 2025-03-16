import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSenderService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmailReport(reportData: any) {
    const emailRecipient = this.configService.get<string>('REPORT_EMAIL_TO');
    const subject = `Daily Sales Report - ${new Date().toLocaleDateString()}`;
    const htmlContent = this.generateReportHtml(reportData);

    try {
      const report = {
        from: `"Sales Report" <${this.configService.get<string>('EMAIL_USER')}>`,
        to: emailRecipient,
        subject: subject,
        html: htmlContent,
      };

      // await this.transporter.sendMail(report);

      console.log(`Email sent: ${JSON.stringify(report, null, ' ')}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private generateReportHtml(reportData: any): string {
    console.log('reportData:', reportData);

    if (!reportData || reportData.length === 0) {
      return '<p>No sales data available</p>';
    }
    return `
      <h2>Daily Sales Report</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Date</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>${reportData.customer}</td>
              <td>${reportData.amount}</td>
              <td>${reportData.reference}</td>
              <td>${new Date(reportData.date).toLocaleString()}</td>
            </tr>
        </tbody>
      </table>
    `;
  }
}
