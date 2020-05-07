import { Module, HttpModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env'
    }),
    HttpModule,
    AppModule,
    UserModule,
    AuthModule,
    ArticlesModule,
    BookmarksModule,
    RatingsModule
  ]
})
export class AppModule { }
