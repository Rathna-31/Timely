import { Inject, Injectable } from '@nestjs/common';
import { Client, Environment } from 'square';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customers.schema';
import { MailerService } from '../mailer/mailer.service'

const Pusher = require("pusher");


@Injectable()
export class CustomersService {

  private readonly squareClient: Client;
  private readonly squareAccessToken: string;
  private readonly adminEmail: string;
  private readonly newRegistration: string;
  
  private readonly pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
  });

  constructor(private readonly configService: ConfigService, 
              @InjectModel('Customer') private readonly customerModel: Model<Customer>,
              @Inject(MailerService) private readonly mailerService: MailerService) {

    this.squareAccessToken = this.configService.get<string>('SQUARE_ACCESS_TOKEN');

    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    this.newRegistration = this.configService.get<string>('SENDGRID_NEW_REG_TEMPLATE_ID');
    
    console.log('this.squareAccessToken', this.squareAccessToken);
    this.squareClient = new Client({
      environment: Environment.Production, // Replace with Environment.Production for production use
      accessToken: this.squareAccessToken,
    });
  }

  async createCustomer(requestBody){
    try {
      const response = await this.squareClient.customersApi.createCustomer(requestBody);
      console.log('response', response);
      const customer = {
        id: response.result.customer.id,
        phoneNumber: response.result.customer.phoneNumber,
        referenceId: response.result.customer.referenceId,
      }
      return customer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async create(customerDto): Promise<Customer> {
    const customer = Object.assign({active:true}, customerDto);
    console.log('customer', customer);
    const createdCustomer = new this.customerModel(customer);
    if(createdCustomer.save()){
      const emailData = {
        recipient: customerDto.email,
        sender: this.adminEmail,
        templateId: this.newRegistration,
        dynamic_template_data: {
          subject: 'Congratulations! You\'ve a new registration',
          email: customerDto.email,
        },
      };
      await this.mailerService.sendEmail(emailData);
      return createdCustomer;
    }
    else{
      throw new Error('Failed to create customer');
    }
  }

  async update(customerId: string, customerDto): Promise<Customer> {
    console.log('customerId', customerId);
    console.log('customer', customerDto);
    try{
      const updatedCustomer = await this.customerModel.findByIdAndUpdate(
        customerId,
        { $set: customerDto },
        { new: true }
      );
    
      return updatedCustomer;
    }
    catch(error){
      console.error('Failed to update customer:', error);
      throw new Error('Failed to update customer');
    }
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

//   async retrieveCustomer(customerId: string): Promise<any> {
//     try {
//       const response = await this.squareClient.customersApi.retrieveCustomer(customerId);
//       return response.result.customer;
//     } catch (error) {
//       console.error('Failed to retrieve customer:', error);
//       throw new Error('Failed to retrieve customer');
//     }
//   }

//   async updateCustomer(customerId: string, firstName: string, lastName: string, email: string): Promise<any> {
//     try {
//       const requestBody = {
//         given_name: firstName,
//         family_name: lastName,
//         email_address: email,
//       };

//       const response = await this.squareClient.customersApi.updateCustomer(customerId, requestBody);
//       return response.result.customer;
//     } catch (error) {
//       console.error('Failed to update customer:', error);
//       throw new Error('Failed to update customer');
//     }
//   }

//   async deleteCustomer(customerId: string): Promise<void> {
//     try {
//       await this.squareClient.customersApi.deleteCustomer(customerId);
//     } catch (error) {
//       console.error('Failed to delete customer:', error);
//       throw new Error('Failed to delete customer');
//     }
//   }
}
