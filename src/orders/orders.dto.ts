import { IsDate, IsString, IsNumber, IsArray, IsNotEmpty, IsBoolean, IsDateString, IsPhoneNumber, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipientDto {
  @IsNotEmpty()
  displayName!: string;

  @IsNotEmpty()
  @IsPhoneNumber('US')
  phoneNumber!: string;
}

export class PickupDetailsDto {
  @IsNotEmpty()
  recipient!: RecipientDto;

  @IsNotEmpty()
  @IsDateString()
  pickupAt!: string;

  @IsNotEmpty()
  @IsBoolean()
  isCurbsidePickup!: boolean;
}

export class FulfillmentDto {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  pickupDetails!: PickupDetailsDto;
}


export class BasePriceMoneyDto {
  @IsNotEmpty()
  amount!: number;

  @IsNotEmpty()
  currency!: string;
}

export class LineItemDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  quantity!: string;

  @IsNotEmpty()
  @ValidateNested()
  basePriceMoney!: BasePriceMoneyDto;
}

export class TaxDto {
  @IsNotEmpty()
  uid!: string;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  percentage!: string;

  @IsNotEmpty()
  scope!: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  locationId!: string;

  @IsNotEmpty()
  referenceId!: string;

  @IsNotEmpty()
  customerId!: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  lineItems!: LineItemDto[];

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  taxes!: TaxDto[];

  @ValidateNested()
  discounts?: DiscountDto[];

  @ValidateNested()
  @IsNotEmpty()
  fulfillmentDto!: FulfillmentDto;
}





export class DiscountDto {
  // Add properties for discounts, if applicable
}

export enum FulfillmentType {
  PICKUP = 'PICKUP',
  // Add other fulfillment types, if applicable
}


// export class ItemDto {
//   @IsString()
//   id: string;

//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsNumber()
//   price: number;

//   @IsNumber()
//   quantity: number;
// }

// export class CustomerDto {
//   @IsString()
//   id: string;

//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   email: string;
// }

// export class PaymentDto {
//   @IsString()
//   id: string;

//   @IsNumber()
//   amount: number;

//   @IsString()
//   @IsNotEmpty()
//   method: string;
// }

// export class DeliveryAddressDto {
//   @IsString()
//   @IsNotEmpty()
//   address_line_1: string;

//   @IsString()
//   address_line_2: string;

//   @IsString()
//   @IsNotEmpty()
//   city: string;

//   @IsString()
//   @IsNotEmpty()
//   state: string;

//   @IsString()
//   @IsNotEmpty()
//   country: string;

//   @IsString()
//   @IsNotEmpty()
//   postal_code: string;
// }

// export class OrderDto {
//   @IsArray()
//   @ArrayNotEmpty()
//   @ValidateNested({ each: true })
//   @Type(() => ItemDto)
//   items: ItemDto[];

//   @ValidateNested()
//   @Type(() => CustomerDto)
//   customer: CustomerDto;

//   @ValidateNested()
//   @Type(() => PaymentDto)
//   payment: PaymentDto;

//   @ValidateNested()
//   @Type(() => DeliveryAddressDto)
//   deliveryAddress: DeliveryAddressDto;
// }


export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsNumber()
  itemQuantity: number;

  @IsNotEmpty()
  @IsString()
  itemVariation: string;
}


export class OrderDto {
  uid: string;

  customerName: string;

  customerPhone: string;


  orderType: string;


  orderStatus: 'ORDER RECEIVED' | 'PREPARING' | 'READY FOR PICKUP' | 'COMPLETED' | 'CANCELLED';


  orderDate: Date;


  orderTime: string;

  orderItems: OrderItemDto[];

  deliveryAddress: string;
}

export class OrderUpdateDto {

  @IsNotEmpty()
  @IsString()
  orderStatus: 'ORDER RECEIVED' | 'PREPARING' | 'READY FOR PICKUP' | 'COMPLETED' | 'CANCELLED';
}