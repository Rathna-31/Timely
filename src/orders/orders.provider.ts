import { Mongoose } from 'mongoose';
import { OrderSchema } from './orders.schema';

export const ordersProviders = [
  {
    provide: 'ORDERS_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Orders', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];