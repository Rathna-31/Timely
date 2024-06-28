import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { UserDTO } from './users.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get()
    findAll(): any {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() userDto:UserDTO): any {
        console.log('userDto', userDto);
        return this.userService.create(userDto);
    }
}
