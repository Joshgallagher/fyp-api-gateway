import { Injectable, Inject, HttpService, HttpStatus, InternalServerErrorException, ForbiddenException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../app.service';
import { RatingDto } from './dto/rating.dto';

@Injectable()
export class RatingsService extends AppService {
    private serviceBaseUrl: string;

    constructor(
        @Inject('HttpService')
        private readonly httpService: HttpService,
        @Inject('ConfigService')
        private readonly configService: ConfigService
    ) {
        super();

        this.serviceBaseUrl = this.configService.get<string>('RATING_SERVICE_URL');
    }

    /**
     * Create a rating for an article.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param ratingDto The article ID
     */
    public async create(token: string, ratingDto: RatingDto): Promise<object> {
        const headers = { ...this.requestHeaders, Authorization: token };
        const { articleId } = ratingDto;

        try {
            const { data } = await this.httpService
                .post(`${this.serviceBaseUrl}/ratings`, { articleId }, { headers })
                .toPromise();

            return data;
        } catch ({ response }) {
            const { status, data } = response;

            if (status === HttpStatus.FORBIDDEN) {
                throw new ForbiddenException({ data });
            }

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            throw new InternalServerErrorException();
        }
    }

    /**
     * Retrieves a specific article rating.
     * 
     * @param ratingDto The article ID
     */
    public async findOne(articleId: number): Promise<object> {
        const headers = this.requestHeaders;

        try {
            const { data } = await this.httpService
                .get(`${this.serviceBaseUrl}/ratings/${articleId}`, { headers })
                .toPromise();

            return data;
        } catch ({ response }) {
            const { status } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            throw new InternalServerErrorException();
        }
    }

    /**
     * Get the total users rating for a specified article.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param ratingDto The article ID
     */
    public async userArticleRating(token: string, articleId: number): Promise<object> {
        const headers = { ...this.requestHeaders, Authorization: token };

        try {
            const { data } = await this.httpService
                .get(`${this.serviceBaseUrl}/ratings/${articleId}/user`, { headers })
                .toPromise();

            return data;
        } catch ({ response }) {
            const { status } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            throw new InternalServerErrorException();
        }
    }

    /**
     * Retrieves article ratings from a list of article IDs.
     * 
     * @param articleIds An array of article IDs
     */
    public async findByIds(articleIds: number[]): Promise<object> {
        const headers = this.requestHeaders;

        try {
            const { data } = await this.httpService
                .post(`${this.serviceBaseUrl}/ratings/users`, { articleIds }, { headers })
                .toPromise();

            return data;
        } catch ({ response }) {
            const { status } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            throw new InternalServerErrorException();
        }
    }
}
