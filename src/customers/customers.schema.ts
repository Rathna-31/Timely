import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address } from './customers.interface';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {

  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  email: string;

  @Prop({type: [Object]})
  address: Address;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}


export const CustomerSchema = SchemaFactory.createForClass(Customer);
