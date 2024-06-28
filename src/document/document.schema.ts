import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadedDocumentDocument = UploadedDocument & Document;

@Schema()
export class UploadedDocument extends Document {

    @Prop({ required: true })
    uid: string;

    @Prop()
    mimetype: string;

    @Prop()
    size: number;

    @Prop()
    destination: string;

    @Prop()
    filename: string;

    @Prop()
    filepath: string;

    @Prop({ default: Date.now })
    created_at: Date;
}

export const UploadedDocumentSchema = SchemaFactory.createForClass(UploadedDocument);
