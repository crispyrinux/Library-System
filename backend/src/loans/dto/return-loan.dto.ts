// src/loans/dto/return-loan.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ReturnLoanDto {
  @ApiPropertyOptional({
    description: 'Tanggal pengembalian; default: hari ini',
    example: '2025-11-23',
  })
  @IsOptional()
  @IsDateString()
  return_date?: string;
}
