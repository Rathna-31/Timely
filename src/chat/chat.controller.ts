import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('start')
  async startChatSession() {
    return this.chatService.startChatSession();
  }

  @Post('message')
  async chat(@Body() chatRequest: any) {
    return this.chatService.chat(chatRequest);
  }

  @Get('end')
  async endChat() {
    return this.chatService.endChat();
  }

  @Post('execute')
  async exec(@Body() chatRequest: any):Promise<any> {
    return await this.chatService.exec(chatRequest)
  }

  @Get('history')
  async getChatHistory() {
    return this.chatService.getChatHistory();
  }

  @Post('langchainCalendar')
  async aiCalendarEvent(@Body() chatRequest:any):Promise<any>{
    return await this.chatService.aiCalendarEvent(chatRequest);
  }
}
