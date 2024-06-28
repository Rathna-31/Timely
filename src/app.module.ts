import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { SpeechModule } from './speech/speech.module';
import { OpenaiModule } from './openai/openai.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { FirebaseAuthMiddleware } from './middleware/auth.middleware';
import { FirebaseApp } from './middleware/firebase';
import { UserModule } from './users/users.module';
import { DocumentModule } from './document/document.module';
import { MailerModule } from './mailer/mailer.module';
import { GcalendarModule } from './Gcalendar/Gcalendar.module';

@Module({
  imports: [OpenaiModule, SpeechModule, EventsModule, ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://127.0.0.1:27017/DialogueBird'), ChatModule, OrdersModule, CustomersModule, ProductsModule, CategoryModule, UserModule, DocumentModule, MailerModule,GcalendarModule],
  controllers: [AppController],
  providers: [AppService, FirebaseApp],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseAuthMiddleware)
      .exclude(
        { path: 'orders', method: RequestMethod.POST },
        { path: 'customers', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
        { path: 'Gcalendar/google', method: RequestMethod.GET },
        { path: 'Gcalendar/google/redirect', method: RequestMethod.GET },
        { path: 'Gcalendar/scheduleEvent', method: RequestMethod.POST },
        { path: 'Gcalendar/save/access_token', method: RequestMethod.POST },
        { path: "Gcalendar/getCalendarEvent", method: RequestMethod.GET },
        { path: "Gcalendar/updateEvent/:id", method: RequestMethod.PUT },
        { path: "Gcalendar/deleteEvent/:id", method: RequestMethod.DELETE },
        {path: "chat/execute", method: RequestMethod.POST}
        
        
        
      )
      .forRoutes('*');
  }
}
//mongodb+srv://leapqueadmin:leapqueadminpass@cluster0.hdtcaza.mongodb.net/leapqueDev?retryWrites=true&w=majority
//export class AppModule { }

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(FirebaseAuthMiddleware)
//       .exclude(
//         { path: 'orders', method: RequestMethod.POST },
//         { path: 'customers', method: RequestMethod.POST },
//         { path: 'users', method: RequestMethod.POST },
//         { path: '/', method: RequestMethod.POST },
//       )
//       .forRoutes('*');
//   }
// }