import { HttpService, HttpStatus, Inject, Injectable, InternalServerErrorException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../app.service';
import { UserService } from '../user/user.service';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService extends AppService {
    private serviceBaseUrl: string;

    constructor(
        @Inject('ConfigService')
        readonly configService: ConfigService,
        @Inject('HttpService')
        private readonly httpService: HttpService,
        @Inject('UserService')
        private readonly userService: UserService
    ) {
        super();

        this.serviceBaseUrl = this.configService
            .get<string>('COMMENT_SERVICE_URL');
    }

    /**
     * Create a comment for a specific article.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param commenDto Contains the article ID and comment
     */
    public async create(token: string, commenDto: CommentDto): Promise<object> {
        const { articleId, comment } = commenDto;
        const headers = { ...this.requestHeaders, Authorization: token };

        let id: string;

        try {
            const { data } = await this.httpService
                .post(`${this.serviceBaseUrl}/comments`, { articleId, comment }, { headers })
                .toPromise();

            id = data.id;
        } catch ({ response }) {
            const { status, data } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
                throw new UnprocessableEntityException({ data });
            }

            throw new InternalServerErrorException();
        }

        return { id };
    }

    /**
     * Retrieves all comments for a specific article.
     * 
     * @param id The article ID
     */
    public async findAll(id: number): Promise<object[]> {
        const headers = this.requestHeaders;

        let comments: any;

        try {
            const { data } = await this.httpService
                .get(`${this.serviceBaseUrl}/comments/article/${id}`, { headers })
                .toPromise();

            comments = data;
        } catch ({ response }) {
            const { status } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            throw new InternalServerErrorException();
        }

        let users: any;

        try {
            const commenters: string[] = comments.map(({ userId }) => userId);
            const { users: commentUsers } = await this.userService.findByIds(commenters);

            users = commentUsers;
        } catch (e) {
            users = [];
        }

        comments = comments.map((comment: Record<string, any>) => {
            const { name } = users.find(({ id }) => comment.userId === id)
                || { name: 'Pondr User' };

            return { ...comment, name };
        });

        return comments;
    }

    /**
     * Update an article by it's ID.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param id The article ID
     * @param commenDto Contains the article ID and comment
     */
    public async update(
        token: string,
        id: string,
        commenDto: CommentDto
    ): Promise<void> {
        const { articleId, comment } = commenDto;
        const headers = { ...this.requestHeaders, Authorization: token };

        try {
            await this.httpService
                .put(`${this.serviceBaseUrl}/comments/${id}`,
                    { articleId, comment },
                    { headers }
                )
                .toPromise();
        } catch ({ response }) {
            const { status, data } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
                throw new UnprocessableEntityException({ data });
            }

            throw new InternalServerErrorException();
        }
    }

    /**
     * Delete an article by it's ID.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param id The article ID
     */
    public async delete(token: string, id: string): Promise<void> {
        const headers = { ...this.requestHeaders, Authorization: token };

        try {
            await this.httpService
                .delete(`${this.serviceBaseUrl}/comments/${id}`, { headers })
                .toPromise();
        } catch ({ response }) {
            const { status } = response;

            if (status === HttpStatus.UNAUTHORIZED) {
                throw new UnauthorizedException();
            }

            throw new InternalServerErrorException();
        }
    }
}
