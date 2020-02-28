import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

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
            create: jest.fn(() => true),
            findOne: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create (register) a user', async () => {
      const user: CreateUserDto = {
        name: 'Josh',
        email: 'josh@gmail.com',
        password: 'secret',
      };

      const expected: Record<string, boolean> = { registered: true };

      jest.spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.create(user)).toStrictEqual(expected);
      expect(service.create).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('should findOne (get a) user', async () => {
      const userId: string = '854c9a9b-4a4a-410f-867c-9985c17878d8';

      const expected: Record<string, number | string> = {
        id: userId,
        name: 'Josh',
      };

      jest.spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.findOne(userId)).toStrictEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
