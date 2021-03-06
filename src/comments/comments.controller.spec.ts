import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';

describe('Comments Controller', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useFactory: () => ({
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          })
        }
      ]
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('A comment can be created', () => {
      const token: string = faker.lorem.word();
      const comment: CommentDto = {
        articleId: faker.random.number(),
        comment: faker.lorem.sentence()
      };

      controller.create(token, comment);

      expect(service.create).toBeCalledWith(token, comment);
    });
  });

  describe('findAll', () => {
    it('An artciles comments can be retrieved', () => {
      const id: number = faker.random.number();

      controller.findAll(id);

      expect(service.findAll).toBeCalledWith(id);
    });
  });

  describe('update', () => {
    it('Update an existing comment', () => {
      const token: string = faker.lorem.word();
      const commentId: string = faker.lorem.slug();
      const comment: CommentDto = {
        articleId: faker.random.number(),
        comment: faker.lorem.sentence()
      };

      controller.update(token, commentId, comment);

      expect(service.update).toBeCalledWith(token, commentId, comment);
    });
  });

  describe('delete', () => {
    it('Delete an existing comment', () => {
      const token: string = faker.lorem.word();
      const commentId: string = faker.lorem.slug();

      controller.delete(token, commentId);

      expect(service.delete).toBeCalledWith(token, commentId);
    });
  });
});
