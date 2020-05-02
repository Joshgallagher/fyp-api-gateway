import { Injectable, Inject, HttpService, HttpStatus, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RatingsService {
    private readonly headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    private baseUrl: string;

    constructor(
        @Inject('HttpService')
        private readonly httpService: HttpService,
        @Inject('ConfigService')
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('RATING_SERVICE_URL');
    }

    async create(token: string, createRatingDto: CreateRatingDto): Promise<object> {
        const headers = Object.assign({}, this.headers, { Authorization: token });

        let { articleId } = createRatingDto;
        let response: object;

        try {
            const { data } = await this.httpService
                .post(`${this.baseUrl}/ratings`, { articleId }, { headers })
                .toPromise();

            response = data;
        } catch ({ response }) {
            throw new InternalServerErrorException();
        }

        return response;
    }

    async findOne(articleId: number): Promise<object> {
        let response: object;

        try {
            const { data } = await this.httpService
                .get(`${this.baseUrl}/ratings/${articleId}`)
                .toPromise();

            response = data;
        } catch ({ response }) {
            throw new InternalServerErrorException();
        }

        return response;
    }

    async findByIds(articleIds): Promise<object> {
        let response: object;

        try {
            const { data } = await this.httpService
                .post(`${this.baseUrl}/ratings/users`, { articleIds }).toPromise();

            response = data;
        } catch ({ response }) {
            throw new InternalServerErrorException();
        }

        return response;
    }

    async userArticleRating(token: string, articleId: number): Promise<object> {
        const headers = { Authorization: token };

        let response: object;

        try {
            const { data } = await this.httpService
                .get(`${this.baseUrl}/ratings/${articleId}/user`, { headers })
                .toPromise();

            response = data;
        } catch ({ response }) {
            throw new InternalServerErrorException();
        }

        return response;
    }
}
