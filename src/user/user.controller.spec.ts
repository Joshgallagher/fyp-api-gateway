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
      const headers: any = { authorization: 'Bearer 123xyx' };
      const user: CreateUserDto = {
        name: 'Josh',
        email: 'josh@gmail.com',
        password: 'secret',
      };

      controller.create(headers, user);
      expect(service.create).toHaveBeenCalledWith(headers, user);
    });
  });

  describe('findOne', () => {
    it('should findOne (get) a user', async () => {
      const headers: any = { authorization: 'Bearer 123xyx' };
      const userId: string = '854c9a9b-4a4a-410f-867c-9985c17878d8';

      controller.findOne(headers, userId);
      expect(service.findOne).toHaveBeenCalledWith(headers, userId);
    });
  });
});
