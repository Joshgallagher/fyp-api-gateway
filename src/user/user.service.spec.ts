import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { of } from 'rxjs';
import * as faker from 'faker';

describe('UserService', () => {
  let service: UserService;

  const registerUserMock = jest.fn(() => of({ registered: true }));
  const userId = faker.random.uuid();
  const name = faker.name.firstName();
  const getUserMock = jest.fn(() => of({ id: userId, name }));
  const getUsersByIdMock = jest.fn(() => of({ users: [{ id: userId, name }] }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_SERVICE_PROVIDER_TOKEN,
          useValue: {
            getService: () => ({
              registerUser: registerUserMock,
              getUser: getUserMock,
              getUsersById: getUsersByIdMock,
            })
          },
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    module.init();
  });

  beforeEach(() => {
    registerUserMock.mockClear();
    getUserMock.mockClear();
    getUsersByIdMock.mockClear();
  });

  describe('create', () => {
    it('A user can be created', async () => {
      const user: CreateUserDto = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.lorem.word(),
      };

      const create = await service.create(user);

      expect(registerUserMock).toHaveBeenCalledWith(user);
      expect(create).toEqual({ registered: true });
    });
  });

  describe('findOne', () => {
    it('A user can be found by their UUID', async () => {
      const findOne = await service.findOne(userId);

      expect(getUserMock).toHaveBeenCalledWith({ id: userId });
      expect(findOne).toEqual({ id: userId, name });
    });
  });

  describe('findByIds', () => {
    it('More than one user can be found by their UUID', async () => {
      const findByIds = await service.findByIds([userId]);

      expect(getUsersByIdMock).toHaveBeenCalledWith({ ids: [userId] });
      expect(findByIds).toEqual({ users: [{ id: userId, name }] });
    });
  });
});
