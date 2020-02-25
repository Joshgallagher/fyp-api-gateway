import { Injectable, UnprocessableEntityException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { userServiceConfig } from '../services/config/user-service.config';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    @Client(userServiceConfig)
    client: ClientGrpc;

    userService: any;

    onModuleInit() {
        this.userService = this.client.getService('UserService');
    }

    async create({ name, email, password }: CreateUserDto) {
        try {
            return await this.userService
                .registerUser({ name, email, password })
                .toPromise();
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const message = errorMetadata.get('error')[0];
            const field = errorMetadata.get('field')[0];

            if (details === 'VALIDATION_ERROR') {
                throw new UnprocessableEntityException({ field, message });
            }

            if (details === 'UNAUTHENTICATED_ERROR') {
                throw new UnauthorizedException(message);
            }
        }
    }

    async findOne(id: string) {
        try {
            return await this.userService.getUser({ id }).toPromise();
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const message = errorMetadata.get('error')[0];

            if (details === 'NOT_FOUND_ERROR') {
                throw new NotFoundException(message);
            }
        }
    }
}
