import { Injectable, HttpService, Inject, HttpStatus, NotFoundException, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { RatingsService } from 'src/ratings/ratings.service';
import { AppService } from 'src/app.service';
import { ArticleDto } from './dto/article.dto';

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
  public async create(token: string, createArticleDto: ArticleDto): Promise<object> {
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

  /**
   * Finds one article by it's slug.
   * 
   * @param slug Article slug
   * @param includes Optional parameter to include external data
   */
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

  /**
   * Finds all articles.
   * 
   * @param includes Optional parameter to include external data
   */
  public async findAll(includes: string[] = []): Promise<object[]> {
    let articles: Record<string, any>[];

    try {
      const { data } = await this.httpService
        .get(`${this.serviceBaseUrl}/articles`)
        .toPromise();

      articles = data;
    } catch (e) {
      return [];
    }

    if (this.hasInclude(includes, this.USER_SERVICE_INCLUDE)) {
      let authors: any;

      try {
        const authorIds: string[] = articles.map(({ userId }) => userId);
        const { users } = await this.userService.findByIds(authorIds);

        authors = users;
      } catch (e) {
        authors = [];
      }

      articles = articles.map((article: Record<string, any>) => {
        const { name } = authors.find(({ id }) => article.userId === id)
          || { name: 'Pondr Author' };

        return { ...article, author: name };
      });
    }

    if (this.hasInclude(includes, this.RATINGS_SERVICE_INCLUDE)) {
      let ratings: any;

      try {
        const articleIds: any = articles.map(({ id }) => id);
        const ratingsRequest: any = await this.ratingsService.findByIds(articleIds);

        ratings = ratingsRequest;
      } catch (e) {
        ratings = [];
      }

      articles = articles.map((article: Record<string, any>) => {
        const { rating } = ratings.find(({ articleId }) => article.id === articleId)
          || { rating: 0 };

        return { ...article, rating };
      });
    }

    return articles;
  }

  /**
   * Finds all articles for a particular user.
   * 
   * @param userId The users (authors) UUID
   * @param includes Optional parameter to include external data
   */
  public async findAllByUser(userId: string, includes: string[] = []): Promise<Array<object>> {
    let articles: Record<string, any>[];

    try {
      const { data } = await this.httpService
        .get(`${this.serviceBaseUrl}/articles/user/${userId}`)
        .toPromise();

      articles = data;
    } catch (e) {
      return [];
    }

    if (this.hasInclude(includes, this.USER_SERVICE_INCLUDE)) {
      let author: string;

      try {
        const { name } = await this.userService.findOne(userId);

        author = name;
      } catch (e) {
        author = 'Pondr Author';
      }

      articles = articles.map((article: Record<string, any>) => {
        return { ...article, author };
      });
    }

    if (this.hasInclude(includes, this.RATINGS_SERVICE_INCLUDE)) {
      let ratings: any;

      try {
        const articleIds: any = articles.map(({ id }) => id);
        const ratingsRequest: any = await this.ratingsService.findByIds(articleIds);

        ratings = ratingsRequest;
      } catch (e) {
        ratings = [];
      }

      articles = articles.map((article: Record<string, any>) => {
        const { rating } = ratings.find(({ articleId }) => article.id === articleId)
          || { rating: 0 };

        return { ...article, rating };
      });
    }

    return articles;
  }

  /**
   * Find articles by the supploed article IDs and returns them.
   * 
   * @param articleIds An array of article IDs
   * @param includes Optional parameter to include external data
   */
  public async findByIds(articleIds: number[], includes: string[] = []): Promise<object[]> {
    const headers = this.requestHeaders;

    let articles: Record<string, any>[];

    try {
      const { data } = await this.httpService
        .post(`${this.serviceBaseUrl}/articles/all`, { articleIds }, { headers })
        .toPromise();

      articles = data;
    } catch (e) {
      return [];
    }

    if (this.hasInclude(includes, this.USER_SERVICE_INCLUDE)) {
      let authors: any;

      try {
        const authorIds: string[] = articles.map(({ userId }) => userId);
        const { users } = await this.userService.findByIds(authorIds);

        authors = users;
      } catch (e) {
        authors = [];
      }

      const agg = articles.map((article: Record<string, any>) => {
        const { name } = authors.find(({ id }) => article.userId === id)
          || { name: 'Pondr Author' };

        return { ...article, author: name };
      });

      return agg;
    }

    return articles;
  }

  /**
   * Updates an article.
   * 
   * @param token OpenID Connect 1.0 Token
   * @param slug Article slug
   * @param updateArticleDto Containing the updated article title and body
   */
  public async update(
    token: string,
    slug: string,
    updateArticleDto: ArticleDto
  ): Promise<void> {
    const { title, body } = updateArticleDto;
    const headers = { ...this.requestHeaders, Authorization: token };

    try {
      await this.httpService
        .put(`${this.serviceBaseUrl}/articles/${slug}`, { title, body }, { headers })
        .toPromise();
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
  }

  /**
   * Deletes an article.
   * 
   * @param token OpenID Connect 1.0 Token
   * @param slug Article slug
   */
  public async delete(token: string, slug: string): Promise<void> {
    const headers = { ...this.requestHeaders, Authorization: token };

    try {
      await this.httpService
        .delete(`${this.serviceBaseUrl}/articles/${slug}`, { headers })
        .toPromise();
    } catch ({ response }) {
      const { statusCode, message } = response.data;

      if (statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException({ message });
      }

      throw new InternalServerErrorException();
    }
  }
}
