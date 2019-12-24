import { Controller, Get, Param, Post, Body, Headers, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { grpcConfig } from '../services/config/grpc.config';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { Metadata, MetadataValue } from 'grpc';

@Controller('user')
export class UserController {
    @Client(grpcConfig)
    client: ClientGrpc;

    userService: any;

    onModuleInit() {
        this.userService = this.client.getService('UserService');
    }

    @Post()
    async create(@Headers() headers, @Body() createUserDto: CreateUserDto) {
        const { authorization } = headers;
        const { name, email, password } = createUserDto;

        const authMetadata = new Metadata();
        authMetadata.add('authorization', authorization);

        try {
            const response = await this.userService
                .registerUser({ name, email, password }, authMetadata)
                .toPromise();

            return response;
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const error = errorMetadata.get('error')[0];

            if (details === 'VALIDATION_ERROR') {
                throw new UnauthorizedException(error);
            }
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return {
            id,
            name: 'Josh'
        };
    }
}
