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

    async login({ authorization }, { email, password }: LoginUserDto) {
        try {
            return await this.userService
                .authenticateUser(
                    { email, password },
                    (new Metadata()).add('authorization', authorization)
                )
                .toPromise();
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const error = errorMetadata.get('error')[0];

            if (details === 'UNAUTHENTICATED_ERROR') {
                throw new UnauthorizedException(error);
            }
        }
    }
}
