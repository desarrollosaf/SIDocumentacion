export declare class PaginationDto {
    page: number;
    perPage: number;
    search?: string;
}
export interface Paginated<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
}
export declare function paginate<T>(data: T[], total: number, { page, perPage }: PaginationDto): Paginated<T>;
