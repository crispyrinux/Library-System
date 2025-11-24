// src/fines/fines.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fine } from './entities/fine.entity';
import { Loan } from '../loans/entities/loan.entity';
import { QueryFineDto } from './dto/query-fine.dto';
import { UpdateFineStatusDto } from './dto/update-fine-status.dto';

@Injectable()
export class FinesService {
  constructor(
    @InjectRepository(Fine)
    private readonly finesRepo: Repository<Fine>,
  ) {}

  async createForLoan(
    loan: Loan,
    lateDays: number,
    amount: number,
  ): Promise<Fine> {
    const fine = this.finesRepo.create({
      loan,
      late_days: lateDays,
      amount,
      is_paid: false,
      fine_date: new Date().toISOString().substring(0, 10),
    });

    return this.finesRepo.save(fine);
  }

  async findAll(query: QueryFineDto) {
    const { page = 1, limit = 10, isPaid } = query;

    const qb = this.finesRepo
      .createQueryBuilder('fine')
      .leftJoinAndSelect('fine.loan', 'loan')
      .leftJoinAndSelect('loan.member', 'member')
      .leftJoinAndSelect('loan.book', 'book')
      .orderBy('fine.fine_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (isPaid !== undefined) {
      qb.andWhere('fine.is_paid = :paid', { paid: isPaid === 'true' });
    }

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Fine> {
    const fine = await this.finesRepo.findOne({
      where: { fine_id: id },
      relations: ['loan', 'loan.member', 'loan.book'],
    });
    if (!fine) throw new NotFoundException('Fine not found');
    return fine;
  }

  async updateStatus(id: string, dto: UpdateFineStatusDto): Promise<Fine> {
    const fine = await this.findOne(id);

    if (dto.is_paid !== undefined) {
      fine.is_paid = dto.is_paid;
      fine.paid_at = dto.is_paid ? new Date() : null;
    }

    return this.finesRepo.save(fine);
  }
}
