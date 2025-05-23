import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UserService } from './user-service';
import { mockApiSuccess, mockApiError, resetApiMocks } from '@/tests/mocks/api-client.mock';
import { User } from '@/types/Users/User';
import { apiClient } from '@/lib/api-client';

// Mock the API client module
vi.mock('@/lib/api-client');

describe('UserService', () => {
    // Sample test data
    const mockUser: User = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        personal: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com'
        }
    };

    const mockUsers = {
        data: [mockUser],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            perPage: 10
        }
    };

    // Reset mocks before each test
    beforeEach(() => {
        resetApiMocks();
    });

    // Clean up after each test
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('should fetch all users with pagination', async () => {
            // Arrange
            mockApiSuccess({ data: mockUsers });

            // Act
            const result = await UserService.getAll(1, 10);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users?page=1&limit=10');
            expect(result).toEqual(mockUsers);
        });

        it('should handle API errors', async () => {
            // Arrange
            const error = mockApiError(500, 'Server error');

            // Act + Assert
            await expect(UserService.getAll()).rejects.toThrow('Server error');
        });
    });

    describe('getById', () => {
        it('should fetch a user by id', async () => {
            // Arrange
            mockApiSuccess({ data: { data: mockUser } });

            // Act
            const result = await UserService.getById('user-123');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/user-123');
            expect(result).toEqual(mockUser);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            // Arrange
            const newUser = {
                username: 'newuser',
                email: 'new@example.com',
                personal: {
                    firstName: 'New',
                    lastName: 'User',
                    email: 'new@example.com'
                }
            };
            mockApiSuccess({ data: { data: { ...mockUser, ...newUser } } });

            // Act
            const result = await UserService.create(newUser);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'POST',
                data: newUser
            });
            expect(result).toEqual({ ...mockUser, ...newUser });
        });
    });

    describe('update', () => {
        it('should update an existing user', async () => {
            // Arrange
            const updateData = {
                personal: {
                    firstName: 'Updated',
                    lastName: 'User'
                }
            };
            mockApiSuccess({ data: { data: { ...mockUser, ...updateData } } });

            // Act
            const result = await UserService.update('user-123', updateData);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/user-123');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'PUT',
                data: updateData
            });
            expect(result).toEqual({ ...mockUser, ...updateData });
        });
    });

    describe('delete', () => {
        it('should delete a user', async () => {
            // Arrange
            mockApiSuccess({});

            // Act
            await UserService.delete('user-123');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/user-123');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'DELETE'
            });
        });
    });

    describe('search', () => {
        it('should search for users with criteria', async () => {
            // Arrange
            const searchCriteria = { username: 'test', role: 'user' };
            mockApiSuccess({ data: mockUsers });

            // Act
            const result = await UserService.search(searchCriteria);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('/users/search?');
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('username=test');
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('role=user');
            expect(result).toEqual(mockUsers);
        });

        it('should handle nested search criteria', async () => {
            // Arrange
            const searchCriteria = {
                username: 'test',
                personal: { firstName: 'Test' }
            };
            mockApiSuccess({ data: mockUsers });

            // Act
            const result = await UserService.search(searchCriteria);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('personal.firstName=Test');
            expect(result).toEqual(mockUsers);
        });
    });

    describe('setStatus', () => {
        it('should update the user status', async () => {
            // Arrange
            const updatedUser = { ...mockUser, status: 'inactive' };
            mockApiSuccess({ data: { data: updatedUser } });

            // Act
            const result = await UserService.setStatus('user-123', 'inactive');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/user-123/status');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'PATCH',
                data: { status: 'inactive' }
            });
            expect(result).toEqual(updatedUser);
        });
    });

    describe('setRole', () => {
        it('should update the user role', async () => {
            // Arrange
            const updatedUser = { ...mockUser, role: 'admin' };
            mockApiSuccess({ data: { data: updatedUser } });

            // Act
            const result = await UserService.setRole('user-123', 'admin');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/user-123/role');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'PATCH',
                data: { role: 'admin' }
            });
            expect(result).toEqual(updatedUser);
        });
    });

    describe('uploadAvatar', () => {
        it('should upload an avatar for a user', async () => {
            // Arrange
            const mockFile = new File([''], 'avatar.jpg');
            const mockAvatarUrl = 'https://example.com/avatar.jpg';
            mockApiSuccess({ data: { data: mockAvatarUrl } });

            // Act
            const result = await UserService.uploadAvatar('user-123', mockFile);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/user-123/avatar');
            expect(vi.mocked(apiClient).mock.calls[0][1]?.method).toBe('POST');
            expect(vi.mocked(apiClient).mock.calls[0][1]?.headers).toEqual({
                'Content-Type': 'multipart/form-data'
            });
            expect(result).toEqual(mockAvatarUrl);
        });
    });

    describe('getStatistics', () => {
        it('should fetch user statistics', async () => {
            // Arrange
            const mockStats = { total: 100, active: 80, inactive: 20 };
            mockApiSuccess({ data: { data: mockStats } });

            // Act
            const result = await UserService.getStatistics();

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/users/statistics');
            expect(result).toEqual(mockStats);
        });
    });
});
