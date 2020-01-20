import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const userServiceConfig: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: '127.0.0.1:50052',
        package: 'user',
        protoPath: join(__dirname, '..', '..', '..', 'src', 'services', 'proto', 'user.proto'),
    },
};
