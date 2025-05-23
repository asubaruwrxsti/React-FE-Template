import { Unit } from '../property';

/**
 * Generic API response interface for paginated data
 */
export interface ApiResponse<T> {
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

/**
 * API response interface for single item data
 */
export interface SingleItemResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: {
        timestamp: string;
    }
}

/**
 * API response for property unit data
 */
export interface UnitResponse {
    success: boolean;
    message: string;
    data: Unit;
}

/**
 * API response for property units list data
 */
export interface UnitsListResponse {
    success: boolean;
    message: string;
    data: Unit[];
}

/**
 * Helper function to extract data from API response
 */
export function extractData<T>(response: ApiResponse<T>): {
    data: T[];
    meta: ApiResponse<T>['meta'];
    success: boolean;
    message: string;
} {
    return {
        success: response.success,
        message: response.message,
        data: response.data,
        meta: response.meta
    };
}

/**
 * Helper function to extract single item data from API response
 */
export function extractSingleItemData<T>(response: SingleItemResponse<T>): T {
    return response.data;
}