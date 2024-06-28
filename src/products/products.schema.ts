// product.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Variant } from './products.interface';

export type ProductDocument = Product & Document;

@Schema()
export class Product {

  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  // @Prop({ required: true})
  // image: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ enum: ['InStock', 'OutOfStock'], default: 'InStock' })
  stock: 'InStock' | 'OutOfStock';

  @Prop({ required: true })
  tax: string;

  @Prop([{ name: String, price: Number }])
  variants: Variant[];

  @Prop({ required: true })
  specialTags: string[];

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  nonVegetarian: boolean;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
