import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";
import { Transport } from "@nestjs/common/enums/transport.enum";
import { join } from "path";

export const USER_SERVICE_PROVIDER_TOKEN = 'USER_SERVICE';

export const userServiceProvider = {
    provide: USER_SERVICE_PROVIDER_TOKEN,
    useFactory: (configService: ConfigService) => {
        const SERVICE_URL = configService.get<string>('USER_SERVICE_URL');
        const PROTO_PACKAGE = configService.get<string>('USER_SERVICE_PROTO_PACKAGE');

        return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
                url: SERVICE_URL,
                package: PROTO_PACKAGE,
                protoPath: join(__dirname, '../../user.proto')
            }
        });
    },
    inject: [ConfigService],
};
