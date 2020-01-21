import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    @Post()
    @HttpCode(HttpStatus.OK)
    login(@Body() loginUserDto: LoginUserDto) {
        return {};
    }
}
