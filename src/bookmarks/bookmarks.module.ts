import { Module } from '@nestjs/common';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
    imports: [ArticlesModule]
})
export class BookmarksModule { }
