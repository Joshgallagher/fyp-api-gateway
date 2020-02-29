import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userServiceProvider, USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';

@Module({
  providers: [AuthService, userServiceProvider],
  exports: [USER_SERVICE_PROVIDER_TOKEN]
})
export class AuthModule { }
