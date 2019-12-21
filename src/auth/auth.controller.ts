import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { OK } from 'http-status-codes';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    @Post('/login')
    @HttpCode(OK)
    login(@Body() loginAuthDto: LoginAuthDto) {
        return {};
    }
}
