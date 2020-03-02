import { Controller, Get, ParseUUIDPipe, Param, Body, Post, Headers, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() articleDto: ArticleDto
    ): Promise<object> {
        return this.articlesService.create(token, articleDto);
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
        @Body() articleDto: ArticleDto
    ): Promise<object> {
        return this.articlesService.update(token, slug, articleDto);
    }

    @Delete(':slug')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(
        @Headers('authorization') token: string,
        @Param('slug') slug: string
    ): Promise<void> {
        return this.articlesService.delete(token, slug);
    }
}
