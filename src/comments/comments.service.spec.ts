import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UserService } from '../user/user.service';
import * as faker from 'faker';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CommentDto } from './dto/comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpService: HttpService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CommentsService,
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
        }
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    httpService = module.get<HttpService>(HttpService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('A comment can be created', async () => {
      const token: string = faker.lorem.word();
      const commentId = faker.random.uuid();
      const commentDto: CommentDto = {
        articleId: faker.random.number(),
        comment: faker.lorem.sentence()
      };

      httpService.post = jest.fn(() => of({
        data: { id: commentId }
      })) as any;
      const create = await service.create(token, commentDto);

      expect(httpService.post).toHaveBeenCalled();
      expect(create).toEqual({ id: commentId });
    });
  });

  describe('findAll', () => {
    it('An artciles comments can be retrieved', async () => {
      const id: number = faker.random.number();
      const userId: string = faker.random.uuid();
      const name: string = faker.name.firstName();

      httpService.get = jest.fn(() => of({
        data: [
          { userId }
        ]
      })) as any;
      userService.findByIds = jest.fn().mockResolvedValue({
        users: [
          { id: userId, name },
        ]
      });
      const findAll = await service.findAll(id);

      expect(httpService.get).toHaveBeenCalled();
      expect(userService.findByIds).toHaveBeenCalledWith([userId]);
      expect(findAll).toEqual([{ userId, name }]);
    });
  });

  describe('update', () => {
    it('Update an existing comment', async () => {
      const token: string = faker.lorem.word();
      const commentId = faker.random.uuid();
      const commentDto: CommentDto = {
        articleId: faker.random.number(),
        comment: faker.lorem.sentence()
      };

      httpService.put = jest.fn(() => of({})) as any;
      await service.update(token, commentId, commentDto);

      expect(httpService.put).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('Delete an existing comment', async () => {
      const token: string = faker.lorem.word();
      const commentId = faker.random.uuid();

      httpService.delete = jest.fn(() => of({})) as any;
      await service.delete(token, commentId);

      expect(httpService.delete).toHaveBeenCalled();
    });
  });
});
