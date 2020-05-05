import { Injectable, HttpService, Inject, HttpStatus, NotFoundException, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ConfigService } from '@nestjs/config';
import { RatingsService } from 'src/ratings/ratings.service';
import { AppService } from 'src/app.service';
import { CreateRatingDto } from 'src/ratings/dto/create-rating.dto';

@Injectable()
export class ArticlesService extends AppService {
  private serviceBaseUrl: string;

  constructor(
    @Inject('ConfigService')
    readonly configService: ConfigService,
    @Inject('HttpService')
    private readonly httpService: HttpService,
    @Inject('UserService')
    private readonly userService: UserService,
    @Inject('RatingsService')
    private readonly ratingsService: RatingsService
  ) {
    super();

    this.serviceBaseUrl = this.configService.get<string>('ARTICLE_SERVICE_URL');
  }

  /**
   * Creates an article from the provided title and body.
   * 
   * @param token OpenID Connect 1.0 Token
   * @param createArticleDto Containing the article title and body
   */
  public async create(token: string, createArticleDto: CreateArticleDto): Promise<object> {
    const { title, body } = createArticleDto;
    const headers = { ...this.requestHeaders, Authorization: token };

    let slug: string;

    try {
      const { data } = await this.httpService
        .post(`${this.serviceBaseUrl}/articles`, { title, body }, { headers })
        .toPromise();

      slug = data.slug;
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
        throw new UnprocessableEntityException(message);
      }

      throw new InternalServerErrorException();
    }

    return { slug };
  }

  public async findOne(slug: string, includes: string[] = []): Promise<object> {
    let article: Record<string, any>;

    try {
      const { data } = await this.httpService
        .get(`${this.serviceBaseUrl}/articles/${slug}`)
        .toPromise();

      article = data;
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException({ message });
      }

      throw new InternalServerErrorException();
    }

    if (this.hasInclude(includes, this.USER_SERVICE_INCLUDE)) {
      try {
        const { name } = await this.userService.findOne(article.userId);

        article['author'] = name;
      } catch (e) {
        article['author'] = 'Pondr Author';
      }
    }

    if (this.hasInclude(includes, this.RATINGS_SERVICE_INCLUDE)) {
      try {
        const { rating }: any = await this.ratingsService.findOne(article.id);

        article['rating'] = rating;
      } catch (e) {
        article['rating'] = 0;
      }
    }

    return article;
  }

  // async findAll(): Promise<object[]> {
  //   let articles: any;
  //   let authors: any;
  //   let ratings: any;

  //   try {
  //     const { data } = await this.httpService.get(`${this.baseUrl}/articles`).toPromise();
  //     const articleIds: any = data.map(({ id }) => id);
  //     const authorIds: string[] = data.map(({ userId }) => userId);

  //     const { users } = await this.userService.findByIds(authorIds);
  //     const r = await this.ratingsService.findByIds(articleIds);

  //     articles = data;
  //     authors = users;
  //     ratings = r;
  //   } catch (e) {
  //     return [];
  //   }

  //   const aggregate = articles.map((article: Record<string, any>) => {
  //     const { name } = authors.find(({ id }) => article.userId === id);
  //     const { rating } = ratings.find(({ articleId }) => article.id === articleId) || { rating: 0 };

  //     return { ...article, author: name, rating };
  //   });

  //   return aggregate;
  // }

  async findByIds(articleIds: number[]): Promise<object[]> {
    const { data } = await this.httpService.post(`${this.serviceBaseUrl}/articles/all`, { articleIds }, { headers: this.requestHeaders }).toPromise();
    const authorIds: string[] = data.map(({ userId }) => userId);
    const { users } = await this.userService.findByIds(authorIds);

    let articles: Array<Record<any, any>> = [];

    for (let article in data) {
      const { name } = users.find(({ id }) => data[article].userId === id);

      articles.push({ ...data[article], author: name });
    }

    return articles;
  }

  // async findAllByUser(userId: string): Promise<Array<object>> {
  //   const { data } = await this.httpService
  //     .get(`${this.bas}/articles/user/${userId}`)
  //     .toPromise();
  //   const articleIds: any = data.map(({ id }) => id);

  //   const { name } = await this.userService.findOne(userId);
  //   const ratings: any = await this.ratingsService.findByIds(articleIds);

  //   const articles = data.map((article: Record<string, any>) => {
  //     const { rating } = ratings.find(({ articleId }) => article.id === articleId) || { rating: 0 };


  //     return { ...article, author: name, rating };
  //   });

  //   return articles;
  // }

  // async findOne(slug: string, includeAuthor: boolean = true): Promise<object> {
  //   let article: Record<string, any>;
  //   let rating: number;

  //   try {
  //     const { data } = await this.httpService
  //       .get(`${this.serviceBaseUrl}/articles/${slug}`)
  //       .toPromise();
  //     const { rating: r }: any = await this.ratingsService.findOne(data.id);

  //     article = data;
  //     rating = r;
  //   } catch ({ response }) {
  //     const { statusCode, message } = response.data;

  //     if (statusCode === HttpStatus.NOT_FOUND) {
  //       throw new NotFoundException({ message });
  //     }

  //     throw new InternalServerErrorException();
  //   }

  //   article['rating'] = rating;

  //   if (includeAuthor) {
  //     const { name } = await this.userService.findOne(article.userId);

  //     article['author'] = name;
  //   }

  //   return article;
  // };

  // async update(token: string, slug: string, articleDto: ArticleDto): Promise<object> {
  //   const { title, body } = articleDto;

  //   let article: Record<string, any>;
  //   let authorName: string;

  //   try {
  //     const headers = Object.assign({}, this.headers, { Authorization: token });
  //     const { data } = await this.httpService
  //       .put(`${this.baseUrl}/articles/${slug}`, { title, body }, { headers })
  //       .toPromise();
  //     const { name } = await this.userService.findOne(data.userId);

  //     article = data;
  //     authorName = name;
  //   } catch ({ response }) {
  //     const { statusCode, message } = response.data;

  //     if (statusCode === HttpStatus.NOT_FOUND) {
  //       throw new NotFoundException({ message });
  //     }

  //     if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
  //       throw new UnprocessableEntityException({ message });
  //     }

  //     throw new InternalServerErrorException();
  //   }

  //   article['author'] = authorName;

  //   return article;
  // };

  // async delete(token: string, slug: string): Promise<void> {
  //   let response: any;

  //   try {
  //     const headers = Object.assign({}, this.headers, { Authorization: token });
  //     const { data } = await this.httpService
  //       .delete(`${this.baseUrl}/articles/${slug}`, { headers })
  //       .toPromise();

  //     response = data;
  //   } catch ({ response }) {
  //     const { statusCode, message } = response.data;

  //     if (statusCode === HttpStatus.NOT_FOUND) {
  //       throw new NotFoundException({ message });
  //     }

  //     throw new InternalServerErrorException();
  //   }

  //   return response;
  // }
}
