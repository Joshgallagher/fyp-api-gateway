import { Injectable, HttpService, Inject, HttpStatus, NotFoundException, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ArticleDto } from './dto/article.dto';
import { ConfigService } from '@nestjs/config';
import { RatingsService } from 'src/ratings/ratings.service';

@Injectable()
export class ArticlesService {
  private readonly headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  private baseUrl: string;

  constructor(
    @Inject('HttpService')
    private readonly httpService: HttpService,
    @Inject('ConfigService')
    private readonly configService: ConfigService,
    @Inject('UserService')
    private readonly userService: UserService,
    @Inject('RatingsService')
    private readonly ratingsService: RatingsService
  ) {
    this.baseUrl = this.configService.get<string>('ARTICLE_SERVICE_URL');
  }

  async create(token: string, articleDto: ArticleDto): Promise<object> {
    const { title, body } = articleDto;

    let article: Record<string, any>;
    let authorName: string;

    try {
      const headers = Object.assign({}, this.headers, { Authorization: token });
      const { data } = await this.httpService.post(`${this.baseUrl}/articles`, { title, body }, { headers }).toPromise();
      const { name } = await this.userService.findOne(data.userId);

      article = data;
      authorName = name;
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
        throw new UnprocessableEntityException(message);
      }

      throw new InternalServerErrorException();
    }

    article['author'] = authorName;

    return article;
  }

  async findAll(): Promise<object[]> {
    let articles: any;
    let authors: any;
    let ratings: any;

    try {
      const { data } = await this.httpService.get(`${this.baseUrl}/articles`).toPromise();
      const articleIds: any = data.map(({ id }) => id);
      const authorIds: string[] = data.map(({ userId }) => userId);

      const { users } = await this.userService.findByIds(authorIds);
      const r = await this.ratingsService.findByIds(articleIds);

      articles = data;
      authors = users;
      ratings = r;
    } catch (e) {
      return [];
    }

    const aggregate = articles.map((article: Record<string, any>) => {
      const { name } = authors.find(({ id }) => article.userId === id);
      const { rating } = ratings.find(({ articleId }) => article.id === articleId) || { rating: 0 };

      return { ...article, author: name, rating };
    });

    return aggregate;
  }

  async findByIds(articleIds: number[]): Promise<object[]> {
    const { data } = await this.httpService.post(`${this.baseUrl}/articles/all`, { articleIds }, { headers: this.headers }).toPromise();
    const authorIds: string[] = data.map(({ userId }) => userId);
    const { users } = await this.userService.findByIds(authorIds);

    let articles: Array<Record<any, any>> = [];

    for (let article in data) {
      const { name } = users.find(({ id }) => data[article].userId === id);

      articles.push({ ...data[article], author: name });
    }

    return articles;
  }

  async findAllByUser(userId: string): Promise<Array<object>> {
    const { data } = await this.httpService
      .get(`${this.baseUrl}/articles/user/${userId}`)
      .toPromise();
    const articleIds: any = data.map(({ id }) => id);

    const { name } = await this.userService.findOne(userId);
    const ratings: any = await this.ratingsService.findByIds(articleIds);

    const articles = data.map((article: Record<string, any>) => {
      const { rating } = ratings.find(({ articleId }) => article.id === articleId) || { rating: 0 };


      return { ...article, author: name, rating };
    });

    return articles;
  }

  async findOne(slug: string, includeAuthor: boolean = true): Promise<object> {
    let article: Record<string, any>;
    let rating: number;

    try {
      const { data } = await this.httpService
        .get(`${this.baseUrl}/articles/${slug}`)
        .toPromise();
      const { rating: r }: any = await this.ratingsService.findOne(data.id);

      article = data;
      rating = r;
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException({ message });
      }

      throw new InternalServerErrorException();
    }

    article['rating'] = rating;

    if (includeAuthor) {
      const { name } = await this.userService.findOne(article.userId);

      article['author'] = name;
    }

    return article;
  };

  async update(token: string, slug: string, articleDto: ArticleDto): Promise<object> {
    const { title, body } = articleDto;

    let article: Record<string, any>;
    let authorName: string;

    try {
      const headers = Object.assign({}, this.headers, { Authorization: token });
      const { data } = await this.httpService
        .put(`${this.baseUrl}/articles/${slug}`, { title, body }, { headers })
        .toPromise();
      const { name } = await this.userService.findOne(data.userId);

      article = data;
      authorName = name;
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException({ message });
      }

      if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
        throw new UnprocessableEntityException({ message });
      }

      throw new InternalServerErrorException();
    }

    article['author'] = authorName;

    return article;
  };

  async delete(token: string, slug: string): Promise<void> {
    let response: any;

    try {
      const headers = Object.assign({}, this.headers, { Authorization: token });
      const { data } = await this.httpService
        .delete(`${this.baseUrl}/articles/${slug}`, { headers })
        .toPromise();

      response = data;
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException({ message });
      }

      throw new InternalServerErrorException();
    }

    return response;
  }
}
