import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
export declare class QueryBookDto extends PaginationQueryDto {
    search?: string;
    genre?: string;
    isAvailable?: string;
}
