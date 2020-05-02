import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userServiceProvider, USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, userServiceProvider],
  controllers: [AuthController],
  exports: [USER_SERVICE_PROVIDER_TOKEN]
})
export class AuthModule { }
