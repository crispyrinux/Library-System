import { Member } from '../../members/entities/member.entity';
import { Book } from '../../books/entities/book.entity';
import { Fine } from '../../fines/entities/fine.entity';
export declare class Loan {
    loan_id: string;
    member: Member;
    book: Book;
    borrow_date: string;
    due_date: string;
    return_date?: string | null;
    fine: Fine;
    created_at: Date;
    updated_at: Date;
}
