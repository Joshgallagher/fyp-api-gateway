import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import * as faker from 'faker';
import { BookmarkDto } from './dto/bookmark.dto';
import { AppService } from '../app.service';

describe('Bookmarks Controller', () => {
  let controller: BookmarksController;
  let service: BookmarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [
        {
          provide: BookmarksService,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn()
          })
        }
      ]
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
    service = module.get<BookmarksService>(BookmarksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('A bookmark can be created', () => {
      const token = faker.random.alphaNumeric();
      const bookmark: BookmarkDto = {
        articleSlug: faker.lorem.slug(),
      };

      controller.create(token, bookmark);

      expect(service.create).toHaveBeenCalledWith(token, bookmark);
    });
  });

  describe('findAll', () => {
    it('All a users bookmarks can be found', () => {
      const token = faker.random.alphaNumeric();

      controller.findAll(token);

      expect(service.findAll)
        .toHaveBeenCalledWith(token, [AppService.ARTICLES_SERVICE_INCLUDE]);
    });
  });

  describe('delete', () => {
    it('A bookmark can be deleted', () => {
      const token = faker.random.alphaNumeric();
      const articleSlug = faker.lorem.slug();

      controller.delete(token, articleSlug);

      expect(service.delete).toHaveBeenCalledWith(token, articleSlug);
    });
  });
});
