// src/loans/loans.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { Loan } from './entities/loan.entity';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';
import { FinesModule } from '../fines/fines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan]),
    BooksModule,
    MembersModule,
    FinesModule,
  ],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}
