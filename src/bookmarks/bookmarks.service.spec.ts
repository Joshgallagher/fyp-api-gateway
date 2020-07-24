import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from './bookmarks.service';
import * as faker from 'faker';
import { BookmarkDto } from './dto/bookmark.dto';
import { of } from 'rxjs';
import { ArticlesService } from '../articles/articles.service';
import { ConfigService } from '@nestjs/config';
import { BOOKMARKS_SERVICE_PROVIDER_TOKEN } from '../services/providers/bookmarks-service.provider';
import { AppService } from '../app.service';
import { Metadata } from 'grpc';

describe('BookmarksService', () => {
  let service: BookmarksService;
  let articlesService: ArticlesService;

  const createBookmarkMock = jest.fn(() => of({ bookmarked: true }));
  const articleId = faker.random.number();
  const findAllBookmarksMock = jest.fn(() => of({ bookmarks: [{ articleId }] }));
  const deleteBookmarkMock = jest.fn(() => of({ deleted: true }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        BookmarksService,
        {
          provide: BOOKMARKS_SERVICE_PROVIDER_TOKEN,
          useValue: {
            getService: () => ({
              createBookmark: createBookmarkMock,
              findAllBookmarks: findAllBookmarksMock,
              deleteBookmark: deleteBookmarkMock
            })
          },
        },
        {
          provide: ArticlesService,
          useFactory: () => ({
            findOne: jest.fn(),
            findByIds: jest.fn()
          })
        }
      ],
    }).compile();

    service = module.get<BookmarksService>(BookmarksService);
    articlesService = module.get<ArticlesService>(ArticlesService);

    module.init();
  });

  beforeEach(() => {
    createBookmarkMock.mockClear();
    findAllBookmarksMock.mockClear();
    deleteBookmarkMock.mockClear();
  });

  const token = faker.random.alphaNumeric();
  const expectedMetadata: Metadata = new Metadata();
  expectedMetadata.add('authorization', token);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('A bookmark can be created', async () => {
      const bookmark: BookmarkDto = {
        articleSlug: faker.lorem.slug(),
      };
      const id = faker.random.number();

      articlesService.findOne = jest.fn()
        .mockReturnValue({ id });
      const create = await service.create(token, bookmark);

      expect(articlesService.findOne).toBeCalledWith(bookmark.articleSlug);
      expect(createBookmarkMock).toBeCalledWith({ articleId: id }, expectedMetadata);
      expect(create).toEqual({ bookmarked: true });
    });
  });

  describe('findAll', () => {
    it('All a users bookmarks can be found', async () => {
      const findAll = await service.findAll(token);

      expect(findAllBookmarksMock).toBeCalledWith({}, expectedMetadata);
      expect(findAll).toEqual([{ articleId }]);
    });

    it('All users bookmarks with article data can be included', async () => {
      const expected = [{
        rating: faker.random.number(),
        author: faker.name.findName()
      }];

      articlesService.findByIds = jest.fn(() => (expected)) as any;
      const findAll = await service.findAll(token, [
        AppService.ARTICLES_SERVICE_INCLUDE
      ]);

      expect(findAllBookmarksMock).toBeCalledWith({}, expectedMetadata);
      expect(findAll).toEqual([{ ...expected[0], bookmarked: true }]);
    });
  });

  describe('delete', () => {
    it('A bookmark can be deleted', async () => {
      const articleSlug = faker.lorem.slug();
      const id = faker.random.number();

      articlesService.findOne = jest.fn().mockReturnValue({ id });
      await service.delete(token, articleSlug);

      expect(articlesService.findOne)
        .toBeCalledWith(articleSlug);
      expect(deleteBookmarkMock)
        .toBeCalledWith({ articleId: id }, expectedMetadata);
    });
  });
});
