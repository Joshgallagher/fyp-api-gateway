import { Injectable, HttpService, Inject, OnModuleInit, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class ArticlesService {
    constructor(
        @Inject('HttpService')
        private readonly httpService: HttpService,
        @Inject('UserService')
        private readonly userService: UserService,
    ) { }

    async create(
        token: string,
        article: Record<string, any>
    ): Promise<object> {
        const { data } = await this.httpService
            .post('articles', article, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: token
                }
            })
            .toPromise();

        const { name } = await this.userService.findOne(data.user_id);

        data['author'] = name;

        return data;
    }

    async findAll(): Promise<Array<object>> {
        const { data } = await this.httpService.get('articles').toPromise();
        const authorIds: string[] = data.map(({ user_id }) => user_id);
        const { users } = await this.userService.findUsersByIds(authorIds);

        let articles: Array<Record<any, any>> = [];

        for (let article in data) {
            const { name } = users.find(({ id }) => data[article].user_id === id);

            articles.push({ ...data[article], author: name });
        }

        return articles;
    }

    async findAllByUser(userId: string): Promise<Array<object>> {
        const { data } = await this.httpService.get(`articles/user/${userId}`).toPromise();
        const { name } = await this.userService.findOne(userId);

        const articles = data.map((article: Record<string, any>) => ({ ...article, author: name }));

        return articles;
    }

    async findOne(slug: string, includeAuthor: boolean = true): Promise<object> {
        let article: any;

        try {
            const { data } = await this.httpService.get(`articles/${slug}`).toPromise();

            article = data;
        } catch ({ response }) {
            const { statusCode, message } = response.data;

            if (statusCode === HttpStatus.NOT_FOUND) {
                throw new NotFoundException({ message });
            }

            throw new InternalServerErrorException();
        }

        if (includeAuthor) {
            const { name } = await this.userService.findOne(article.user_id);

            article['author'] = name;
        }

        return article;
    };

    async update(token: string, slug: string, article: Record<string, any>): Promise<object> {
        const { data } = await this.httpService
            .put(`articles/${slug}`, article, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: token
                }
            })
            .toPromise();

        const { name } = await this.userService.findOne(data.user_id);

        data['author'] = name;

        return data;
    }

    async delete(token: string, slug: string): Promise<void> {
        const { data } = await this.httpService
            .delete(`articles/${slug}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: token
                }
            })
            .toPromise();

        return data;
    }
}
