import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { bookmarksServiceProvider, BOOKMARKS_SERVICE_PROVIDER_TOKEN } from '../services/providers/bookmarks-service.provider';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';

@Module({
    imports: [ArticlesModule],
    controllers: [BookmarksController],
    providers: [bookmarksServiceProvider, BookmarksService],
    exports: [BOOKMARKS_SERVICE_PROVIDER_TOKEN]
})
export class BookmarksModule { }
