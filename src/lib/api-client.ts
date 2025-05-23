import { useAuth } from "@/contexts/auth-context";
import { CONSTANTS } from "@/lib/environment";
import { ApiError, ApiErrorResponse } from "@/types/App/error-handler";
import { buildQueryString, isTokenExpired, refreshAuthToken } from "@/lib/utils/utils";
import { AppConfig } from './app-config';
import { authStorage } from './utils/storage-utils';

/**
 * Configuration for API requests
 */
interface ApiRequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
    useAuth?: boolean;
    baseUrl?: string;
    timeout?: number;
    body?: any;
}

/**
 * API client error with better type support
 */
export class ApiClientError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data?: any) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Enhanced fetch API client with error handling, authentication,
 * and automatic token refresh
 * 
 * @example
 * // Basic GET request
 * const data = await apiClient('/users');
 * 
 * @example
 * // POST request with body
 * const newUser = await apiClient('/users', {
 *   method: 'POST',
 *   body: { name: 'John', email: 'john@example.com' }
 * });
 * 
 * @example
 * // GET with query parameters
 * const searchResults = await apiClient('/search', {
 *   params: { query: 'test', page: 1 }
 * });
 */
export async function apiClient<T = any>(
    endpoint: string,
    configOrMethod?: ApiRequestConfig | string,
    oldBody?: any,
    oldParams?: Record<string, any>
): Promise<T> {
    // Support old-style function signature for backward compatibility
    if (typeof configOrMethod === 'string') {
        return apiClient<T>(
            endpoint,
            configOrMethod, // method
            oldBody, // body
            oldParams  // params
        );
    }

    const config = configOrMethod || {};
    const { params, useAuth = true, baseUrl = CONSTANTS.API_URL, timeout = AppConfig.apiTimeout, ...customConfig } = config;

    // Prepare URL with query parameters
    const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${baseUrl}/api${apiEndpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    // Prepare headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(customConfig.headers &&
            typeof customConfig.headers === 'object' &&
            !Array.isArray(customConfig.headers) &&
            !(customConfig.headers instanceof Headers)
            ? customConfig.headers
            : {}),
    };

    if (useAuth) {
        let accessToken = authStorage.getAccessToken();
        if (accessToken && isTokenExpired(accessToken)) {
            accessToken = await refreshAuthToken();
        }
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }

    // Prepare the fetch config
    const fetchConfig: RequestInit = {
        method: customConfig.method || 'GET',
        headers,
        ...customConfig,
    };

    // Use the body from ApiRequestConfig as-is, and serialize if needed
    if (config.body !== undefined) {
        if (
            typeof config.body === 'object' &&
            !(config.body instanceof FormData) &&
            !(config.body instanceof URLSearchParams) &&
            !(config.body instanceof Blob)
        ) {
            fetchConfig.body = JSON.stringify(config.body);
        } else {
            fetchConfig.body = config.body;
        }
    }

    // Create an abort controller for timeout handling
    const controller = new AbortController();
    fetchConfig.signal = controller.signal;

    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        let response = await fetch(url.toString(), fetchConfig);
        clearTimeout(timeoutId);

        // Handle 401 Unauthorized with token refresh
        if (response.status === 401 && useAuth) {
            const newToken = await refreshAuthToken();
            if (newToken) {
                const headers = new Headers(fetchConfig.headers);
                headers.set('Authorization', `Bearer ${newToken}`);
                fetchConfig.headers = headers;
                response = await fetch(url.toString(), fetchConfig);
            } else {
                redirectToLogin();
                throw new ApiError("Session expired. Please log in again.");
            }
        }

        // Handle error responses
        if (!response.ok) {
            const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.message || `API error: ${response.statusText}`,
                errorData
            );
        }

        // Return empty object for 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        // Handle JSON response
        return await response.json() as T;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiClientError('Request timeout', 408);
        }

        throw error;
    }
}

/**
 * Hook for components to make API requests with automatic token refresh
 */
export const useApiClient = () => {
    const { authFetch } = useAuth();

    return async <T = any>(
        endpoint: string,
        method: string = "GET",
        body?: any,
        params?: Record<string, any>
    ): Promise<T> => {
        let url = `${CONSTANTS.API_URL}/api${endpoint}${buildQueryString(params)}`;

        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await authFetch(url, options);

        if (!response.ok) {
            const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
            throw new ApiError(errorData.message || `API error: ${response.statusText}`, errorData);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return await response.json();
    };
};

/**
 * API client for non-component use with automatic token refresh
 * @deprecated Use apiClient instead with the new config object pattern
 */
export async function apiClientWithAuth<T = any>(
    endpoint: string,
    method: string = "GET",
    body?: any,
    params?: Record<string, any>
): Promise<T> {
    return apiClient<T>(endpoint, {
        method,
        body,
        params,
        useAuth: true
    });
}

/**
 * Function to handle redirection to login
 */
function redirectToLogin() {
    // Use storage utility instead of direct localStorage access
    authStorage.clearAuth();

    import('sonner').then(({ toast }) => {
        toast.error("Your session has expired. Please log in again.");
    });

    window.location.href = '/login';
}