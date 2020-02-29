import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userServiceProvider, USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';

@Module({
  providers: [UserService, userServiceProvider],
  exports: [UserService, USER_SERVICE_PROVIDER_TOKEN]
})
export class UserModule { }
