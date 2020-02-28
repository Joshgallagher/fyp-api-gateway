import { Controller, Get, ParseUUIDPipe, Param, Body, Post, Headers, Put, Delete } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() article: Record<string, any>
    ): Promise<object> {
        return this.articlesService.create(token, article);
    }

    @Get()
    findAll(): Promise<Array<object>> {
        return this.articlesService.findAll();
    }

    @Get('user/:userId')
    findAllByUser(
        @Param('userId', new ParseUUIDPipe()) userId: string
    ): Promise<Array<object>> {
        return this.articlesService.findAllByUser(userId);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string): Promise<object> {
        return this.articlesService.findOne(slug);
    }

    @Put(':slug')
    update(
        @Headers('authorization') token: string,
        @Param('slug') slug: string,
        @Body() article: Record<string, any>
    ): Promise<object> {
        return this.articlesService.update(token, slug, article);
    }

    @Delete(':slug')
    delete(
        @Headers('authorization') token: string,
        @Param('slug') slug: string
    ): Promise<void> {
        return this.articlesService.delete(token, slug);
    }
}
