// src/loans/loans.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ReturnLoanDto } from './dto/return-loan.dto';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { QueryLoanDto } from './dto/query-loan.dto';
import { FinesService } from '../fines/fines.service';

@Injectable()
export class LoansService {
  private readonly LOAN_DAYS = 14;
  private readonly DAILY_FINE = 3000;

  constructor(
    @InjectRepository(Loan)
    private readonly loansRepo: Repository<Loan>,
    private readonly booksService: BooksService,
    private readonly membersService: MembersService,
    private readonly finesService: FinesService,
  ) {}

  async create(dto: CreateLoanDto): Promise<Loan> {
    const book = await this.booksService.findOne(dto.book_id);
    const member = await this.membersService.findOne(dto.member_id);

    if (!book.is_available) {
      throw new BadRequestException('Book is not available');
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + this.LOAN_DAYS);

    const loan = this.loansRepo.create({
      book,
      member,
      borrow_date: today.toISOString().substring(0, 10),
      due_date: dueDate.toISOString().substring(0, 10),
      return_date: null,
    });

    const saved = await this.loansRepo.save(loan);
    await this.booksService.markAvailable(book.book_id, false);

    return saved;
  }

  async findAll(query: QueryLoanDto) {
    const { page = 1, limit = 10, member_id, activeOnly } = query;

    const qb = this.loansRepo
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.member', 'member')
      .leftJoinAndSelect('loan.book', 'book')
      .leftJoinAndSelect('loan.fine', 'fine')
      .orderBy('loan.borrow_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (member_id) {
      qb.andWhere('member.member_id = :member_id', { member_id });
    }

    if (activeOnly === 'true') {
      qb.andWhere('loan.return_date IS NULL');
    }

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Loan> {
    const loan = await this.loansRepo.findOne({
      where: { loan_id: id },
      relations: ['member', 'book', 'fine'],
    });
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
  }

  async returnLoan(id: string, dto: ReturnLoanDto): Promise<Loan> {
    const loan = await this.findOne(id);

    if (loan.return_date) {
      throw new BadRequestException('Loan already returned');
    }

    const today = dto.return_date
      ? new Date(dto.return_date)
      : new Date();

    loan.return_date = today.toISOString().substring(0, 10);

    const due = new Date(loan.due_date);
    const lateMs = today.getTime() - due.getTime();
    const lateDays = Math.max(0, Math.ceil(lateMs / (1000 * 60 * 60 * 24)));

    const updatedLoan = await this.loansRepo.save(loan);
    await this.booksService.markAvailable(loan.book.book_id, true);

    if (lateDays > 0) {
      const amount = lateDays * this.DAILY_FINE;
      await this.finesService.createForLoan(updatedLoan, lateDays, amount);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const loan = await this.findOne(id);
    await this.loansRepo.remove(loan);
  }
}
