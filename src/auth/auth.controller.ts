import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { User } from '../user/schemas/user.schema';
import { JwtAuthGuard } from './guards'
import { GetUser } from "./decorator";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: AuthDto): Promise<User>{
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto): Promise<{accessToken: string}>{
        return this.authService.signin(dto);
    }
}