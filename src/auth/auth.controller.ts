import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { OK } from 'http-status-codes';
import { IndexAuthDto } from './dto/index-auth.dto';

@Controller('auth')
export class AuthController {
    @Post()
    @HttpCode(OK)
    index(@Body() indexAuthDto: IndexAuthDto) {
        return {};
    }
}
