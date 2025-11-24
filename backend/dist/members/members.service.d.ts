import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
export declare class MembersService {
    private readonly membersRepo;
    constructor(membersRepo: Repository<Member>);
    create(dto: CreateMemberDto): Promise<Member>;
    findAll(): Promise<Member[]>;
    findOne(id: string): Promise<Member>;
    update(id: string, dto: UpdateMemberDto): Promise<Member>;
    remove(id: string): Promise<void>;
}
