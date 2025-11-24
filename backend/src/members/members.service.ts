// src/members/members.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepo: Repository<Member>,
  ) {}

  async create(dto: CreateMemberDto): Promise<Member> {
    const member = this.membersRepo.create(dto);
    return this.membersRepo.save(member);
  }

  async findAll(): Promise<Member[]> {
    return this.membersRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Member> {
    const member = await this.membersRepo.findOne({ where: { member_id: id } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async update(id: string, dto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);
    Object.assign(member, dto);
    return this.membersRepo.save(member);
  }

  async remove(id: string): Promise<void> {
    const member = await this.findOne(id);
    await this.membersRepo.remove(member);
  }
}
