import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as faker from 'faker';

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            login: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('A user can log in with their credentials', () => {
      const user: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.random.word(),
      };
      const expected: Record<string, boolean> = { authenticated: true };

      service.login = jest.fn().mockResolvedValue(expected);

      const login = controller.login(user);

      expect(service.login).toHaveBeenCalledWith(user);
      expect(login).resolves.toStrictEqual(expected);
    });
  });
});
