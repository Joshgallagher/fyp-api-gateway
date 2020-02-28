import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UserService } from '../user/user.service';

describe('Articles Controller', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        UserService,
        {
          provide: ArticlesService,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
            findAllByUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  describe('create', () => {
    it('should create an article', async () => {
      const article: any = {
        title: 'Title',
        body: 'Body',
      };

      const token: string = 'token';
      const expected: Record<string, string> = {
        ...article
      };

      jest.spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.create(token, article)).toStrictEqual(expected);
      expect(service.create).toHaveBeenCalledWith(token, article);
    });
  });

  describe('findAll', () => {
    it('should find all articles', async () => {
      const expected: object[] = [{}, {}, {}];

      jest.spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.findAll()).toStrictEqual(expected);
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should find all articles by their author', async () => {
      const userId = 'jane';
      const expected = [{ title: 'expected' }];

      jest.spyOn(service, 'findAllByUser')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.findAllByUser(userId)).toStrictEqual(expected);
      expect(service.findAllByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it("should findOne article by it's slug", async () => {
      const slug = 'expected';
      const expected = { title: 'expected' };

      jest.spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.findOne(slug)).toStrictEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith(slug);
    });
  });

  describe('update', () => {
    it("should update an article by it's slug", async () => {
      const token: string = 'token';
      const slug: string = 'expected';
      const expected: object = { title: 'expected' };

      jest.spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.update(token, slug, expected)).toStrictEqual(expected);
      expect(service.update).toHaveBeenCalledWith(token, slug, expected);
    });
  });

  describe('delete', () => {
    it("should delete an article by it's slug", async () => {
      const token: string = 'token';
      const slug: string = 'to-be-deleted';

      jest.spyOn(service, 'delete');
      await controller.delete(token, slug);

      expect(service.delete).toHaveBeenCalledWith(token, slug);
    });
  });
});
