import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadedDocumentSchema } from './document.schema';
import { ProductsModule } from 'src/products/products.module';
import { CategoryModule } from 'src/category/category.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DocumentService],
  controllers: [DocumentController],
  imports: [
    ConfigModule,
    ProductsModule,
    CategoryModule,
    MongooseModule.forFeature([{ name: 'Document', schema: UploadedDocumentSchema }]),
  ],
})
export class DocumentModule { }
