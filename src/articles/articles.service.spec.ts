import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { HttpService, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import * as faker from 'faker';
import { ArticleDto } from './dto/article.dto';
import { RatingsService } from '../ratings/ratings.service';
import { of, throwError } from 'rxjs';
import { AppService } from '../app.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpService: HttpService;
  let userService: UserService;
  let ratingsService: RatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        ArticlesService,
        {
          provide: RatingsService,
          useFactory: () => ({
            findOne: jest.fn(),
            findByIds: jest.fn()
          })
        },
        {
          provide: UserService,
          useFactory: () => ({
            findOne: jest.fn(),
            findByIds: jest.fn()
          }),
        },
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    httpService = module.get<HttpService>(HttpService);
    userService = module.get<UserService>(UserService);
    ratingsService = module.get<RatingsService>(RatingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('An article can be created', async () => {
      const article: ArticleDto = {
        title: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      };
      const token = faker.random.alphaNumeric();
      const slug: string = faker.lorem.slug();

      httpService.post = jest.fn(() => of({ data: { slug } })) as any;
      const create = await service.create(token, article);

      expect(httpService.post).toHaveBeenCalled();
      expect(create).toEqual({ slug });
    });
  });

  describe('findOne', () => {
    const id: number = faker.random.number();
    const userId: string = faker.random.uuid();
    const slug: string = faker.lorem.slug();
    const expected = {
      id,
      userId,
      title: faker.lorem.sentence(),
      slug,
      body: faker.lorem.sentence(),
    };

    it('A single article can be found by its slug', async () => {
      httpService.get = jest.fn(() => of({
        data: { ...expected }
      })) as any;
      const findOne = await service.findOne(slug);

      expect(httpService.get).toHaveBeenCalled();
      expect(findOne).toEqual(expected);
    });

    it('The article author can be included', async () => {
      const author = faker.name.firstName();

      httpService.get = jest.fn(() => of({
        data: { ...expected }
      })) as any;
      userService.findOne = jest.fn().mockResolvedValue({ name: author });
      const findOne = await service.findOne(slug, [AppService.USER_SERVICE_INCLUDE]);

      expect(httpService.get).toHaveBeenCalled();
      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(findOne).toEqual({ ...expected, author });
    });

    it('The article rating can be included', async () => {
      const rating = faker.random.number();

      httpService.get = jest.fn(() => of({
        data: { ...expected }
      })) as any;
      ratingsService.findOne = jest.fn().mockResolvedValue({ rating });
      const findOne = await service.findOne(slug, [AppService.RATINGS_SERVICE_INCLUDE]);

      expect(httpService.get).toHaveBeenCalled();
      expect(ratingsService.findOne).toHaveBeenCalledWith(id);
      expect(findOne).toEqual({ ...expected, rating });
    });
  });

  describe('findAll', () => {
    const id: number = faker.random.number();
    const userId: string = faker.random.uuid();
    const expected = [{ id, userId }, { id, userId }, { id, userId }];

    it('All articles can be found', async () => {
      httpService.get = jest.fn(() => of({
        data: expected
      })) as any;
      const findAll = await service.findAll();

      expect(httpService.get).toHaveBeenCalled();
      expect(findAll).toEqual(expected);
    });

    it('The articles authors can be included', async () => {
      const author = faker.name.firstName();

      httpService.get = jest.fn(() => of({
        data: expected
      })) as any;
      userService.findByIds = jest.fn().mockResolvedValue({
        users: [
          { id: userId, name: author },
          { id: userId, name: author },
          { id: userId, name: author }
        ]
      });
      const findAll = await service.findAll([
        AppService.USER_SERVICE_INCLUDE
      ]);

      expect(httpService.get).toHaveBeenCalled();
      expect(userService.findByIds).toHaveBeenCalledWith([userId, userId, userId]);
      expect(findAll).toEqual(expected.map(o => Object.assign(o, { author })));
    });

    it('The articles ratings can be included', async () => {
      const rating = faker.random.number();

      httpService.get = jest.fn(() => of({
        data: expected
      })) as any;
      ratingsService.findByIds = jest.fn().mockResolvedValue([
        { articleId: id, rating }, { articleId: id, rating }, { articleId: id, rating }
      ]);
      const findAll = await service.findAll([
        AppService.RATINGS_SERVICE_INCLUDE
      ]);

      expect(httpService.get).toHaveBeenCalled();
      expect(ratingsService.findByIds).toHaveBeenCalledWith([id, id, id]);
      expect(findAll).toEqual(expected.map(o => Object.assign(o, { rating })));
    });
  });

  describe('findAllByUser', () => {
    const id: number = faker.random.number();
    const userId: string = faker.random.uuid();
    const expected = [{ id, userId }, { id, userId }, { id, userId }];

    it('All articles by a specific user can be found', async () => {
      httpService.get = jest.fn(() => of({
        data: expected
      })) as any;
      const findAllByUser = await service.findAllByUser(userId);

      expect(httpService.get).toHaveBeenCalled();
      expect(findAllByUser).toEqual(expected);
    });

    it('The articles author can be included', async () => {
      const author = faker.name.firstName();

      httpService.get = jest.fn(() => of({
        data: expected
      })) as any;
      userService.findByIds = jest.fn().mockResolvedValue({
        users: [
          { id: userId, name: author },
          { id: userId, name: author },
          { id: userId, name: author }
        ]
      });
      const findAll = await service.findAll([
        AppService.USER_SERVICE_INCLUDE
      ]);

      expect(httpService.get).toHaveBeenCalled();
      expect(userService.findByIds).toHaveBeenCalledWith([userId, userId, userId]);
      expect(findAll).toEqual(expected.map(o => Object.assign(o, { author })));
    });

    it('The articles ratings can be included', async () => {
      const rating = faker.random.number();

      httpService.get = jest.fn(() => of({
        data: expected
      })) as any;
      ratingsService.findByIds = jest.fn().mockResolvedValue([
        { articleId: id, rating }, { articleId: id, rating }, { articleId: id, rating }
      ]);
      const findAll = await service.findAll([
        AppService.RATINGS_SERVICE_INCLUDE
      ]);

      expect(httpService.get).toHaveBeenCalled();
      expect(ratingsService.findByIds).toHaveBeenCalledWith([id, id, id]);
      expect(findAll).toEqual(expected.map(o => Object.assign(o, { rating })));
    });
  });

  describe('findByIds', () => {
    const id: number = faker.random.number();
    const userId: string = faker.random.uuid();
    const expected = [{ id, userId }];

    it('All articles by a specific user can be found', async () => {
      httpService.post = jest.fn(() => of({
        data: expected
      })) as any;
      const findAllByUser = await service.findByIds([id]);

      expect(httpService.post).toHaveBeenCalled();
      expect(findAllByUser).toEqual(expected);
    });

    it('The articles authors can be included', async () => {
      const author = faker.name.firstName();

      httpService.post = jest.fn(() => of({
        data: expected
      })) as any;
      userService.findByIds = jest.fn().mockResolvedValue({
        users: [{ id: userId, name: author }]
      });
      const findByIds = await service.findByIds([id], [
        AppService.USER_SERVICE_INCLUDE
      ]);

      expect(httpService.post).toHaveBeenCalled();
      expect(userService.findByIds).toHaveBeenCalledWith([userId]);
      expect(findByIds).toEqual(expected.map(o => Object.assign(o, { author })));
    });

    it('The articles ratings can be included', async () => {
      const rating = faker.random.number();

      httpService.post = jest.fn(() => of({
        data: expected
      })) as any;
      ratingsService.findByIds = jest.fn().mockResolvedValue([
        { articleId: id, rating }
      ]);
      const findByIds = await service.findByIds([id], [
        AppService.RATINGS_SERVICE_INCLUDE
      ]);

      expect(httpService.post).toHaveBeenCalled();
      expect(ratingsService.findByIds).toHaveBeenCalledWith([id]);
      expect(findByIds).toEqual(expected.map(o => Object.assign(o, { rating })));
    });
  });

  describe('update', () => {
    it('An article can be updated', async () => {
      const article: ArticleDto = {
        title: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      };
      const token = faker.random.alphaNumeric();
      const slug: string = faker.lorem.slug();

      httpService.put = jest.fn(() => of({})) as any;
      await service.update(token, slug, article);

      expect(httpService.put).toHaveBeenCalled();
    });
  });
});
