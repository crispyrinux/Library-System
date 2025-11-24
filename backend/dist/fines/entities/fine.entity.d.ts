import { Loan } from '../../loans/entities/loan.entity';
export declare class Fine {
    fine_id: string;
    loan: Loan;
    late_days: number;
    amount: number;
    is_paid: boolean;
    fine_date: string;
    paid_at?: Date | null;
    created_at: Date;
    updated_at: Date;
}
