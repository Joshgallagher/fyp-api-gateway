import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env'
  })],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class AppModule { }
