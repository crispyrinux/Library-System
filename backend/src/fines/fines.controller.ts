// src/fines/fines.controller.ts
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FinesService } from './fines.service';
import { QueryFineDto } from './dto/query-fine.dto';
import { UpdateFineStatusDto } from './dto/update-fine-status.dto';

@ApiTags('fines')
@Controller('fines')
export class FinesController {
  constructor(private readonly finesService: FinesService) {}

  @Get()
  findAll(@Query() query: QueryFineDto) {
    return this.finesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateFineStatusDto) {
    return this.finesService.updateStatus(id, dto);
  }
}
