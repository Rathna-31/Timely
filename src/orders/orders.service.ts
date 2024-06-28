import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Client, Environment } from 'square';
import { Order, OrderDocument } from './orders.schema';
import { Model, Types } from 'mongoose';
const Pusher = require("pusher");
const ObjectId = Types.ObjectId;

@Injectable()
export class OrdersService {

  private readonly squareClient: Client;
  private readonly squareAccessToken: string;
  private readonly pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
  });;

  constructor(private readonly configService: ConfigService, @InjectModel(Order.name) private orderModel: Model<OrderDocument>) {

    this.squareAccessToken = this.configService.get<string>('SQUARE_ACCESS_TOKEN');
    // Initialize Orders client
    this.squareClient = new Client({
      environment: Environment.Production, // Replace with Environment.Production for production use
      accessToken: this.squareAccessToken,
    });
  }

  async createOrder(orderData: any): Promise<any> {
    try {
      const idempotenceKey = require('crypto').randomBytes(64).toString('hex');
      const order = {
        idempotencyKey: idempotenceKey,
        order: orderData
      };
      console.log('order', order);
      const response = await this.squareClient.ordersApi.createOrder(order);
      console.log('response', response.result.order);
      return response.result.order.id;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create order ' + error);
    }
  }

  async placeOrder(orderDetails: any): Promise<any> {
    try {
      console.log('orderDetails');
      console.log(orderDetails);
      // add uid to body

      const order = await this.orderModel.create(orderDetails);

      // const userId = 'JG1h0qLjP7WZQHp8nKweQniafhy1';
      // console.log('userId', userId);
      // const userId = body.uid;
      // this.pusher.trigger(userId, "orderUpdate", {
      //   title: "A new order has been placed",
      //   message: "Please check your orders page for more details"
      // });
      console.log('pusher', this.pusher);
      return order;
    }
    catch (error) {
      console.log('error', error);
      throw new Error('Failed to place order');
    }
  }

  async findAllOrders(): Promise<any> {
    try {
      const orders = await this.orderModel.find().exec();
      return orders;
    }
    catch (error) {
      console.log('error', error);
      throw new Error('Failed to find orders');
    }
  }

  async findAll(uid): Promise<any> {
    try {
      const orders = await this.orderModel.find({ uid: uid }).exec();
      return orders;
    }
    catch (error) {
      console.log('error', error);
      throw new Error('Failed to find orders');
    }
  }

  // verify user atleast has one order
  async verifyAtleastOneOrder(uid: string): Promise<any> {
    const count = await this.orderModel.countDocuments({ uid: uid });
    console.log('count', count);
    return count;
  }

  async latestOrder(uid: string): Promise<any> {
    const order = await this.orderModel.find({ uid: uid }).sort({ createdAt: 1 }).limit(2);
    console.log('order', order);
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const order = await this.orderModel.findOneAndUpdate({ _id: new ObjectId(orderId) }, { orderStatus: status }, { new: true });
    console.log('order', order);
    return order;
  }

  async removeItemFromOrder(orderId: string, itemId: string): Promise<any> {
    console.log('orderId', orderId);
    console.log('itemId', itemId);
    const orderItem = await this.orderModel.findOne({ _id: new ObjectId(orderId) });
    console.log('orderItem', orderItem);
    const item = orderItem['orderItems'].filter(item => item.id == parseInt(itemId));
    console.log('item', item);
    const order = await this.orderModel.findOneAndUpdate({ _id: new ObjectId(orderId) }, { $pull: { orderItems: item[0] } }, { new: true });
    console.log('order', order);
    return order;
  }

  // find orders with status ORDER RECEIVED created today
  async findOrdersWithStatusOrderReceived(uid: string): Promise<any> {

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    console.log('today', today);
    console.log('tomorrow', tomorrow);

    const orders = await this.orderModel.find({
      uid: uid,
      orderStatus: 'ORDER RECEIVED',
      orderDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    console.log('orders', orders);
    return orders;
  }

  async findOrdersWithStatusOrderPreparing(uid: string): Promise<any> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const orders = await this.orderModel.find({
      uid: uid,
      orderStatus: 'PREPARING',
      orderDate: {
        $gte: today,
        $lt: tomorrow
      }
    });
    console.log('orders', orders);
    return orders;
  }

}
