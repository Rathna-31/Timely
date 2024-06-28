import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { GcalendarController } from '../Gcalendar/Gcalendar.controller';
import { GcalendarService } from '../Gcalendar/Gcalendar.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleAccount, GoogleAccountSchema } from './Gcalendar.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [GcalendarController],
  providers: [GcalendarService, ConfigService],
  exports: [GcalendarService],
  imports:
    [
      MongooseModule.forFeature([{ name: GoogleAccount.name, schema: GoogleAccountSchema }])
    ],
})
export class GcalendarModule { }

