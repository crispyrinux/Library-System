import { FinesService } from './fines.service';
import { QueryFineDto } from './dto/query-fine.dto';
import { UpdateFineStatusDto } from './dto/update-fine-status.dto';
export declare class FinesController {
    private readonly finesService;
    constructor(finesService: FinesService);
    findAll(query: QueryFineDto): Promise<{
        data: import("./entities/fine.entity").Fine[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/fine.entity").Fine>;
    updateStatus(id: string, dto: UpdateFineStatusDto): Promise<import("./entities/fine.entity").Fine>;
}
