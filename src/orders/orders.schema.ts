// item.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { Customer, DelveryAddress, Item, Payment } from './orders.interface';
import { OrderItem } from './orders.interface';
export type OrderDocument = Order & Document;

@Schema()
export class Order {

  @Prop({ required: false })
  uid: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: false })
  orderType: string;

  @Prop({ required: false })
  orderStatus: string;

  @Prop({ required: false, type: Date })
  orderDate: Date;

  @Prop({ required: false })
  orderTime: string;

  @Prop({ required: true, type: [{ type: Object }] })
  orderItems: OrderItem[];

  @Prop({ required: false })
  deliveryAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

