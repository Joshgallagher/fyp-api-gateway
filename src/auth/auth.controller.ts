import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { OK } from 'http-status-codes';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    @Post('/login')
    @HttpCode(OK)
    login(@Body() loginUserDto: LoginUserDto) {
        return {};
    }
}
