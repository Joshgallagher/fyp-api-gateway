import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import * as faker from 'faker';
import { AppService } from '../app.service';

describe('Articles Controller', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        AppService,
        {
          provide: ArticlesService,
          useFactory: () => ({
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            findAllByUser: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('An article can be created', () => {
      const article: ArticleDto = {
        title: faker.lorem.sentence(),
        subtitle: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      };
      const token = faker.random.alphaNumeric();

      controller.create(token, article);

      expect(service.create).toHaveBeenCalledWith(token, article);
    });
  });

  describe('findOne', () => {
    it('A single article can be found by its slug', () => {
      const slug: string = faker.lorem.slug();

      service.findOne(slug);

      expect(service.findOne).toHaveBeenCalledWith(slug);
    });
  });

  describe('findAll', () => {
    it('All articles can be found', () => {
      const token = faker.random.alphaNumeric();
      const includes: string[] = [
        AppService.USER_SERVICE_INCLUDE,
        AppService.RATINGS_SERVICE_INCLUDE,
        AppService.COMMENTS_SERVICE_INCLUDE
      ];

      controller.findAll(token);

      expect(service.findAll).toHaveBeenCalledWith(includes, token);
    });
  });

  describe('findAllByUser', () => {
    it('All articles by a specific user can be found', () => {
      const uuid: string = faker.random.uuid();
      const includes: string[] = [
        'USER_SERVICE_INCLUDE',
        'RATINGS_SERVICE_INCLUDE'
      ];
      const token = faker.random.alphaNumeric();

      controller.findAllByUser(uuid, token);

      expect(service.findAllByUser).toHaveBeenCalledWith(uuid, includes, token);
    });
  });

  describe('update', () => {
    it('An article can be updated', () => {
      const article: ArticleDto = {
        title: faker.lorem.sentence(),
        subtitle: faker.lorem.sentence(),
        body: faker.lorem.sentence(),
      };
      const token = faker.random.alphaNumeric();
      const slug: string = faker.lorem.slug();

      controller.update(token, slug, article);

      expect(service.update).toHaveBeenCalledWith(token, slug, article);
    });
  });

  describe('delete', () => {
    it('An article can be deleted', () => {
      const token = faker.random.alphaNumeric();
      const slug: string = faker.lorem.slug();

      controller.delete(token, slug);

      expect(service.delete).toHaveBeenCalledWith(token, slug);
    });
  });
});
