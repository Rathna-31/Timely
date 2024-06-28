import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async findAll(): Promise<any> {
        return await this.userModel.find().exec();
    }

    async create(userDto): Promise<User> {
        try {
            console.log('userDto', userDto);
            const createdUser = new this.userModel(userDto);
            return createdUser.save();
        }
        catch (error) {
            console.error('Failed to create user:', error);
            throw new Error('Failed to create user');
        }
    }

}
