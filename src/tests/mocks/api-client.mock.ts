import { vi } from 'vitest';

// Create a mock for the api-client module
vi.mock('@/lib/api-client', () => {
    const apiClientMock = vi.fn();

    // Add convenience methods that match the real API client
    apiClientMock.get = vi.fn();
    apiClientMock.post = vi.fn();
    apiClientMock.put = vi.fn();
    apiClientMock.patch = vi.fn();
    apiClientMock.delete = vi.fn();

    return {
        apiClient: apiClientMock
    };
});

// Import the mocked module
import { apiClient } from '@/lib/api-client';

// Helper to reset all mocks before each test
export const resetApiMocks = () => {
    vi.mocked(apiClient).mockReset();
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.patch).mockReset();
    vi.mocked(apiClient.delete).mockReset();
};

// Helper to mock successful responses
export const mockApiSuccess = <T>(data: T) => {
    const response = { data };
    vi.mocked(apiClient).mockResolvedValue(response);
    vi.mocked(apiClient.get).mockResolvedValue(response);
    vi.mocked(apiClient.post).mockResolvedValue(response);
    vi.mocked(apiClient.put).mockResolvedValue(response);
    vi.mocked(apiClient.patch).mockResolvedValue(response);
    vi.mocked(apiClient.delete).mockResolvedValue(response);
    return response;
};

// Helper to mock API errors
export const mockApiError = (status = 500, message = 'Server error') => {
    const error = new Error(message);
    Object.defineProperty(error, 'status', { value: status });

    vi.mocked(apiClient).mockRejectedValue(error);
    vi.mocked(apiClient.get).mockRejectedValue(error);
    vi.mocked(apiClient.post).mockRejectedValue(error);
    vi.mocked(apiClient.put).mockRejectedValue(error);
    vi.mocked(apiClient.patch).mockRejectedValue(error);
    vi.mocked(apiClient.delete).mockRejectedValue(error);

    return error;
};
