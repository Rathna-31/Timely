import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiService } from './openai.service';
import { OrdersModule } from 'src/orders/orders.module';
import { Prompt, PromptSchema } from './schemas/prompt.schema';
import { GcalendarModule } from 'src/Gcalendar/Gcalendar.module';

@Module({
  imports: [OrdersModule, MongooseModule.forFeature([{ name: Prompt.name, schema: PromptSchema }]),GcalendarModule],
  providers: [OpenaiService, ConfigService,],
  exports: [OpenaiService]
})
export class OpenaiModule { }
