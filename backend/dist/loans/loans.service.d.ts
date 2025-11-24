import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ReturnLoanDto } from './dto/return-loan.dto';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { QueryLoanDto } from './dto/query-loan.dto';
import { FinesService } from '../fines/fines.service';
export declare class LoansService {
    private readonly loansRepo;
    private readonly booksService;
    private readonly membersService;
    private readonly finesService;
    private readonly LOAN_DAYS;
    private readonly DAILY_FINE;
    constructor(loansRepo: Repository<Loan>, booksService: BooksService, membersService: MembersService, finesService: FinesService);
    create(dto: CreateLoanDto): Promise<Loan>;
    findAll(query: QueryLoanDto): Promise<{
        data: Loan[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Loan>;
    returnLoan(id: string, dto: ReturnLoanDto): Promise<Loan>;
    remove(id: string): Promise<void>;
}
