import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { ConfigService } from '@nestjs/config';
import { CustomerSchema } from './customers.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '../mailer/mailer.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
    controllers: [CustomersController],
    providers: [CustomersService, ConfigService],
    imports: [
        MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
        MailerModule,
        ProductsModule,
        OrdersModule
      ],
})

export class CustomersModule {}
