import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto{
    
    @IsNotEmpty()
    @IsEmail()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    password: string
}