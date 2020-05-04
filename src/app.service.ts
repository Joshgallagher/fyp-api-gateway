import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    protected readonly requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}
