import { IsString, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
    givenName: string;
    familyName: string;
    emailAddress: string;
    address: {
      addressLine1: string;
      addressLine2: string;
      locality: string;
      administrativeDistrictLevel1: string;
      postalCode: string;
      country: string;
    };
    phoneNumber: string;
    referenceId: string;
    note: string;
  }
  

  export class CustomerDto {
  
    @IsString()
    firstname: string;

    @IsString()
    lastname: string;
  
    @IsEmail()
    email: string;
  
    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto[];
  
    @IsString()
    phone: string;
  }
  
  export class AddressDto {
    @IsString()
    address_1: string;

    @IsString()
    address_2: string;
  
    @IsString()
    city: string;
  
    @IsString()
    state: string;
  
    @IsString()
    country: string;
  
    @IsString()
    postalcode: string;
  }