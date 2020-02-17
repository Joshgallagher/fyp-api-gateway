import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

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

      expect(await service.login(user)).toStrictEqual(expected);
      expect(service.login).toHaveBeenCalledWith(user);
    });
  });
});
