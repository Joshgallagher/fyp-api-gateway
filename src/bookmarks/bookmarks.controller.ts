import { Controller, Get, Headers, Body, Post, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body('articleSlug') articleSlug: string
    ): Promise<any> {
        return this.bookmarksService.create(token, articleSlug);
    }

    @Get()
    findAll(@Headers('authorization') token: string): Promise<any> {
        return this.bookmarksService.findAll(token);
    }
}
