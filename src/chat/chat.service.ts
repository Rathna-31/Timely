import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';


@Injectable()
export class ChatService {

  constructor(private openaiService: OpenaiService) { }

  async startChatSession() {
    console.log(`Chat Session Started`);
    await this.openaiService.initConversationChain();
    return { response: "New Chat Session Started" };
  }

  async chat(chatRequest: any) {
    const response = await this.openaiService.askQuestion(chatRequest.question);
    return { response: response };
  }

  async exec(chatRequest: any) {
    const response = await this.openaiService.execPrompt(chatRequest.question);
    return response;
  }

  async getChatHistory(): Promise<string[]> {
    const chatHistory = []
    const messages = this.openaiService.getChatHistory() // array of chat history messages.
    messages.forEach(message => {
      const jsonMessage = message.toJSON()
      chatHistory.push(jsonMessage.data.content);
    });
    return chatHistory;
  }

  async endChat() {
    console.log(`Chat Has Ended`);
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
  }

  async aiCalendarEvent(chatRequest:any):Promise<any>{
    return await this.openaiService.createCaledarEvent(chatRequest.command);
  }
}
