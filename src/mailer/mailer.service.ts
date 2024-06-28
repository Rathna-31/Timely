import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import { mailData } from './mailer.interface';
const sgMail = require('@sendgrid/mail');

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(data: mailData): Promise<void> {

    try{
        const emailData = {
            to: data.recipient,
            from: data.sender,
            templateId: data.templateId,
            dynamic_template_data: data.dynamic_template_data,
        };

        const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
        console.log('apiKey', apiKey);
        console.log('emailData', emailData);
        
        sgMail.setApiKey(apiKey);
        await sgMail.send(emailData);
    } catch (error) {
        console.error('Failed to send email:', error.response.body.errors);
        throw new Error('Failed to send email');
    }
  }
}
