import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const userServiceConfig: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'bookmark-service:7272',
        package: 'bookmarks',
        protoPath: join(__dirname, '../../bookmarks.proto'),
    },
};
