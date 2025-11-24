import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(dto: CreateBookDto): Promise<import("./entities/book.entity").Book>;
    findAll(query: QueryBookDto): Promise<{
        data: import("./entities/book.entity").Book[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/book.entity").Book>;
    update(id: string, dto: UpdateBookDto): Promise<import("./entities/book.entity").Book>;
    remove(id: string): Promise<void>;
}
