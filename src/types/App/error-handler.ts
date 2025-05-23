export function handleError(err: unknown): string {
  const errorMessage = err instanceof Error
    ? err.message
    : 'An unknown error occurred';
  console.error("Operation failed:", err);
  return errorMessage;
}

export interface ValidationError {
  field: string;
  value: any;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  data?: ValidationError[];
  meta?: {
    timestamp: string;
  };
}

export class ApiError extends Error {
  success: boolean;
  validationErrors?: ValidationError[];
  meta?: {
    timestamp: string;
  };

  constructor(message: string, response?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.success = response?.success ?? false;
    this.validationErrors = response?.data;
    this.meta = response?.meta;
  }
}