import { Inject } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { OpenaiService } from '../openai/openai.service';
import { Server } from 'ws';
import { SpeechService } from '../speech/speech.service';


@WebSocketGateway(8090)
export class EventsGateway {

    constructor(private speechService: SpeechService, private openaiService: OpenaiService) {

    }

    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        // throw new Error('Method not implemented.'); - comment this
        console.log('Initialized');
    }



    @SubscribeMessage('connected')
    @SubscribeMessage('start')
    handleConnectedEvent(ws) {
        console.log(`A new call has connected.`);

        //console.log(ws);

        // Recognize the stream
        this.speechService.initRecognizeStream();

        // Start message is also part of connected event
        ws.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            console.log(msg.event);
            // this.speechService.playMusic(ws, msg.streamSid);
            // this.speechService.textToSpeech(ws, msg.streamSid, "Hello, welcome to the Open AI demo. Please ask me a question.");
            if (msg.event === 'start') {
                console.log(`Event: ${msg.event}`);
                console.log(`Starting Media Stream ${msg.streamSid}`);
            }
        }
    }

    // @SubscribeMessage('start')
    // handleStartEvent(ws) {
    //     console.log(`Start event recieved`);

    // }

    @SubscribeMessage('media')
    handleMediaEvent(ws) {
        // console.log(ws)
        ws.onmessage = async (event) => {
            let msg = JSON.parse(event.data);

            if (msg.event !== 'stop') {
                this.speechService.write(msg.media.payload);
            }

            if (this.speechService.currentResponse) {
                console.log(this.speechService.currentResponse);
                console.log(`Sending AI Response : ws: ${ws} streamSid: ${msg.streamSid}`);
                this.speechService.textToSpeech(ws, msg.streamSid, this.speechService.currentResponse);
                this.speechService.currentResponse = null;
            }

        };

    }

    @SubscribeMessage('stop')
    handleStopEvent(ws) {
        console.log(`Call Has Ended`);
        const aiReplies = []
        const messages = this.openaiService.getChatHistory() // array of chat history messages.
        messages.forEach(message => {
            const jsonMessage = message.toJSON();
            if (jsonMessage.type === 'ai') {
                aiReplies.push(jsonMessage.data.content);
            }
        });
        console.log("aiReplies");
        console.log(aiReplies)
        this.speechService.destroyRecognizeStream();
    }
}
