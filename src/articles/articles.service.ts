import { Injectable, HttpService, Inject, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesService implements OnModuleInit {
    private articleServiceURL: string;

    constructor(
        @Inject('ConfigService')
        private readonly configService: ConfigService,
        @Inject('HttpService')
        private readonly httpService: HttpService,
        @Inject('UserService')
        private readonly userService: UserService,
    ) { }

    onModuleInit() {
        this.articleServiceURL = this.configService.get<string>('ARTICLE_SERVICE_URL');
    }

    async create(
        token: string,
        article: Record<string, any>
    ): Promise<object> {
        const { data } = await this.httpService
            .post(`${this.articleServiceURL}/articles`, article, {
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
        const { data } = await this.httpService
            .get(`${this.articleServiceURL}/articles`)
            .toPromise();

        let articles: Array<Record<any, any>> = [];

        for (let article of data) {
            const { name } = await this.userService.findOne(article.user_id);

            articles.push({ ...article, author: name });
        }

        return articles;
    }

    async findAllByUser(userId: string): Promise<Array<object>> {
        const { data } = await this.httpService
            .get(`${this.articleServiceURL}/articles/user/${userId}`)
            .toPromise();

        let articles: Array<Record<any, any>> = [];

        for (let article of data) {
            const { name } = await this.userService.findOne(article.user_id);

            articles.push({ ...article, author: name });
        }

        return articles;
    }

    async findOne(slug: string): Promise<object> {
        const { data } = await this.httpService
            .get(`${this.articleServiceURL}/articles/${slug}`)
            .toPromise();

        const { name } = await this.userService.findOne(data.user_id);

        data['author'] = name;

        return data;
    }

    async update(
        token: string,
        slug: string,
        article: Record<string, any>
    ): Promise<object> {
        const { data } = await this.httpService
            .put(`${this.articleServiceURL}/articles/${slug}`, article, {
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

    async delete(
        token: string,
        slug: string
    ): Promise<void> {
        const { data } = await this.httpService
            .delete(`${this.articleServiceURL}/articles/${slug}`, {
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
