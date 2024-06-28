import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateOrderDto, OrderDto, OrderUpdateDto } from './orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(createOrderDto);
    return { order };
  }

  @Post('placeorder')
  async placeOrder(@Body() OrderDto: any) {
    console.log('OrderDto--->', OrderDto);
    const order = await this.ordersService.placeOrder(OrderDto);
    return { order };
  }

  // @Get()
  // async findAll(@Req() request: any) {
  //   const uid = request.user.uid;
  //   const orders = await this.ordersService.findAll(uid);
  //   return { orders };
  // }

  @Get()
  async findAllOrders(@Req() request: any) {
    const orders = await this.ordersService.findAllOrders();
    return orders;
  }

  @Get('/latestOrder')
  async latestOrder(@Req() request: any) {
    const uid = request.user.uid;
    const order = await this.ordersService.latestOrder(uid);
    return { order };
  }

  @Put('/updateOrderStatus/:orderId')
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() orderUpdateDto: OrderUpdateDto, @Req() request: any) {
    const uid = request.user.uid;
    const order = await this.ordersService.updateOrderStatus(orderId, orderUpdateDto.orderStatus);
    return { order };
  }

  @Put('/removeItemFromOrder/:orderId/:productId')
  async removeItemFromOrder(@Param('orderId') orderId: string, @Param('productId') productId: string, @Req() request: any) {
    const uid = request.user.uid;
    const order = await this.ordersService.removeItemFromOrder(orderId, productId);
    return { order };
  }

  @Get('/getOrderStats')
  async getOrderStats(@Req() request: any) {
    const uid = request.user.uid;
    const orderReceived = await this.ordersService.findOrdersWithStatusOrderReceived(uid);
    const orderPreparing = await this.ordersService.findOrdersWithStatusOrderPreparing(uid);
    return {
      orderReceivedCount: orderReceived.length,
      orderPreparingCount: orderPreparing.length
    };
  }

}
