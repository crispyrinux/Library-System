import { Loan } from '../../loans/entities/loan.entity';
export declare class Book {
    book_id: string;
    title: string;
    author: string;
    genre?: string;
    publication_year?: number;
    is_available: boolean;
    loans: Loan[];
    created_at: Date;
    updated_at: Date;
}
