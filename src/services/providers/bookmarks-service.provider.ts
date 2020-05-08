import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { join } from 'path';

/**
 * The providers name.
 */
export const BOOKMARKS_SERVICE_PROVIDER_TOKEN = 'BOOKMARKS_SERVICE';

/**
 * Provides a gRPC client instance for the Bookmark Service.
 */
export const bookmarksServiceProvider = {
    provide: BOOKMARKS_SERVICE_PROVIDER_TOKEN,
    useFactory: (configService: ConfigService) => {
        const SERVICE_URL = configService.get<string>('BOOKMARKS_SERVICE_URL');

        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: SERVICE_URL,
                package: 'bookmarks',
                protoPath: join(__dirname, '../../bookmarks.proto')
            }
        });
    },
    inject: [ConfigService],
};

