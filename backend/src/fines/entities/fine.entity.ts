// src/fines/entities/fine.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity';

@Entity('fines')
export class Fine {
  @PrimaryGeneratedColumn('uuid', { name: 'fine_id' })
  fine_id: string;

  @OneToOne(() => Loan, (loan) => loan.fine, { eager: true })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @Column({ type: 'int' })
  late_days: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: false })
  is_paid: boolean;

  @Column({ type: 'date' })
  fine_date: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
