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
            findAll: jest.fn()
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
});
