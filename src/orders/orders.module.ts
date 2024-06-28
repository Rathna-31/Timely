import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './orders.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, ConfigService],
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  exports: [OrdersService],
})

export class OrdersModule {}


