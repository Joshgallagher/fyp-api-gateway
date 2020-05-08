import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userServiceProvider, USER_SERVICE_PROVIDER_TOKEN } from '../services/providers/user-service.provider';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, userServiceProvider],
  controllers: [UserController],
  exports: [UserService, USER_SERVICE_PROVIDER_TOKEN]
})
export class UserModule { }
