import { Injectable, HttpService, Inject, OnModuleInit, HttpStatus, NotFoundException, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  private readonly headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  constructor(
    @Inject('HttpService')
    private readonly httpService: HttpService,
    @Inject('UserService')
    private readonly userService: UserService,
  ) { }

  async create(token: string, articleDto: ArticleDto): Promise<object> {
    const { title, body } = articleDto;

    let article: Record<string, any>;
    let authorName: string;

    try {
      const headers = Object.assign({}, this.headers, { Authorization: token });
      const { data } = await this.httpService.post('articles', { title, body }, { headers }).toPromise();
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

    try {
      const { data } = await this.httpService.get('articles').toPromise();
      const authorIds: string[] = data.map(({ userId }) => userId);
      const { users } = await this.userService.findByIds(authorIds);

      articles = data;
      authors = users;
    } catch (e) {
      return [];
    }

    const aggregate = articles.map((article: Record<string, any>) => {
      const { name } = authors.find(({ id }) => article.userId === id);

      return { ...article, author: name };
    });

    return aggregate;
  }

  async findByIds(articleIds: number[]): Promise<object[]> {
    const { data } = await this.httpService.post(`articles/all`, { articleIds }, { headers: this.headers }).toPromise();
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
    const { data } = await this.httpService.get(`articles/user/${userId}`).toPromise();
    const { name } = await this.userService.findOne(userId);

    const articles = data.map((article: Record<string, any>) => ({ ...article, author: name }));

    return articles;
  }

  async findOne(slug: string, includeAuthor: boolean = true): Promise<object> {
    let article: Record<string, any>;

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
      const { data } = await this.httpService.put(`articles/${slug}`, { title, body }, { headers }).toPromise();
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
  }

  async delete(token: string, slug: string): Promise<void> {
    let response: any;

    try {
      const headers = Object.assign({}, this.headers, { Authorization: token });
      const { data } = await this.httpService.delete(`articles/${slug}`, { headers }).toPromise();

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
