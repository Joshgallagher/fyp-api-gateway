import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { bookmarksServiceProvider, BOOKMARKS_SERVICE_PROVIDER_TOKEN } from '../services/providers/bookmarks-service.provider';

@Module({
    imports: [ArticlesModule],
    providers: [bookmarksServiceProvider],
    exports: [BOOKMARKS_SERVICE_PROVIDER_TOKEN]
})
export class BookmarksModule { }
