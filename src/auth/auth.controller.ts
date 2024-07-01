import { Body, Controller, Post} from "@nestjs/common";
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
    signin(@Body() dto: SignInDto): Promise<{accessToken: string}>{
        return this.authService.signin(dto);
    }
}