// src/books/entities/book.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid', { name: 'book_id' })
  book_id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  genre?: string;

  @Column({ type: 'int', nullable: true })
  publication_year?: number;

  @Column({ default: true })
  is_available: boolean;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
