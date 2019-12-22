import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return {};
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return {
            id,
            name: 'Josh'
        };
    }
}
