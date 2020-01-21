import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

    async create({ authorization }, { name, email, password }: CreateUserDto) {
        try {
            return await this.userService
                .registerUser(
                    { name, email, password },
                    (new Metadata()).add('authorization', authorization)
                )
                .toPromise();
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const error = errorMetadata.get('error')[0];

            if (details === 'VALIDATION_ERROR') {
                throw new UnprocessableEntityException(error);
            }
        }
    }
}
