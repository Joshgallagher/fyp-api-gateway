import { Test, TestingModule } from '@nestjs/testing';
import { USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { of } from 'rxjs';
import * as faker from 'faker';

describe('AuthService', () => {
  let service: AuthService;

  const authenticateUserMock = jest.fn(() => of({ authenticated: true }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_SERVICE_PROVIDER_TOKEN,
          useValue: {
            getService: () => ({
              authenticateUser: authenticateUserMock
            })
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    module.init();
  });

  beforeEach(() => {
    authenticateUserMock.mockClear();
  });

  describe('login', () => {
    it('A user can log in with their credentials', async () => {
      const user: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.random.word(),
      };
      const expected: Record<string, boolean> = { authenticated: true };

      const login = await service.login(user);

      expect(authenticateUserMock).toHaveBeenCalledWith({
        email: user.email, password: user.password
      });
      expect(login).toEqual(expected);
    });
  });
});
