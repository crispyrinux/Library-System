import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(dto: CreateMemberDto): Promise<import("./entities/member.entity").Member>;
    findAll(): Promise<import("./entities/member.entity").Member[]>;
    findOne(id: string): Promise<import("./entities/member.entity").Member>;
    update(id: string, dto: UpdateMemberDto): Promise<import("./entities/member.entity").Member>;
    remove(id: string): Promise<void>;
}
