import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from './use-api';
import { apiClient } from '@/lib/api-client';

// Mock the API client module
vi.mock('@/lib/api-client', () => ({
    apiClient: vi.fn()
}));

describe('useApi', () => {
    // Sample test data
    interface TestData {
        id: string;
        name: string;
    }

    const mockData: TestData = {
        id: '123',
        name: 'Test Data'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should start with loading state', async () => {
        // Arrange - Setup a delayed response
        vi.mocked(apiClient).mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve(mockData), 100))
        );

        // Act
        const { result } = renderHook(() => useApi<TestData>('/test-endpoint'));

        // Assert - Initial state should be loading
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should fetch data successfully', async () => {
        // Arrange
        vi.mocked(apiClient).mockResolvedValue(mockData);

        // Act
        const { result } = renderHook(() => useApi<TestData>('/test-endpoint'));

        // Assert - Wait for the fetch to complete
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
        expect(apiClient).toHaveBeenCalledWith('/test-endpoint');
    });

    it('should handle API errors', async () => {
        // Arrange
        const errorMessage = 'API Error';
        const mockError = new Error(errorMessage);
        vi.mocked(apiClient).mockRejectedValue(mockError);

        // Act
        const { result } = renderHook(() =>
            useApi<TestData>('/test-endpoint', 'Custom error message')
        );

        // Assert - Wait for the fetch to fail
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toBeNull();
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toContain('Custom error message');
    });

    it('should update data with setData', async () => {
        // Arrange
        vi.mocked(apiClient).mockResolvedValue(mockData);

        // Act
        const { result } = renderHook(() => useApi<TestData>('/test-endpoint'));

        // Wait for initial data to load
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Update the data
        const updatedData = { ...mockData, name: 'Updated Name' };
        result.current.setData?.(updatedData);

        // Assert
        expect(result.current.data).toEqual(updatedData);
    });

    it('should refetch data when refetch is called', async () => {
        // Arrange
        vi.mocked(apiClient).mockResolvedValueOnce(mockData);

        // Act
        const { result } = renderHook(() => useApi<TestData>('/test-endpoint'));

        // Wait for initial data to load
        await waitFor(() => {
            expect(result.current.data).toEqual(mockData);
        });

        // Setup the mock for the second call with updated data
        const updatedData = { ...mockData, name: 'Refetched Data' };
        vi.mocked(apiClient).mockResolvedValueOnce(updatedData);

        // Call refetch
        await result.current.refetch?.();

        // Assert
        await waitFor(() => {
            expect(result.current.data).toEqual(updatedData);
        });

        // Verify the API was called twice
        expect(apiClient).toHaveBeenCalledTimes(2);
    });
});
