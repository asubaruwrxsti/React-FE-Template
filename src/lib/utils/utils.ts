import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CONSTANTS } from "../environment"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Decode a JWT token and return its payload
 * @param token JWT token string
 */
export function decodeJWT(token: string | null): { exp?: number; sub?: string;[key: string]: any } | null {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}

/**
 * Check if a token has expired or is about to expire within the buffer time
 * @param token JWT token string
 * @param bufferSeconds Time buffer in seconds before actual expiration (default 30s)
 */
export function isTokenExpired(token: string | null, bufferSeconds = 30): boolean {
    if (!token) return true;

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) return true;

    // Check if token will expire in the next [bufferSeconds]
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp <= currentTime + bufferSeconds;
}

/**
 * Get time remaining until token expires in seconds
 * @param token JWT token string
 */
export function getTokenTimeRemaining(token: string | null): number {
    if (!token) return 0;

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decodedToken.exp - currentTime);
}

/**
 * Global state for token refresh to prevent multiple simultaneous refresh requests
 */
let isRefreshingToken = false;
let refreshTokenPromise: Promise<string | null> | null = null;

/**
 * Centralized function to handle token refresh using singleton pattern
 * @returns New access token or null if refresh fails
 */
export async function refreshAuthToken(): Promise<string | null> {
    if (isRefreshingToken && refreshTokenPromise) {
        return refreshTokenPromise;
    }

    isRefreshingToken = true;
    refreshTokenPromise = (async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return null;

            const response = await fetch(`${CONSTANTS.API_URL}/api/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Check for specific invalid refresh token error
                if (errorData.message === "Invalid refresh token") {
                    // Clear auth data
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");

                    // Notify user with toast if available
                    try {
                        const { toast } = await import('sonner');
                        toast.error("Your session has expired. Please log in again.");
                    } catch (e) {
                        console.error("Toast notification failed", e);
                    }

                    // Navigate to login
                    window.location.href = '/login';
                }

                return null;
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            return data.accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        } finally {
            isRefreshingToken = false;
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
}

/**
 * Convert an object of parameters into a URL query string
 * @param params Object containing URL parameters
 * @returns Formatted query string including the leading ? if params exist
 */
export function buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                // Handle array parameters
                value.forEach(item => {
                    queryParams.append(`${key}[]`, String(item));
                });
            } else {
                queryParams.append(key, String(value));
            }
        }
    });

    const queryString = queryParams.toString();
    console.log('Generated query string:', queryString ? `?${queryString}` : '');
    return queryString ? `?${queryString}` : '';
}

/**
 * Generic form data transformer that handles file uploads and complex data structures
 * @param formData Raw form data from user input
 * @param config Configuration options for data transformation
 * @returns Transformed data ready for API submission
 */
export function transformFormData<T = any>(
    formData: Record<string, any>,
    config: {
        dateFields?: string[];
        fileFields?: string[];
        nestedFields?: Record<string, string[]>;
        arrayFields?: string[];
        numberFields?: string[];
        booleanFields?: string[];
    } = {}
): T {
    const {
        dateFields = [],
        fileFields = [],
        nestedFields = {},
        arrayFields = [],
        numberFields = [],
        booleanFields = []
    } = config;

    const result: Record<string, any> = { ...formData };

    // Convert date strings to Date objects
    dateFields.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
            result[field] = new Date(result[field]);
        }
    });

    // Process file fields (usually handled separately with FormData)
    fileFields.forEach(field => {
        if (result[field] === '') {
            delete result[field]; // Remove empty file fields
        }
    });

    // Process nested fields
    Object.entries(nestedFields).forEach(([parentField, childFields]) => {
        if (!result[parentField]) {
            result[parentField] = {};
        }

        childFields.forEach(childField => {
            const fullKey = `${parentField}_${childField}`;
            if (fullKey in result) {
                result[parentField][childField] = result[fullKey];
                delete result[fullKey]; // Clean up the flat representation
            }
        });
    });

    // Convert string arrays (from multi-selects etc.)
    arrayFields.forEach(field => {
        if (typeof result[field] === 'string') {
            result[field] = result[field].split(',').map((item: string) => item.trim());
        } else if (!Array.isArray(result[field])) {
            result[field] = [];
        }
    });

    // Convert string numbers to actual numbers
    numberFields.forEach(field => {
        if (result[field] !== undefined && result[field] !== '') {
            result[field] = Number(result[field]);
        }
    });

    // Convert boolean values
    booleanFields.forEach(field => {
        if (typeof result[field] === 'string') {
            result[field] = result[field].toLowerCase() === 'true';
        }
    });

    return result as T;
}

/**
 * Standard error handler for API requests that provides consistent error handling
 * @param error The error object caught in a catch block
 * @param options Additional options for error handling
 * @returns Standardized error information for UI display
 */
export function handleApiError(
    error: any,
    options: {
        defaultMessage?: string;
        logError?: boolean;
        showToast?: boolean;
        onUnauthorized?: () => void;
    } = {}
): {
    message: string;
    statusCode?: number;
    details?: string[];
} {
    const {
        defaultMessage = "An unexpected error occurred",
        logError = true,
        showToast = false,
        onUnauthorized
    } = options;

    if (logError) {
        console.error("API Error:", error);
    }

    // Default error response
    const errorResponse = {
        message: defaultMessage,
        statusCode: undefined as number | undefined,
        details: [] as string[]
    };

    // Try to extract information from the ApiError type if available
    if (error && typeof error === 'object') {
        // Check for our ApiError type
        if ('message' in error && typeof error.message === 'string') {
            errorResponse.message = error.message;
        }

        // Extract status code if available
        if ('statusCode' in error && typeof error.statusCode === 'number') {
            errorResponse.statusCode = error.statusCode;
        } else if ('status' in error && typeof error.status === 'number') {
            errorResponse.statusCode = error.status;
        }

        // Handle validation errors with multiple messages
        if ('details' in error && Array.isArray(error.details)) {
            errorResponse.details = error.details;
        }

        // Handle 401 Unauthorized errors
        if (errorResponse.statusCode === 401 && onUnauthorized) {
            onUnauthorized();
        }
    }

    // Show toast notification if requested
    if (showToast) {
        import('sonner').then(({ toast }) => {
            toast.error(errorResponse.message);
        }).catch(() => {
            // Toast library not available, just log
            console.error("Toast notification failed", errorResponse.message);
        });
    }

    return errorResponse;
}

/**
 * Format a date into a consistent string representation
 * @param date Date to format
 * @param format The format to use (default: 'standard')
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | string | number | null | undefined,
    format: 'standard' | 'short' | 'long' | 'time' | 'datetime' | 'relative' = 'standard'
): string {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'object' ? date : new Date(date);

        if (isNaN(dateObj.getTime())) {
            console.error('Invalid date:', date);
            return '';
        }

        switch (format) {
            case 'short':
                return dateObj.toLocaleDateString();
            case 'long':
                return dateObj.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            case 'time':
                return dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            case 'datetime':
                return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`;
            case 'relative':
                return formatRelativeTime(dateObj);
            case 'standard':
            default:
                // ISO format: YYYY-MM-DD
                return dateObj.toISOString().split('T')[0];
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param date The date to format
 * @returns Relative time string
 */
function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    if (diffSecs < 60) {
        return diffSecs <= 1 ? 'just now' : `${diffSecs} seconds ago`;
    } else if (diffMins < 60) {
        return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
    } else if (diffWeeks < 4) {
        return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
    } else if (diffMonths < 12) {
        return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
    } else {
        return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
    }
}
