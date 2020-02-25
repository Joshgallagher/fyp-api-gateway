import { Injectable, HttpService, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { any } from 'bluebird';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticlesService {
    constructor(
        @Inject('ConfigService')
        private readonly configService: ConfigService,
        @Inject('HttpService')
        private readonly httpService: HttpService,
        @Inject('UserService')
        private readonly userService: UserService,
    ) { }

    async findAll() {
        const { data } = await this.httpService
            .get(`${this.configService.get<string>('ARTICLE_SERVICE_URL')}/articles`)
            .toPromise();

        let articles: Array<Record<any, any>> = [];

        for (let article of data) {
            const { name } = await this.userService.findOne(article.user_id);

            articles.push({ ...article, author: name });
        }

        return articles;
    }
}
