import { Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from '../user/schemas/user.schema';
import { SignInDto, SignUpDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup') 
    signup(@Body() dto: SignUpDto): Promise<User>{
        console.log("Called");
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: SignInDto): Promise<{accessToken: string, user:{username:string, email:string}}>{
        return this.authService.signin(dto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body('email') email:string): Promise<void>{
        return this.authService.sendPasswordResetLink(email);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    resetPassword(@Body() body: { token: string, password: string }): Promise<void> {
        console.log('Entered');
        const { token, password } = body;
        return this.authService.resetPassword(token, password);
    }
}