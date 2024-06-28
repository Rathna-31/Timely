import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {

  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async create(category): Promise<Category> {
    const newCategory = new this.categoryModel(category);
    return newCategory.save();
  }

  async findCategoryByName(uid: any, category: any) {
    console.log(uid, category);
    return this.categoryModel.findOne({uid: uid, name: category}).exec();
  }

}
