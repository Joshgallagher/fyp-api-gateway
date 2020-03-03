import { Injectable, OnModuleInit, InternalServerErrorException, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { Metadata } from 'grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { ArticlesService } from '../articles/articles.service';
import { BookmarksServiceInterface } from '../services/interfaces/bookmarks-service.interface';
import { BOOKMARKS_SERVICE_PROVIDER_TOKEN } from 'src/services/providers/bookmarks-service.provider';
import { BookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarksService implements OnModuleInit {
    private bookmarksService: BookmarksServiceInterface;

    constructor(
        @Inject(BOOKMARKS_SERVICE_PROVIDER_TOKEN)
        private readonly client: ClientGrpc,
        @Inject('ArticlesService')
        private readonly articlesService: ArticlesService
    ) { }

    onModuleInit() {
        this.bookmarksService = this.client.getService<BookmarksServiceInterface>('BookmarksService');
    }

    async create(token: string, bookmarkDto: BookmarkDto) {
        const { articleSlug } = bookmarkDto;

        const { id: articleId } = await this.articlesService.findOne(articleSlug, false) as any;

        try {
            const metadata: Metadata = new Metadata();
            metadata.add('authorization', token);

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
            const { bookmarks } = await this.bookmarksService.findAllBookmarks({}, metadata).toPromise();

            if (bookmarks === undefined) {
                return [];
            }

            const ids = bookmarks.map(({ articleId }) => articleId);

            return await this.articlesService.findByIds(ids);
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async delete(token: string, bookmarkDto: BookmarkDto) {
        const { articleSlug } = bookmarkDto;

        const { id: articleId } = await this.articlesService.findOne(articleSlug, false) as any;

        try {
            const metadata: Metadata = new Metadata();
            metadata.add('authorization', token);

            return await this.bookmarksService.deleteBookmark({ articleId }, metadata).toPromise();
        } catch ({ code, metadata, details }) {
            const errorMetadata = (metadata as Metadata);
            const message = errorMetadata.get('error')[0];

            if (details === 'BOOKMARK_NOT_FOUND') {
                throw new NotFoundException({ message });
            }

            throw new InternalServerErrorException();
        }
    }
}
