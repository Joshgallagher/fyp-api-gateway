import { Controller, ParseIntPipe, Get, Param, Post, Body, Headers, Put, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(readonly commentsService: CommentsService) { }

    @Post()
    create(
        @Headers('authorization') token: string,
        @Body() commenDto: CommentDto
    ): Promise<object> {
        return this.commentsService.create(token, commenDto);
    }

    @Get('/article/:id')
    findAll(
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<object[]> {
        return this.commentsService.findAll(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    update(
        @Headers('authorization') token: string,
        @Param('id') id: string,
        @Body() commenDto: CommentDto
    ): Promise<void> {
        return this.commentsService.update(token, id, commenDto);
    }
}
