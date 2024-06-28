// product.controller.ts

import { Controller, Post, Body, Get, Req, Param, Put } from '@nestjs/common';
import { ProductService } from './products.service';
import { Product } from './products.schema';
import { ProductDto } from './products.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    console.log("findAll");
    return this.productService.findAll();
  }

  @Post()
  createProduct(@Body() productData: ProductDto, @Req() request: any) {
    const uid = request.user.uid;
    const product = Object.assign({uid: uid, rating: 0}, productData);
    console.log("product ",product);
    console.log("variant ",product.variants);
    console.log("variant ",product.variants[0]);
    return this.productService.createProduct(product);
  }

  @Get('category/count')
  async productCountByCateogry(@Req() request: any) {
    const uid = request.user.uid;
    const countList:any = await this.productService.productCountByCateogry(uid);
    const countData = countList['count'];
    console.log("countList ",countData);
    let total = 0;
    countData.map((item:any) => {
      total = total + item.count;
    });
    let x = {
      "_id": null,
      "count": total,
      "name": "All"
    }
    countData.unshift(x);

    return countData;
  }

  @Get('uid')
  productByUid(@Req() request: any) {
    const uid = request.user.uid;
    console.log("productByUid uid ",uid);
    return this.productService.productByUid(uid);
  }

  @Get('/:id')
  productById(@Param('id') id: string) {
    console.log("ID >>  ",id);
    return this.productService.productById(id);
  }


  @Put('/:id')
  updateProduct(@Param('id') id: string, @Body() productData: ProductDto, @Req() request: any) {
    console.log("ID >>  ",id);
    console.log("productData >>  ",productData);
    console.log("request >>  ",request.user);
    const uid = request.user.uid;
    const product = Object.assign({uid: uid, rating: 0}, productData);
    return this.productService.updateProduct(uid, id, product);
  }
  

}
