import { Injectable, UnprocessableEntityException, NotFoundException, UnauthorizedException, OnModuleInit, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { UserServiceInterface } from '../services/interfaces/user-service.interface';

@Injectable()
export class UserService implements OnModuleInit {
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
     * Creates a new user from a provided name and email.
     * 
     * @param createUserDto Conatins the new users name, email and password
     */
    public async create(createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto;

        try {
            const response = await this.userService
                .registerUser({ name, email, password })
                .toPromise();

            return response;
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

    /**
     * Find a user by their UUID.
     * 
     * @param id The users UUID
     */
    public async findOne(id: string) {
        try {
            const user = await this.userService
                .getUser({ id })
                .toPromise();

            return user;
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const message = errorMetadata.get('error')[0];

            if (details === 'NOT_FOUND_ERROR') {
                throw new NotFoundException(message);
            }

            throw new InternalServerErrorException();
        }
    }

    /**
     * Finds a set of users by their UUIDs.
     * 
     * @param ids Array of UUIDs
     */
    public async findByIds(ids: string[]) {
        const users = await this.userService
            .getUsersById({ ids })
            .toPromise();

        return users;
    }
}
