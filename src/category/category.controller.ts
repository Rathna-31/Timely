import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.interface';
import { CategoryDto } from './category.dto';
import { request } from 'http';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Post()
  create(@Body() categoryDto: CategoryDto, @Req() request: any): Promise<Category> {
    const uid = request.user.uid;
    const category: Category = {
        uid: uid,
        name: categoryDto.name,
        description: categoryDto.description,
        image: categoryDto.image,
        active: categoryDto.active,
        created_at: new Date(),
    };
    console.log(category);
    return this.categoryService.create(category);
  }
}
