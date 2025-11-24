// src/fines/dto/update-fine-status.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFineStatusDto {
  @ApiPropertyOptional({ description: 'true = tandai lunas' })
  @IsOptional()
  @IsBoolean()
  is_paid?: boolean;
}
