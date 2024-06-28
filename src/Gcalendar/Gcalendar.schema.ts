import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GoogleAccountDocument = GoogleAccount & Document;

@Schema()
export class GoogleAccount {



  @Prop({ required: true, trim: true })
  email: string;

  // @Prop({ trim: true })
  // name: string;

  @Prop({ required: true, trim: true })
  access_token: string;

  @Prop({ trim: true })
  refresh_token: string;

  @Prop({ trim: true })
  scope: string;

  @Prop({ required: true, trim: true })
  expiry_date: Date;

  @Prop({ required: true, trim: true })
  token_type: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}




export const GoogleAccountSchema = SchemaFactory.createForClass(GoogleAccount);
