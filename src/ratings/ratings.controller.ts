import { Controller, Post, Headers, Body, Get, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingDto } from './dto/rating.dto';

@Controller('ratings')
export class RatingsController {
    constructor(private readonly ratingsService: RatingsService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() ratingDto: RatingDto
    ) {
        return this.ratingsService.create(token, ratingDto);
    }

    @Get(':articleId')
    findOne(@Param('articleId') articleId: number) {
        return this.ratingsService.findOne(articleId);
    }

    @Get(':articleId/user')
    userArticleRating(
        @Headers('authorization') token: string,
        @Param('articleId') articleId: number
    ) {
        return this.ratingsService.userArticleRating(token, articleId);
    }
}
