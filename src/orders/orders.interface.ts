
// export interface Item {
//     id: number;
//     name: string;
//     price: number;
//     quantity: number;
//   }
  
//   export interface Customer {
//     id: number;
//     name: string;
//     email: string;
//   }
  
//   export interface Payment {
//     id: number;
//     amount: number;
//     method: string;
//   }
  

//   export interface DelveryAddress {
//     address_line_1: string;
//     address_line_2: string;
//     city: string;
//     state: string;
//     country: string;
//     postal_code: string;
//   }

//   export interface Order {
//     items: Item[];
//     customer: Customer;
//     payment: Payment;
//     address: DelveryAddress;
//   }


export interface Order {
  uid: string;
  customerName: string;
  customerPhone: string;
  orderType: string;
  orderStatus: string;
  orderDate: Date;
  orderTime: string;
  orderItems: OrderItem[];
  deliveryAddress: String;
}


export interface OrderItem {
  id: number;
  itemName: string;
  itemQuantity: number;
  itemVariation: string;
}