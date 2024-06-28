import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }
  getHello(): string {
    return 'Hello World!';
  }

  // getTwiml(request, response) {
  //   response.type('text/xml');
  //   response.send(`
  //   <Response>
  //     <Start>
  //       <Stream url="wss://2397-136-56-99-126.ngrok-free.app/"/>
  //     </Start>
  //     <Say>I will stream the next 60 seconds of audio through your websocket</Say>
  //     <Pause length="60" />
  //   </Response>
  // `);
  // }

  getTwiml(request, response) {
    response.type('text/xml');
    response.send(`
    <Response>
      <Connect>
        <Stream url="wss://${this.configService.get('STREAMING_HOST_ADDRESS')}/"/>
      </Connect>
    </Response>
  `);
  }
}
