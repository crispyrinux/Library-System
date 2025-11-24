// src/books/dto/create-book.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ required: false, example: 2009 })
  @IsInt()
  @IsOptional()
  publication_year?: number;
}
