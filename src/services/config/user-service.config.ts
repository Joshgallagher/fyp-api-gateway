import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const userServiceConfig: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        // Docker service name with port
        url: 'user-service:50052',
        package: 'user',
        // This path points to the dist folder
        // TODO: Copy .proto files to dist automatically
        // If this service stops working, check that the dist has the .proto files
        protoPath: join(__dirname, '../../user.proto'),
    },
};
