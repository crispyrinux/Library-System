// src/loans/dto/create-loan.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  member_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  book_id: string;
}
