import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ItemService } from './item-service';
import { mockApiSuccess, mockApiError, resetApiMocks } from '@/tests/mocks/api-client.mock';
import { Item } from '@/types/Items/Item';
import { apiClient } from '@/lib/api-client';

// Mock the API client module
vi.mock('@/lib/api-client');

describe('ItemService', () => {
    // Sample test data
    const mockItem: Item = {
        id: 'item-123',
        name: 'Test Item',
        description: 'This is a test item',
        price: 100,
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
    };

    const mockItems = {
        data: [mockItem],
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
        it('should fetch all items with pagination', async () => {
            // Arrange
            mockApiSuccess({ data: mockItems });

            // Act
            const result = await ItemService.getAll(1, 10);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items?page=1&limit=10');
            expect(result).toEqual(mockItems);
        });

        it('should handle API errors', async () => {
            // Arrange
            const error = mockApiError(500, 'Server error');

            // Act + Assert
            await expect(ItemService.getAll()).rejects.toThrow('Server error');
        });
    });

    describe('getById', () => {
        it('should fetch an item by id', async () => {
            // Arrange
            mockApiSuccess({ data: { data: mockItem } });

            // Act
            const result = await ItemService.getById('item-123');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items/item-123');
            expect(result).toEqual(mockItem);
        });
    });

    describe('create', () => {
        it('should create a new item', async () => {
            // Arrange
            const newItem = { name: 'New Item', description: 'New item description', price: 50 };
            mockApiSuccess({ data: { data: { ...mockItem, ...newItem } } });

            // Act
            const result = await ItemService.create(newItem);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'POST',
                data: newItem
            });
            expect(result).toEqual({ ...mockItem, ...newItem });
        });
    });

    describe('update', () => {
        it('should update an existing item', async () => {
            // Arrange
            const updateData = { name: 'Updated Item' };
            mockApiSuccess({ data: { data: { ...mockItem, ...updateData } } });

            // Act
            const result = await ItemService.update('item-123', updateData);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items/item-123');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'PUT',
                data: updateData
            });
            expect(result).toEqual({ ...mockItem, ...updateData });
        });
    });

    describe('delete', () => {
        it('should delete an item', async () => {
            // Arrange
            mockApiSuccess({});

            // Act
            await ItemService.delete('item-123');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items/item-123');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'DELETE'
            });
        });
    });

    describe('search', () => {
        it('should search for items with criteria', async () => {
            // Arrange
            const searchCriteria = { name: 'Test', status: 'active' };
            mockApiSuccess({ data: mockItems });

            // Act
            const result = await ItemService.search(searchCriteria);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('/items/search?');
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('name=Test');
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('status=active');
            expect(result).toEqual(mockItems);
        });

        it('should handle nested search criteria', async () => {
            // Arrange
            const searchCriteria = {
                name: 'Test',
                price: { min: 50, max: 100 }
            };
            mockApiSuccess({ data: mockItems });

            // Act
            const result = await ItemService.search(searchCriteria);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('price.min=50');
            expect(vi.mocked(apiClient).mock.calls[0][0]).toContain('price.max=100');
            expect(result).toEqual(mockItems);
        });
    });

    describe('setStatus', () => {
        it('should update the item status', async () => {
            // Arrange
            const updatedItem = { ...mockItem, status: 'inactive' };
            mockApiSuccess({ data: { data: updatedItem } });

            // Act
            const result = await ItemService.setStatus('item-123', 'inactive');

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items/item-123/status');
            expect(vi.mocked(apiClient).mock.calls[0][1]).toEqual({
                method: 'PATCH',
                data: { status: 'inactive' }
            });
            expect(result).toEqual(updatedItem);
        });
    });

    describe('uploadImages', () => {
        it('should upload images for an item', async () => {
            // Arrange
            const mockFiles = [new File([''], 'test.jpg')];
            const mockImageUrls = ['https://example.com/test.jpg'];
            mockApiSuccess({ data: { data: mockImageUrls } });

            // Act
            const result = await ItemService.uploadImages('item-123', mockFiles);

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items/item-123/images');
            expect(vi.mocked(apiClient).mock.calls[0][1]?.method).toBe('POST');
            expect(vi.mocked(apiClient).mock.calls[0][1]?.headers).toEqual({
                'Content-Type': 'multipart/form-data'
            });
            expect(result).toEqual(mockImageUrls);
        });
    });

    describe('getStatistics', () => {
        it('should fetch item statistics', async () => {
            // Arrange
            const mockStats = { total: 100, active: 80, inactive: 20 };
            mockApiSuccess({ data: { data: mockStats } });

            // Act
            const result = await ItemService.getStatistics();

            // Assert
            expect(vi.mocked(apiClient).mock.calls[0][0]).toBe('/items/statistics');
            expect(result).toEqual(mockStats);
        });
    });
});
