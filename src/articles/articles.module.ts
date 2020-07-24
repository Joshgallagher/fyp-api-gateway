import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RatingsModule } from '../ratings/ratings.module';
import { CommentsModule } from 'src/comments/comments.module';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    UserModule,
    RatingsModule,
    CommentsModule,
    BookmarksModule
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule { }
