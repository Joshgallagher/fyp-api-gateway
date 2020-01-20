import { Controller, Get, Param, Post, Body, Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Headers() headers, @Body() user: CreateUserDto) {
        return await this.userService.create(headers, user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return {
            id,
            name: 'Josh'
        };
    }
}
