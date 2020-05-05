import { Controller, Get, ParseUUIDPipe, Param, Body, Post, Headers, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleDto } from './dto/article.dto';
import { CreateArticleDto } from './dto/create-article.dto';

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
    findOne(@Param('slug') slug: string): Promise<object> {
        return this.articlesService.findOne(slug, [
            this.articlesService.USER_SERVICE_INCLUDE,
            this.articlesService.RATINGS_SERVICE_INCLUDE
        ]);
    }

    @Get()
    findAll(): Promise<Array<object>> {
        return this.articlesService.findAll([
            this.articlesService.USER_SERVICE_INCLUDE,
            this.articlesService.RATINGS_SERVICE_INCLUDE
        ]);
    }

    @Get('user/:userId')
    findAllByUser(
        @Param('userId', new ParseUUIDPipe()) userId: string
    ): Promise<Array<object>> {
        return this.articlesService.findAllByUser(userId, [
            this.articlesService.USER_SERVICE_INCLUDE,
            this.articlesService.RATINGS_SERVICE_INCLUDE
        ]);
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

    // @Delete(':slug')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // delete(
    //     @Headers('authorization') token: string,
    //     @Param('slug') slug: string
    // ): Promise<void> {
    //     return this.articlesService.delete(token, slug);
    // }
}
