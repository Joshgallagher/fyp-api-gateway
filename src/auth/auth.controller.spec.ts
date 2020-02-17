import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

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
            login: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should login (authenticate) a user', async () => {
      const user: LoginUserDto = {
        email: 'josh@gmail.com',
        password: 'secret',
      };

      const expected: Record<string, boolean> = { authenticated: true };

      jest.spyOn(service, 'login')
        .mockImplementation(() => Promise.resolve(expected));

      expect(await controller.login(user)).toStrictEqual(expected);
      expect(service.login).toHaveBeenCalledWith(user);
    });
  });
});
