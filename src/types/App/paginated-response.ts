export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    meta: {
        timestamp: string;
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        }
    }
}

export function createPaginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total?: number,
    message: string = "Data retrieved successfully"
): PaginatedResponse<T> {
    const actualTotal = total ?? data.length;
    const pages = Math.ceil(actualTotal / limit);

    return {
        success: true,
        message,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            pagination: {
                total: actualTotal,
                page,
                limit,
                pages
            }
        }
    };
}