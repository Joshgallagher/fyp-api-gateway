import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { bookmarkServiceConfig } from '../services/config/bookmark-service.config';
import { Metadata } from 'grpc';

@Injectable()
export class BookmarksService implements OnModuleInit {
    @Client(bookmarkServiceConfig)
    client: ClientGrpc;

    bookmarksService: any;

    onModuleInit() {
        this.bookmarksService = this.client.getService('BookmarksService');
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
