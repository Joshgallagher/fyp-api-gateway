import { Controller, Get, Headers, Body, Post, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { AppService } from '../app.service';

@Controller('bookmarks')
export class BookmarksController {
    constructor(
        private readonly bookmarksService: BookmarksService
    ) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() bookmarkDto: BookmarkDto
    ): Promise<any> {
        return this.bookmarksService.create(token, bookmarkDto);
    }

    @Get()
    findAll(@Headers('authorization') token: string): Promise<any> {
        return this.bookmarksService.findAll(token, [AppService.ARTICLES_SERVICE_INCLUDE]);
    }

    @Delete(':slug')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(
        @Headers('authorization') token: string,
        @Param('slug') slug: string
    ): void {
        this.bookmarksService.delete(token, slug);
    }
}
