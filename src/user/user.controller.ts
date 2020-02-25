import { Controller, Get, Param, Post, Body, Headers } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() user: CreateUserDto) {
        return await this.userService.create(user);
    }

    @Get(':id')
    async findOne(@Headers() headers, @Param('id') id: string) {
        return await this.userService.findOne(id);
    }
}
