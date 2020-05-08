import { Injectable, OnModuleInit, InternalServerErrorException, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { Metadata } from 'grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { ArticlesService } from '../articles/articles.service';
import { BookmarksServiceInterface } from '../services/interfaces/bookmarks-service.interface';
import { BOOKMARKS_SERVICE_PROVIDER_TOKEN } from '../services/providers/bookmarks-service.provider';
import { BookmarkDto } from './dto/bookmark.dto';
import { AppService } from '../app.service';

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
        this.bookmarksService = this.client
            .getService<BookmarksServiceInterface>('BookmarksService');
    }

    /**
     * Creates a bookmark of a given article.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param bookmarkDto Contains the article IDs
     */
    public async create(
        token: string,
        bookmarkDto: BookmarkDto
    ): Promise<object> {
        const { articleSlug } = bookmarkDto;

        const { id }: Record<string, any> = await this.articlesService
            .findOne(articleSlug);

        try {
            const metadata: Metadata = new Metadata();
            metadata.add('authorization', token);

            const create = await this.bookmarksService
                .createBookmark({ articleId: id }, metadata)
                .toPromise();

            return create;
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

    /**
     * The currently authenticating users bookmarks can be retrieved.
     * 
     * @param token OpenID Connect 1.0 Token
     */
    public async findAll(token: string) {
        let userBookmarks: Record<string, any>[];

        try {
            const metadata: Metadata = new Metadata();
            metadata.add('authorization', token);

            const { bookmarks } = await this.bookmarksService
                .findAllBookmarks({}, metadata)
                .toPromise();

            if (bookmarks === undefined) {
                return [];
            }

            userBookmarks = bookmarks;
        } catch (e) {
            throw new InternalServerErrorException();
        }

        const bookmarkIds = userBookmarks.map(({ articleId }) => articleId);
        const aggregate = await this.articlesService.findByIds(bookmarkIds, [
            AppService.USER_SERVICE_INCLUDE,
            AppService.RATINGS_SERVICE_INCLUDE
        ]);

        return aggregate;
    }

    /**
     * Deletes a users bookmark.
     * 
     * @param token OpenID Connect 1.0 Token
     * @param bookmarkDto Contains the article IDs
     */
    public async delete(token: string, bookmarkDto: BookmarkDto) {
        const { articleSlug } = bookmarkDto;

        const { id }: Record<string, any> = await this.articlesService
            .findOne(articleSlug);

        try {
            const metadata: Metadata = new Metadata();
            metadata.add('authorization', token);

            await this.bookmarksService
                .deleteBookmark({ articleId: id }, metadata)
                .toPromise();
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
