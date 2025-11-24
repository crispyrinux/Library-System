import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ReturnLoanDto } from './dto/return-loan.dto';
import { QueryLoanDto } from './dto/query-loan.dto';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    create(dto: CreateLoanDto): Promise<import("./entities/loan.entity").Loan>;
    findAll(query: QueryLoanDto): Promise<{
        data: import("./entities/loan.entity").Loan[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/loan.entity").Loan>;
    returnLoan(id: string, dto: ReturnLoanDto): Promise<import("./entities/loan.entity").Loan>;
    remove(id: string): Promise<void>;
}
