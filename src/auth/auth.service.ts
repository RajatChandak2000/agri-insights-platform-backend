import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from "./dto";
import * as argon2 from 'argon2'
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/schemas/user.schema";
import { Model } from "mongoose";

@Injectable()
export class AuthService{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>, 
        private jwtService: JwtService
    ){}

    async signup(dto: AuthDto): Promise<User>{
        const { username, password } = dto;
        try{
            const hashedPassword = await argon2.hash(password);
            const newUser = await new this.userModel({ username, password: hashedPassword });
            const savedUser = await newUser.save();
            
            // Convert the document to a plain JavaScript object
            const userObj = savedUser.toObject();
            // Remove the password field
            delete userObj.password;
            return userObj;
        }catch(error){
            if (error.name === "MongoServerError" && error.code === 11000) {
                // Handle duplicate key error
                throw new ForbiddenException('Credentials taken')
            }else {
                throw error; // Re-throw if it's an instance of HttpException
            }
        }
    }

    async signin(dto: AuthDto): Promise<{accessToken: string}>{
        const { username, password } = dto;
        const user = await this.userModel.findOne({username}).exec();

        if(!user || !(await argon2.verify(user.password, password))){
            throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
        }
        const payload = { username: user.username, sub: user._id };
        const accessToken = await this.jwtService.sign(payload);
        return {accessToken};
    }
}