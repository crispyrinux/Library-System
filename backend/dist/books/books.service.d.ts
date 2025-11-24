import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
export declare class BooksService {
    private readonly booksRepo;
    constructor(booksRepo: Repository<Book>);
    create(dto: CreateBookDto): Promise<Book>;
    findAll(query: QueryBookDto): Promise<{
        data: Book[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Book>;
    update(id: string, dto: UpdateBookDto): Promise<Book>;
    remove(id: string): Promise<void>;
    markAvailable(id: string, available: boolean): Promise<Book>;
}
