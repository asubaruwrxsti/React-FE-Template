import { Item } from '@/types/Items/Item';
import { ItemSearchCriteria } from '@/types/Items/Item';
import { apiClient } from '@/lib/api-client';
import { PaginatedResponse } from '@/types/App/paginated-response';
import { ApiResponse, SingleItemResponse, extractData } from '@/types/App/api-response';

/**
 * Generic service for working with items
 */
export const ItemService = {
    // Get all items with pagination
    async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Item>> {
        const response = await apiClient<ApiResponse<Item>>(`/items?page=${page}&limit=${limit}`);
        return extractData(response);
    },

    // Get a single item by ID
    async getById(id: string): Promise<Item> {
        const response = await apiClient<SingleItemResponse<Item>>(`/items/${id}`);
        return extractData(response).data;
    },

    // Create a new item
    async create(item: Partial<Item>): Promise<Item> {
        const response = await apiClient<SingleItemResponse<Item>>('/items', {
            method: 'POST',
            data: item,
        });
        return extractData(response).data;
    },

    // Update an existing item
    async update(id: string, item: Partial<Item>): Promise<Item> {
        const response = await apiClient<SingleItemResponse<Item>>(`/items/${id}`, {
            method: 'PUT',
            data: item,
        });
        return extractData(response).data;
    },

    // Delete an item
    async delete(id: string): Promise<void> {
        await apiClient(`/items/${id}`, {
            method: 'DELETE',
        });
    },

    // Search for items based on criteria
    async search(criteria: ItemSearchCriteria): Promise<PaginatedResponse<Item>> {
        const queryParams = new URLSearchParams();

        // Add all criteria to query params
        for (const [key, value] of Object.entries(criteria)) {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(`${key}[]`, v));
                } else if (typeof value === 'object') {
                    for (const [subKey, subValue] of Object.entries(value)) {
                        queryParams.append(`${key}.${subKey}`, String(subValue));
                    }
                } else {
                    queryParams.append(key, String(value));
                }
            }
        }

        const response = await apiClient<ApiResponse<Item>>(`/items/search?${queryParams}`);
        return extractData(response);
    },

    // Set item status
    async setStatus(id: string, status: string): Promise<Item> {
        const response = await apiClient<SingleItemResponse<Item>>(`/items/${id}/status`, {
            method: 'PATCH',
            data: { status },
        });
        return extractData(response).data;
    },

    // Upload item images
    async uploadImages(id: string, files: File[]): Promise<string[]> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        const response = await apiClient<{ data: string[] }>(`/items/${id}/images`, {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return extractData(response).data;
    },

    // Add item components
    async addComponent(id: string, component: any): Promise<any> {
        const response = await apiClient<{ data: any }>(`/items/${id}/components`, {
            method: 'POST',
            data: component,
        });

        return extractData(response).data;
    },

    // Get statistics for items
    async getStatistics(): Promise<any> {
        const response = await apiClient<{ data: any }>('/items/statistics');
        return extractData(response).data;
    }
};
