import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    restaurantName: string;

    @Prop({ required: true })
    contactNumber: string;

    @Prop({ required: true })
    emailVerified: boolean;

    @Prop({ required: false })
    active: boolean;

    @Prop({ type: Date, default: Date.now })
    created_at: Date;

    @Prop({ required: false })
    profile: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
