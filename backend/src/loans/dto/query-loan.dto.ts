// src/loans/dto/query-loan.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryLoanDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by member_id' })
  @IsOptional()
  @IsString()
  member_id?: string;

  @ApiPropertyOptional({ description: 'true = hanya yang aktif' })
  @IsOptional()
  @IsBooleanString()
  activeOnly?: string;
}
