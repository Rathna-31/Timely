// product.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
const ObjectId = Types.ObjectId;

@Injectable()
export class ProductService {

  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductDocument>,
  ) {}

  create(products: { name: any; price: any; quantity: any; }[]) {
    console.log(products);
      throw new Error('Method not implemented.');
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async createProduct(product: Product): Promise<Product> {
    const createdProduct = await new this.productModel(product);
    return createdProduct.save();
  }

  async createProducts(products: Product[]): Promise<Product[]> {
    console.log(products.length);
    const createdProducts = await this.productModel.insertMany(products);
    console.log("createdProducts ",createdProducts);
    return createdProducts;
  }

  async productCountByCateogry(uid): Promise<any> {
    const count = await this.productModel.aggregate([
        {
            '$match': {
                'uid': uid
            }
        }, {
            '$addFields': {
                'cid': {
                    '$toObjectId': '$categoryId'
                }
            }
        }, {
            '$lookup': {
                'from': 'categories', 
                'localField': 'cid', 
                'foreignField': '_id', 
                'as': 'cat'
            }
        }, {
            '$unwind': {
                'path': '$cat', 
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$group': {
                '_id': '$categoryId', 
                'count': {
                    '$sum': 1
                },
                // 'name': { '$first':'$cat.name' }
            }
        }
    ]);
    return {count};
  }

  async productByUid(uid): Promise<any> {
    console.log("UID >>  ", uid);
    const products = await this.productModel.aggregate(
      [
        {
            '$match': {
                'uid': uid
            }
        },
        {
          '$addFields': {
              'cid': {
                  '$toObjectId': '$categoryId'
              }
          }
        },
        {
          '$lookup': {
              'from': 'categories', 
              'localField': 'cid', 
              'foreignField': '_id', 
              'as': 'cat'
          }
        }, 
        {
          '$unwind': {
              'path': '$cat', 
              'preserveNullAndEmptyArrays': false
          }
        },
        {
            '$sort': {
                'categoryId': 1
            }
        }
    ]);
    return products;
  }


  async productById(id): Promise<any> {
    console.log("ID >>  ", new ObjectId(id));
    const products = await this.productModel.aggregate(
      [
        {
            '$match': {
                '_id': new ObjectId(id)
            }
        },
        {
          '$addFields': {
              'cid': {
                  '$toObjectId': '$categoryId'
              }
          }
        },
        {
          '$lookup': {
              'from': 'categories', 
              'localField': 'cid', 
              'foreignField': '_id', 
              'as': 'cat'
          }
        }, 
        {
          '$unwind': {
              'path': '$cat', 
              'preserveNullAndEmptyArrays': false
          }
        },
        {
            '$sort': {
                'categoryId': 1
            }
        }
    ]);
    return products;
  }

  // update the product with uid and product id
  async updateProduct(uid, id, product): Promise<any> {
    try{
      const updatedProduct = await this.productModel.findOneAndUpdate(
        { uid: uid, _id: new ObjectId(id) },
        { $set: product },
        { returnDocument: 'after' },
      );
      console.log("updatedProduct ", updatedProduct);
      return updatedProduct;
    }catch(err){
      console.log("err ", err);
      return err;
    }
  }

  // verify the user has atleast one product
  async verifyAtleastOneProduct(uid): Promise<any> {
    const count = await this.productModel.countDocuments({uid: uid});
    return count;
  }

}
