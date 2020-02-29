import { Injectable, OnModuleInit, InternalServerErrorException, ConflictException, Inject } from '@nestjs/common';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { bookmarkServiceConfig } from '../services/config/bookmark-service.config';
import { Metadata } from 'grpc';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class BookmarksService implements OnModuleInit {
    @Client(bookmarkServiceConfig)
    client: ClientGrpc;
    bookmarksService: any;

    constructor(
        @Inject('ArticlesService')
        private readonly articlesService: ArticlesService
    ) { }

    onModuleInit() {
        this.bookmarksService = this.client.getService('BookmarksService');
    }

    async create(token: string, articleSlug: string) {
        const metadata: Metadata = new Metadata();
        metadata.add('authorization', token);

        const { id: articleId } = await this.articlesService.findOne(articleSlug, false) as any;

        try {
            return await this.bookmarksService.createBookmark({ articleId }, metadata).toPromise();
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const message = errorMetadata.get('error')[0];

            if (details === 'BOOKMARK_EXISTS') {
                throw new ConflictException({ message });
            }

            if (details === 'INTERNAL_ERROR') {
                throw new InternalServerErrorException({ message });
            }

            throw new InternalServerErrorException();
        }
    }

    async findAll(token: string) {
        const metadata: Metadata = new Metadata();
        metadata.add('authorization', token);

        try {
            return await this.bookmarksService.findAllBookmarks({}, metadata).toPromise();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
