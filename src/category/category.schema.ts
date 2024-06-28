import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;


@Schema()
export class Category extends Document {

    @Prop({ required: true })
    uid: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false})
    image: string[];

    @Prop({ default: true })
    active: boolean;

    @Prop({ default: Date.now })
    created_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
