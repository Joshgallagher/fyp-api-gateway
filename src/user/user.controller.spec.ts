import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as faker from 'faker';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: () => ({
            create: jest.fn(),
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('A user can be created', () => {
      const user: CreateUserDto = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      controller.create(user);

      expect(service.create).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('A user can be found by their UUID', () => {
      const userId = faker.random.uuid();

      controller.findOne(userId);

      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
