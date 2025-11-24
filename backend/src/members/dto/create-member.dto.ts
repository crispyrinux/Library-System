// src/members/dto/create-member.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Tanggal bergabung',
    example: '2023-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  membership_date?: string;
}
