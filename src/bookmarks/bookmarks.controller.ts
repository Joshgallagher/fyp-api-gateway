import { Controller, Get, Headers, Body, Post, ParseIntPipe, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';

@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() bookmarkDto: BookmarkDto
    ): Promise<any> {
        return this.bookmarksService.create(token, bookmarkDto);
    }

    @Get()
    findAll(@Headers('authorization') token: string): Promise<any> {
        return this.bookmarksService.findAll(token);
    }

    @Delete()
    delete(
        @Headers('authorization') token: string,
        @Body() bookmarkDto: BookmarkDto
    ): Promise<any> {
        return this.bookmarksService.delete(token, bookmarkDto);
    }
}
