import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import * as faker from 'faker';
import { RatingDto } from './dto/rating.dto';
import { RatingsService } from './ratings.service';

describe('Ratings Controller', () => {
  let controller: RatingsController;
  let service: RatingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        {
          provide: RatingsService,
          useFactory: () => ({
            create: jest.fn(),
            findOne: jest.fn(),
            userArticleRating: jest.fn(),
            findByIds: jest.fn()
          }),
        }
      ]
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('A rating can be created', () => {
      const rating: RatingDto = {
        articleId: faker.random.number()
      };
      const token = faker.random.alphaNumeric();

      controller.create(token, rating);

      expect(service.create).toHaveBeenCalledWith(token, rating);
    });
  });

  describe('findOne', () => {
    it('A single rating can be found', () => {
      const articleId: number = faker.random.number();

      controller.findOne(articleId);

      expect(service.findOne).toHaveBeenCalledWith(articleId);
    });
  });

  describe('userArticleRating', () => {
    it('A users rating for an article can be found', () => {
      const articleId: number = faker.random.number();
      const token = faker.random.alphaNumeric();

      controller.userArticleRating(token, articleId);

      expect(service.userArticleRating).toHaveBeenCalledWith(token, articleId);
    });
  });
});
