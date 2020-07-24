import { Controller, Get, ParseUUIDPipe, Param, Body, Post, Headers, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { AppService } from '../app.service';

@Controller('articles')
export class ArticlesController {
    constructor(readonly articlesService: ArticlesService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() createArticleDto: ArticleDto
    ): Promise<object> {
        return this.articlesService.create(token, createArticleDto);
    }

    @Get(':slug')
    findOne(
        @Param('slug') slug: string,
        @Headers('authorization') token: string
    ): Promise<object> {
        return this.articlesService.findOne(slug, [
            AppService.USER_SERVICE_INCLUDE,
            AppService.RATINGS_SERVICE_INCLUDE,
            AppService.COMMENTS_SERVICE_INCLUDE
        ], token);
    }

    @Get()
    findAll(@Headers('authorization') token: string): Promise<Array<object>> {
        return this.articlesService.findAll([
            AppService.USER_SERVICE_INCLUDE,
            AppService.RATINGS_SERVICE_INCLUDE,
            AppService.COMMENTS_SERVICE_INCLUDE
        ], token);
    }

    @Get('user/:userId')
    findAllByUser(
        @Param('userId', new ParseUUIDPipe()) userId: string,
        @Headers('authorization') token: string
    ): Promise<Array<object>> {
        return this.articlesService.findAllByUser(userId, [
            AppService.USER_SERVICE_INCLUDE,
            AppService.RATINGS_SERVICE_INCLUDE
        ], token);
    }

    @Put(':slug')
    @HttpCode(HttpStatus.NO_CONTENT)
    update(
        @Headers('authorization') token: string,
        @Param('slug') slug: string,
        @Body() articleDto: ArticleDto
    ): Promise<void> {
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
