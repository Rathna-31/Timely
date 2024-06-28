import { Module } from '@nestjs/common';
import { OpenaiModule } from '../openai/openai.module';
import { SpeechService } from './speech.service';
import { OpenaiService } from '../openai/openai.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule, OpenaiModule],
  providers: [SpeechService, ConfigService],
  exports: [SpeechService]
})
export class SpeechModule { }
