import { Test, TestingModule } from '@nestjs/testing';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { HttpService } from '@nestjs/common';
import * as faker from 'faker';
import { RatingDto } from './dto/rating.dto';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';

describe('RatingsService', () => {
  let controller: RatingsController;
  let service: RatingsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        ConfigService,
        RatingsService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(),
            post: jest.fn()
          }),
        }
      ],
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('A rating can be created', async () => {
      const rating: RatingDto = {
        articleId: faker.random.number()
      };
      const token = faker.random.alphaNumeric();

      const expected = {
        rating: faker.random.number()
      };

      httpService.post = jest.fn(() => of({ data: expected })) as any;
      const create = await service.create(token, rating);

      expect(httpService.post).toHaveBeenCalled();
      expect(create).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('A single rating can be found', async () => {
      const articleId = faker.random.number();

      const expected = {
        rating: faker.random.number()
      };

      httpService.get = jest.fn(() => of({ data: expected })) as any;
      const findOne = await service.findOne(articleId);

      expect(httpService.get).toHaveBeenCalled();
      expect(findOne).toEqual(expected);
    });
  });

  describe('userArticleRating', () => {
    it('A users rating for an article can be found', async () => {
      const articleId = faker.random.number();
      const token = faker.random.alphaNumeric();

      const expected = {
        rating: faker.random.number()
      };

      httpService.get = jest.fn(() => of({ data: expected })) as any;
      const userArticleRating = await service.userArticleRating(token, articleId);

      expect(httpService.get).toHaveBeenCalled();
      expect(userArticleRating).toEqual(expected);
    });
  });

  describe('findByIds', () => {
    it('Article ratings can be found by their IDs', async () => {
      const articleIds = [faker.random.number()];

      const expected = [{ rating: faker.random.number() }];

      httpService.post = jest.fn(() => of({ data: expected })) as any;
      const findByIds = await service.findByIds(articleIds);

      expect(httpService.post).toHaveBeenCalled();
      expect(findByIds).toEqual(expected);
    });
  });
});
