import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './category.schema';

@Module({
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
    imports: 
    [
        MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }])
    ],
})
export class CategoryModule {}
