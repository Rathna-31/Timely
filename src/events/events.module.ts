import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { SpeechModule } from '../speech/speech.module';
import { OpenaiModule } from 'src/openai/openai.module';


@Module({
  imports: [SpeechModule, OpenaiModule],
  providers: [EventsGateway],
})
export class EventsModule { }
