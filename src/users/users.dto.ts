import { IsNotEmpty, IsEmail, IsString, IsPhoneNumber, IsBoolean, IsDateString, IsUrl, IsOptional } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  @IsNotEmpty()
  @IsPhoneNumber('US')
  contactNumber: string;

  @IsBoolean()
  emailVerified: boolean;

  @IsUrl()
  @IsOptional()
  profile_pic: string;
}
