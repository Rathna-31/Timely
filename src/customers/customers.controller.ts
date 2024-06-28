import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, CustomerDto } from './customers.dto';
import { ProductService } from 'src/products/products.service';
import { OrdersService } from 'src/orders/orders.service';

@Controller('customers')
export class CustomersController {

    constructor(
        private readonly customersService: CustomersService,
        private readonly productService: ProductService,
        private readonly ordersService: OrdersService,
        ) {}

    @Post()
    async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
        const customer = await this.customersService.createCustomer(createCustomerDto);
        return { customer };
    }

    @Post('create')
    async create(@Body() customerDto: CustomerDto, @Req() request: any) {
        console.log(request.user);
        console.log(customerDto);
        const customer = Object.assign(customerDto, { uid: request.user.uid });
        return await this.customersService.create(customer);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() customerDto: CustomerDto, @Req() request: any) {
        console.log(customerDto);
        console.log(id);
        const customer = Object.assign(customerDto, { uid: request.user.uid });
        return await this.customersService.update(id, customer);
    }

    @Get()
    async findAll() {
        return await this.customersService.findAll();
    }

    // verify the user bought phone number
    // verify the user has added menu and restaurant details
    // verify the user has atleast one order

    @Get('/isProfileComplete')
    async isProfileComplete(@Req() request: any) {
        console.log(request.user);
        const uid = request.user.uid;
        // const validatePhoneNumber = await this.customersService.validatePhoneNumber(uid);
        const validatePhoneNumber = false;
        // const validateRestaurantDetails = await this.customersService.validateRestaurantDetails(uid);
        const validateRestaurantDetails = false;
        const validateMenu = await this.productService.verifyAtleastOneProduct(uid);
        const validateOrders = await this.ordersService.verifyAtleastOneOrder(uid);

        let count = 0;
        if(validatePhoneNumber && validateRestaurantDetails && validateMenu > 0 && validateOrders > 0) {
            count = 4;
        } else if(validatePhoneNumber && validateRestaurantDetails && validateMenu > 0) {
            count = 3;
        } else if(validatePhoneNumber && validateRestaurantDetails) {
            count = 2;
        } else if(validatePhoneNumber) {
            count = 1;
        } else {
            count = 0;
        }

        return {stepsCompleted: count};
    }
    

}
