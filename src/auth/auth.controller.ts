import { Controller, Post, Body } from '@nestjs/common';
import { IndexAuthDto } from './dto/index-auth.dto';

@Controller('auth')
export class AuthController {
    @Post()
    index(@Body() indexAuthDto: IndexAuthDto) {
        return {};
    }
}
