import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [MailerService, ConfigService],
  exports: [MailerService],
})
export class MailerModule {}
