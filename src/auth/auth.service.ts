import { ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2'
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/schemas/user.schema";
import { Model } from "mongoose";
import { SignInDto, SignUpDto } from "./dto";

@Injectable()
export class AuthService{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>, 
        private jwtService: JwtService
    ){}

    async signup(dto: SignUpDto): Promise<User>{
        const { username, email, password } = dto;
        try{
            const hashedPassword = await argon2.hash(password);
            const newUser = await new this.userModel({ username, email, password: hashedPassword });
            const savedUser = await newUser.save();
            
            // Convert the document to a plain JavaScript object
            const userObj = savedUser.toObject();
            // Remove the password field
            delete userObj.password;
            return userObj;
        }catch(error){
            if (error.name === "MongoServerError" && error.code === 11000) {
                // Handle duplicate key error
                if (error.keyValue && error.keyValue.username) {
                    throw new ForbiddenException('Username is already taken');
                }else if(error.keyValue && error.keyValue.email){
                    throw new ForbiddenException('Email is already taken');
                }
            }else {
                throw error; // Re-throw if it's an instance of HttpException
            }
        }
    }

    async signin(dto: SignInDto): Promise<{accessToken: string, user:{username:string, email:string}}>{
        const { email, password } = dto;
        const user = await this.userModel.findOne({email}).exec();

        if(!user || !(await argon2.verify(user.password, password))){
            throw new HttpException('Invalid Credentials', HttpStatus.FORBIDDEN);
        }
        const payload = { email: user.email, sub: user._id };
        const accessToken = await this.jwtService.sign(payload);
        return {
            accessToken,
            user:{
                username: user.username,
                email: user.email
            }
        };
    }
}