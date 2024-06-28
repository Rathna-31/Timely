import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



import { OpenaiService } from '../openai/openai.service';
const speech = require("@google-cloud/speech");
const textToSpeech = require('@google-cloud/text-to-speech');

const WaveFile = require('wavefile').WaveFile;
const Lame = require("node-lame").Lame;

const fs = require('fs');
const util = require('util');



Injectable()
export class SpeechService {
    client: any;

    request: any;
    textToSpeechClient: any;
    textToSpeechRequest: any;
    recognizeStream: any;
    currentResponse: string;

    constructor(
        @Inject(OpenaiService) private readonly openaiService: OpenaiService,
        private readonly httpService: HttpService,
        private configService: ConfigService) {
        console.log('SpeechService constructor');
        console.log(configService);

        this.client = new speech.SpeechClient();
        this.request = {
            config: {
                encoding: "MULAW",
                sampleRateHertz: 8000,
                languageCode: "en-US",
                alternateLanguageCodes: ["en-IN"],
                useEnhanced: true,
                enableAutomaticPunctuation: true,
            },
            interimResults: false
        };

        this.textToSpeechClient = new textToSpeech.TextToSpeechClient();
        this.textToSpeechRequest = {
            input: { text: "Hello, World!" },
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: 'MULAW', pitch: 0, speakingRate: 1, sampleRateHertz: 8000, bitdepth: 8 },
        };


    }


    initRecognizeStream = () => {
        this.recognizeStream = this.client.streamingRecognize(this.request)
            .on("error", console.error)
            .on("data", async (data) => {
                const recognizedText = data.results[0].alternatives[0].transcript;
                console.log(`User Message: ${recognizedText}`);
                const aiResponse = await this.openaiService.askQuestion(recognizedText);
                this.currentResponse = aiResponse;
                console.log(`AI Message: ${this.currentResponse}`);
            });
    }



    write = (data) => {
        this.recognizeStream.write(data);
    }


    destroyRecognizeStream = () => {
        this.recognizeStream.destroy();
    }

    chunkArray = (array, chunkSize) => {
        var chunkedArray = [];
        for (var i = 0; i < array.length; i += chunkSize)
            chunkedArray.push(array.slice(i, i + chunkSize));
        return chunkedArray;
    };

    playMusic = (ws, streamSid) => {
        console.log('playMusic');
        const wav = new WaveFile(fs.readFileSync('./sample-3s.wav'));

        wav.toSampleRate(8000);
        wav.toBitDepth('16');
        wav.toMuLaw();
        const samples = this.chunkArray(wav.getSamples()[0], 320);
        samples.forEach((sample, index) => {
            const res = {
                event: 'media',
                sequenceNumber: index + 1,
                media: {
                    track: 'outbound',
                    chunk: index + 1,
                    timestamp: index * 320,
                    payload: Buffer.from(sample).toString('base64'),
                },
                streamSid: streamSid,
            };
            ws.send(JSON.stringify(res));
        });
    }

    textToSpeech = async (ws, streamSid, text) => {
        this.textToSpeechRequest.input.text = text;
        const [response] = await this.textToSpeechClient.synthesizeSpeech(this.textToSpeechRequest);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.wav', response.audioContent, 'binary');

        console.log('Audio content written to file: output.wav')


        const wav = new WaveFile(await fs.readFileSync('./output.wav'));
        //console.log(wav.getSamples());


        // wav.toSampleRate(8000);
        // wav.toBitDepth('16');
        // wav.toMuLaw();
        const samples = this.chunkArray(wav.getSamples(), 320);
        samples.forEach((sample, index) => {
            const res = {
                event: 'media',
                sequenceNumber: index + 1,
                media: {
                    track: 'outbound',
                    chunk: index + 1,
                    timestamp: index * 320,
                    payload: Buffer.from(sample).toString('base64'),
                },
                streamSid: streamSid,
            };
            ws.send(JSON.stringify(res));
        });
    }

    textToSpeech2 = async (ws, streamSid, text) => {
        this.httpService.post(`https://api.elevenlabs.io/v1/text-to-speech/${this.configService.get('TTS_VOICE_ID')}/stream`, {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }, {
            headers: {
                'xi-api-key': this.configService.get('TTS_API_KEY'),
            },
            responseType: 'arraybuffer'
        }).subscribe(async (response) => {
            // console.log(response);

            const decoder = new Lame({
                "output": "demo.wav",
            }).setBuffer(response.data);

            await decoder.decode();
            console.log('Audio content written to file: demo.wav')



            const wav = new WaveFile(await fs.readFileSync('./demo.wav'));
            //console.log(wav.getSamples());


            wav.toSampleRate(8000);
            wav.toBitDepth('16');
            wav.toMuLaw();
            const samples = this.chunkArray(wav.getSamples(), 320);
            samples.forEach((sample, index) => {
                const res = {
                    event: 'media',
                    sequenceNumber: index + 1,
                    media: {
                        track: 'outbound',
                        chunk: index + 1,
                        timestamp: index * 320,
                        payload: Buffer.from(sample).toString('base64'),
                    },
                    streamSid: streamSid,
                };
                ws.send(JSON.stringify(res));
            });
        }
        );
    }


}