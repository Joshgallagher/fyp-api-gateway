import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    public USER_SERVICE_INCLUDE = 'USER_SERVICE_INCLUDE';
    public RATINGS_SERVICE_INCLUDE = 'RATINGS_SERVICE_INCLUDE';

    protected readonly requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    public hasInclude(includes, include) {
        return includes.indexOf(include) > -1;
    }
}
