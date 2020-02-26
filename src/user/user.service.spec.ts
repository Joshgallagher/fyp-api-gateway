import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

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

      expect(await service.create(user)).toStrictEqual(expected);
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

      expect(await service.findOne(userId)).toStrictEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
