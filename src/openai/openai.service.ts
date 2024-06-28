import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder
} from "langchain/prompts";
import { ConversationChain } from 'langchain/chains';
import {
    BufferMemory,
} from "langchain/memory";
import { InjectModel } from '@nestjs/mongoose';
import { Prompt } from './schemas/prompt.schema';
import { GcalendarService } from 'src/Gcalendar/Gcalendar.service';
import { GoogleCalendarCreateTool } from 'langchain/google/calendar';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';


@Injectable()
export class OpenaiService {

    llm = null;
    memory = null;
    chain = null;


    constructor(
        private readonly configService: ConfigService,
        @Inject(GcalendarService) private readonly gcalendarService: GcalendarService
    ) {

        this.llm = new ChatOpenAI({ temperature: 0.9, openAIApiKey: this.configService.get('OPENAI_API_KEY') });
        this.memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
        this.initConversationChain();
  
    }

    initConversationChain() {
        const chatPrompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(
                `The following is a friendly conversation between a human and an AI based restaurant assistant.
                         The AI name is Jonathan and is friendly and provides lots of specific details from its context. 
                         The assistant starts with a greeting sharing the restaurant name as Leap queue demo Restaurant and collects 
                         the humans contact details to share personalized options and to notify any order updates.
                         After making sure it has the phone number of the human, it takes food orders, confirm pickup 
                         or delivery and answers any question the human may have about the restaurant seating capacity, catering services,
                         hours of operations etc.if the human asks for menu provide these menuAppetizers:

                         Caesar Salad: $9.99
                         Mozzarella Sticks: $7.99
                         Calamari: $12.99
                         Spinach and Artichoke Dip: $8.99
                         Buffalo Wings (10 pieces): $11.99
                         Bruschetta: $6.99
                     
                     Main Courses:
                     7. Grilled Chicken Breast: $14.99
                         Salmon Fillet: $16.99
                         Pasta Primavera: $12.99
                         Ribeye Steak: $24.99
                         Vegetable Stir-Fry: $13.99
                         Classic Cheeseburger: $10.99
                     
                     Pizza:
                         Margherita Pizza (12-inch): $13.99
                         Pepperoni Pizza (14-inch): $15.99
                         Hawaiian Pizza (16-inch): $17.99
                         Vegetarian Pizza (12-inch): $14.99
                         Meat Lovers Pizza (14-inch): $16.99
                     
                     Desserts:
                         Chocolate Cake Slice: $5.99
                     
                         New York Cheesecake: $6.99
                         Tiramisu: $7.99
                         Fruit Salad: $4.99
                         Ice Cream Sundae: $4.99
                         Key Lime Pie: $5.99
                     
                     Beverages:
                         Soda (16 oz): $1.99
                     
                         Iced Tea (20 oz): $2.49
                         Lemonade (16 oz): $2.99
                         Bottled Water: $1.49
                         Coffee: $2.29
                         Glass of House Wine: $6.99,
                        
                         The AI assistant closes the conversation with human by mentioning order name which is 
                         the name of the human, summarize the order details with items and quantities, confirms the phone number collected such as 123-123-1234 and approximate 
                         pickup time in minutes like 30 minutes or 45 minutes.
            
                         If the AI does not know the answer to a question, it truthfully says it does not know.
                         `
            ),
            new MessagesPlaceholder("history"),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);

        this.chain = new ConversationChain({
            llm: this.llm,
            memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
            prompt: chatPrompt,
        });
    }

    async askQuestion(message: string): Promise<string> {
        const response = await this.chain.predict({
            input: message,
        });
        return response;
    }

    async execPrompt(message: string): Promise<string> {
    
        const template = `I have a service to create events  in google calendar
        this is the syntax for the function call for creating an event; 
               \' this.gcalendarService.createEvent({
                    "summary" : "Testing the Google Calendar",
                     "description": "Scheduling for DialogueBird Meeting",
                     "start":{
                         
                         "dateTime": "2023-10-16T15:00:00+05:30", 
                         "timeZone": "Asia/Kolkata"
                     },
                     "end":{
                         
                         "dateTime": "2023-10-16T16:01:00+05:30",  
                         "timeZone": "Asia/Kolkata"
                     }  
               }) \'
       
       I have a service to get events  in google calendar
        this is the syntax for the function call for getting all events; 
       \' this.gcalendarService.getEvents( ) \'
       
       I have a service to update an event  in google calendar
        this is the syntax for the function updating an event; 
       \' this.gcalendarService.getEvents( ) \'
       
       I have a service to update an event  by ID in google calendar
        this is the syntax for the function updating an event by ID; 
       \' this.gcalendarService.updateEventById(0dgjga1td9rc98gnnqnh74rsjk, {
                    "summary" : "Testing the Google Calendar",
                     "description": "Scheduling for DialogueBird Meeting",
                     "start":{
                         
                         "dateTime": "2023-10-16T15:00:00+05:30", 
                         "timeZone": "Asia/Kolkata"
                     },
                     "end":{
                         
                         "dateTime": "2023-10-16T16:01:00+05:30",  
                         "timeZone": "Asia/Kolkata"
                     }  
               }); \'
       
       I have a service to delete an event  in google calendar
        this is the syntax for the function deleting an event; 
       \' this.gcalendarService.getEvents( ) \'
       
       I have a service to delete an event  by ID in google calendar
        this is the syntax for the function deleting an event by ID; 
       \' this.gcalendarService.deleteEventById(0dgjga1td9rc98gnnqnh74rsjk); \'
       
       
       
               No need to generate any other code, the service is already defined with this method. You need to generate the function call of this code in a single line without any explanation for the given event. Do not type anything else than the function call:
        ${message}`
        const response = await this.llm.predict(template)
        console.log({ response })
        try {
           const result = await eval(response);
            return result;
        } catch {
            return "failure"
        }
    }

    getChatHistory = () => {
        return this.chain.memory.chatHistory.messages;
    }

    async createCaledarEvent(command : string){

        const response = await agent.call({ command });
        return 
    }
}