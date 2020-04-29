import { Injectable, UnprocessableEntityException, NotFoundException, UnauthorizedException, OnModuleInit, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { UserServiceInterface } from '../services/interfaces/user-service.interface';

@Injectable()
export class UserService implements OnModuleInit {
    private userService: UserServiceInterface;

    constructor(@Inject(USER_SERVICE_PROVIDER_TOKEN) private readonly client: ClientGrpc) { }

    onModuleInit() {
        this.userService = this.client.getService<UserServiceInterface>('UserService');
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

            throw new InternalServerErrorException();
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

            throw new InternalServerErrorException();
        }
    }

    async findByIds(ids: string[]) {
        return await this.userService.getUsersById({ ids }).toPromise();
    }
}
