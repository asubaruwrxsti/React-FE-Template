import { User, UserSearchCriteria } from '@/types/Users/User';
import { apiClient } from '@/lib/api-client';
import { PaginatedResponse } from '@/types/App/paginated-response';
import { ApiResponse, SingleItemResponse, extractData } from '@/types/App/api-response';

/**
 * Generic service for working with users
 */
export const UserService = {
    // Get all users with pagination
    async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
        const response = await apiClient<ApiResponse<User>>(`/users?page=${page}&limit=${limit}`);
        return extractData(response);
    },

    // Get a single user by ID
    async getById(id: string): Promise<User> {
        const response = await apiClient<SingleItemResponse<User>>(`/users/${id}`);
        return extractData(response).data;
    },

    // Create a new user
    async create(user: Partial<User>): Promise<User> {
        const response = await apiClient<SingleItemResponse<User>>('/users', {
            method: 'POST',
            data: user,
        });
        return extractData(response).data;
    },

    // Update an existing user
    async update(id: string, user: Partial<User>): Promise<User> {
        const response = await apiClient<SingleItemResponse<User>>(`/users/${id}`, {
            method: 'PUT',
            data: user,
        });
        return extractData(response).data;
    },

    // Delete a user
    async delete(id: string): Promise<void> {
        await apiClient(`/users/${id}`, {
            method: 'DELETE',
        });
    },

    // Search for users based on criteria
    async search(criteria: UserSearchCriteria): Promise<PaginatedResponse<User>> {
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

        const response = await apiClient<ApiResponse<User>>(`/users/search?${queryParams}`);
        return extractData(response);
    },

    // Update user status
    async setStatus(id: string, status: string): Promise<User> {
        const response = await apiClient<SingleItemResponse<User>>(`/users/${id}/status`, {
            method: 'PATCH',
            data: { status },
        });
        return extractData(response).data;
    },

    // Update user role
    async setRole(id: string, role: string): Promise<User> {
        const response = await apiClient<SingleItemResponse<User>>(`/users/${id}/role`, {
            method: 'PATCH',
            data: { role },
        });
        return extractData(response).data;
    },

    // Upload user avatar
    async uploadAvatar(id: string, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await apiClient<{ data: string }>(`/users/${id}/avatar`, {
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return extractData(response).data;
    },

    // Get user statistics
    async getStatistics(): Promise<any> {
        const response = await apiClient<{ data: any }>('/users/statistics');
        return extractData(response).data;
    }
};
