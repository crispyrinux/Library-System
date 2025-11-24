import { Loan } from '../../loans/entities/loan.entity';
export declare class Member {
    member_id: string;
    name: string;
    email: string;
    phone?: string;
    membership_date: string;
    loans: Loan[];
    created_at: Date;
    updated_at: Date;
}
