import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/types/App/error-handler';
import { handleApiError } from '@/types/App/error-utils';

type ApiState<T> = {
    data: T | null;
    isLoading: boolean;
    error: ApiError | null;
    setData?: (newData: T) => void;
    refetch?: () => Promise<void>;
};

/**
 * Hook to fetch data from the API with standardized error handling
 * @param endpoint The API endpoint to fetch from
 * @param errorMessage Custom error message to display on failure
 * @returns The API state including data, loading status, error, and refetch function
 */
export function useApi<T>(endpoint: string, errorMessage: string = 'Failed to fetch data') {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        isLoading: true,
        error: null,
    });

    const setData = (newData: T) => {
        setState(prev => ({
            ...prev,
            data: newData
        }));
    };

    const fetchData = async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const data = await apiClient<T>(endpoint);
            setState({ data, isLoading: false, error: null });
        } catch (error) {
            const apiError = handleApiError(error, errorMessage);
            setState({ data: null, isLoading: false, error: apiError });
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return {
        data: state.data,
        isLoading: state.isLoading,
        error: state.error,
        setData,
        refetch: fetchData
    };
}