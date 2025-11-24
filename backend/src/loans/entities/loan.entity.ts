// src/loans/entities/loan.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Member } from '../../members/entities/member.entity';
import { Book } from '../../books/entities/book.entity';
import { Fine } from '../../fines/entities/fine.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid', { name: 'loan_id' })
  loan_id: string;

  @ManyToOne(() => Member, (member) => member.loans, { eager: true })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Book, (book) => book.loans, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ type: 'date' })
  borrow_date: string;

  @Column({ type: 'date' })
  due_date: string;

  @Column({ type: 'date', nullable: true })
  return_date?: string | null;

  @OneToOne(() => Fine, (fine) => fine.loan)
  fine: Fine;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
