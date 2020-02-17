import { Injectable, UnprocessableEntityException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { userServiceConfig } from '../services/config/user-service.config';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    @Client(userServiceConfig)
    client: ClientGrpc;

    userService: any;

    onModuleInit() {
        this.userService = this.client.getService('UserService');
    }

    async login({ email, password }: LoginUserDto) {
        try {
            return await this.userService
                .authenticateUser(
                    { email, password },
                )
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
}
