import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('hasInclude', () => {
        const include: string = 'TEST_SERVICE_INCLUDE';
        const otherInclude: string = 'TEST_SERVICE_INCLUDE_2';
        const includes: string[] = [include];

        it('An include is present', () => {
            const hasInclude = service.hasInclude(includes, include);

            expect(hasInclude).toBe(true);
        });

        it('An include is not present', () => {
            const hasInclude = service.hasInclude(includes, otherInclude);

            expect(hasInclude).toBe(false);
        });
    });
});
