import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    public static readonly USER_SERVICE_INCLUDE = 'USER_SERVICE_INCLUDE';
    public static readonly RATINGS_SERVICE_INCLUDE = 'RATINGS_SERVICE_INCLUDE';

    private readonly requestHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    /**
     * Performs a check to see if a given include is provided.
     * 
     * @param includes Service includes requested
     * @param include Include to check for
     */
    public hasInclude(includes: string[], include: string) {
        return includes.indexOf(include) > -1;
    }
}
