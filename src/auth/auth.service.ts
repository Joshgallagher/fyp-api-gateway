import { Injectable, UnprocessableEntityException, UnauthorizedException, Inject, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { LoginUserDto } from './dto/login-user.dto';
import { USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { UserServiceInterface } from '../services/interfaces/user-service.interface';

@Injectable()
export class AuthService implements OnModuleInit {
    private userService: UserServiceInterface;

    constructor(
        @Inject(USER_SERVICE_PROVIDER_TOKEN)
        private readonly client: ClientGrpc
    ) { }

    onModuleInit() {
        this.userService = this.client
            .getService<UserServiceInterface>('UserService');
    }

    /**
     * Log in a user with their provided credentials.
     * 
     * @param loginUserDto The required user credentials
     */
    public async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        try {
            return this.userService
                .authenticateUser({ email, password })
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

            throw new InternalServerErrorException();
        }
    }
}
