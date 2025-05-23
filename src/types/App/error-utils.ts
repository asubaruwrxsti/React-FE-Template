/**
 * Error handling utilities for consistent error handling across the application
 */
import { ApiError } from './error-handler';
import { toast } from 'sonner';

/**
 * Handles API errors consistently across the application
 * @param error The error to handle
 * @param defaultMessage Default message to display if error doesn't have a specific message
 * @param showToast Whether to show a toast notification
 * @returns A standardized error object
 */
export function handleApiError(error: unknown, defaultMessage: string = 'An unexpected error occurred', showToast: boolean = true): ApiError {
    // Convert to ApiError if it's not already
    const apiError = error instanceof ApiError
        ? error
        : new ApiError(
            error instanceof Error ? error.message : defaultMessage,
            error instanceof ApiError ? {
                success: error.success,
                message: error.message,
                data: error.validationErrors,
                meta: error.meta
            } : undefined
        );

    // Log the error
    console.error(defaultMessage, apiError);

    // Show toast if required
    if (showToast) {
        toast.error(apiError.message || defaultMessage);
    }

    return apiError;
}

/**
 * Processes API validation errors
 * @param error The API error to process
 * @returns An object with field-specific error messages
 */
export function processValidationErrors(error: unknown): Record<string, string> {
    if (!(error instanceof ApiError) || !error.validationErrors?.length) {
        return {};
    }

    return error.validationErrors.reduce((acc, validationError) => {
        acc[validationError.field] = validationError.message;
        return acc;
    }, {} as Record<string, string>);
}