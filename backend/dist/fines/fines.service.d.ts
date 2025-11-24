import { Repository } from 'typeorm';
import { Fine } from './entities/fine.entity';
import { Loan } from '../loans/entities/loan.entity';
import { QueryFineDto } from './dto/query-fine.dto';
import { UpdateFineStatusDto } from './dto/update-fine-status.dto';
export declare class FinesService {
    private readonly finesRepo;
    constructor(finesRepo: Repository<Fine>);
    createForLoan(loan: Loan, lateDays: number, amount: number): Promise<Fine>;
    findAll(query: QueryFineDto): Promise<{
        data: Fine[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Fine>;
    updateStatus(id: string, dto: UpdateFineStatusDto): Promise<Fine>;
}
