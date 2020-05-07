import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    login(@Body() user: LoginUserDto) {
        return this.authService.login(user);
    }
}
