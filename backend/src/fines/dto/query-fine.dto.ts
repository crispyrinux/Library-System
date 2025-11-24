// src/fines/dto/query-fine.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class QueryFineDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter berdasarkan status pembayaran' })
  @IsOptional()
  @IsBooleanString()
  isPaid?: string;
}
