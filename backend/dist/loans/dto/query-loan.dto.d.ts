import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
export declare class QueryLoanDto extends PaginationQueryDto {
    member_id?: string;
    activeOnly?: string;
}
