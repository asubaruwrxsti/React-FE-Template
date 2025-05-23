import { toast } from "sonner";
import { errorMessages } from "./constants";

/**
 * Error types
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Application error structure
 */
export interface AppError {
    message: string;
    code?: string | number;
    severity?: ErrorSeverity;
    field?: string;
    details?: any;
    timestamp: Date;
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
    showToast?: boolean;
    logToConsole?: boolean;
    logToService?: boolean;
    rethrow?: boolean;
}

const defaultOptions: ErrorHandlerOptions = {
    showToast: true,
    logToConsole: true,
    logToService: false,
    rethrow: false
};

/**
 * Create a formatted app error from any error type
 */
export function createAppError(error: any): AppError {
    // Already an AppError
    if (error.timestamp) {
        return error as AppError;
    }

    // Handle API errors (from our API client)
    if (error.status && error.data) {
        return {
            message: error.message || errorMessages.get(error.status) || 'Unknown error',
            code: error.status,
            severity: getErrorSeverityFromStatusCode(error.status),
            details: error.data,
            timestamp: new Date()
        };
    }

    // Handle HTTP errors
    if (error.status) {
        return {
            message: error.statusText || errorMessages.get(error.status) || 'Network error',
            code: error.status,
            severity: getErrorSeverityFromStatusCode(error.status),
            timestamp: new Date()
        };
    }

    // Handle validation errors
    if (error.name === 'ValidationError' || error.name === 'ZodError') {
        return {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            severity: 'warning',
            details: error.errors || error.issues,
            timestamp: new Date()
        };
    }

    // Default error handling
    return {
        message: error.message || 'An unexpected error occurred',
        code: error.code || 'UNKNOWN_ERROR',
        severity: 'error',
        details: error,
        timestamp: new Date()
    };
}

/**
 * Get error severity based on HTTP status code
 */
function getErrorSeverityFromStatusCode(status: number): ErrorSeverity {
    if (status >= 500) {
        return 'critical';
    } else if (status >= 400) {
        return 'error';
    } else if (status >= 300) {
        return 'warning';
    }
    return 'info';
}

/**
 * Handle errors in a consistent way across the application
 */
export function handleError(error: any, options?: ErrorHandlerOptions): AppError {
    const opts = { ...defaultOptions, ...options };
    const appError = createAppError(error);

    // Log to console if enabled
    if (opts.logToConsole) {
        console.error('[App Error]', appError);
    }

    // Show toast notification if enabled
    if (opts.showToast) {
        switch (appError.severity) {
            case 'critical':
            case 'error':
                toast.error(appError.message);
                break;
            case 'warning':
                toast.warning(appError.message);
                break;
            case 'info':
                toast.info(appError.message);
                break;
        }
    }

    // Log to error tracking service if enabled
    if (opts.logToService) {
        // Implementation would depend on your error tracking service
        // Example: Sentry.captureException(error);
    }

    // Rethrow if needed
    if (opts.rethrow) {
        throw appError;
    }

    return appError;
}

/**
 * Create a try/catch wrapper for async functions
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options?: ErrorHandlerOptions
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        try {
            return await fn(...args);
        } catch (error) {
            handleError(error, options);
            throw error;
        }
    };
}

/**
 * Format error details into user-friendly messages
 */
export function formatErrorDetails(error: AppError): string[] {
    const messages: string[] = [];

    if (!error.details) {
        return [error.message];
    }

    // Handle validation errors
    if (Array.isArray(error.details)) {
        error.details.forEach(detail => {
            if (typeof detail === 'string') {
                messages.push(detail);
            } else if (detail.message) {
                const fieldPrefix = detail.path ? `${detail.path}: ` : '';
                messages.push(`${fieldPrefix}${detail.message}`);
            }
        });
    } else if (typeof error.details === 'object') {
        // Handle object error details
        Object.entries(error.details).forEach(([key, value]) => {
            if (typeof value === 'string') {
                messages.push(`${key}: ${value}`);
            }
        });
    }

    return messages.length ? messages : [error.message];
}
