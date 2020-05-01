import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { BookmarksService } from './bookmarks/bookmarks.service';
import { BookmarksController } from './bookmarks/bookmarks.controller';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { RatingsModule } from './ratings/ratings.module';
import { RatingsController } from './ratings/ratings.controller';
import { RatingsService } from './ratings/ratings.service';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesService } from './articles/articles.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env'
    }),
    UserModule,
    AuthModule,
    ArticlesModule,
    BookmarksModule,
    RatingsModule
  ],
  controllers: [UserController, AuthController, BookmarksController, RatingsController, ArticlesController],
  providers: [UserService, AuthService, BookmarksService, RatingsService, ArticlesService],
})
export class AppModule { }
