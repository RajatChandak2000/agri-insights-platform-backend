import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoClient, Db } from 'mongodb';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { error } from 'console';

@Injectable()
export class UserService {
    // constructor(@InjectModel(User.name) private userModel: Model<User>){}

    // async findUserByUsername(username: string): Promise<User | null>{
    //     return this.userModel.findOne({username}).exec();
    // }

    // async findAllUsers() : Promise<User[]>{
    //     return this.userModel.find().exec();
    // }

    // async createUser(username: string, password: string): Promise<User>{
    //     //check if the username is already available in the database, if so, throw error, if not, push it to DB
    //     const existingUser = await this.findUserByUsername(username);
    //     if (!existingUser) {
    //         const newUser = new this.userModel({ username, password });
    //         return newUser.save();
    //     }else{
    //         throw new HttpException('A user with this username already exists', HttpStatus.FORBIDDEN);
    //     }
    // }
}
