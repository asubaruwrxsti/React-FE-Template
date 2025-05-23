import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/types/App/error-handler";

interface DataLoaderProps<T> {
    /**
     * The data to render when loaded
     */
    data: T | null;

    /**
     * Loading state
     */
    isLoading: boolean;

    /**
     * Error state if any
     */
    error: ApiError | Error | null;

    /**
     * Function to retry loading data
     */
    onRetry?: () => void;

    /**
     * Children to render when data is loaded
     */
    children: ReactNode | ((data: T) => ReactNode);

    /**
     * Custom loading component
     */
    loadingComponent?: ReactNode;

    /**
     * Custom error component
     */
    errorComponent?: ReactNode | ((error: ApiError | Error) => ReactNode);

    /**
     * Whether to show the skeleton during loading
     */
    showSkeleton?: boolean;

    /**
     * Skeleton component to show during loading
     */
    skeleton?: ReactNode;

    /**
     * Additonal CSS classes
     */
    className?: string;
}

/**
 * A generic data loader component that handles loading, error, and data states
 * 
 * @example
 * <DataLoader
 *   data={users}
 *   isLoading={isLoading}
 *   error={error}
 *   onRetry={fetchUsers}
 * >
 *   {(data) => (
 *     <ul>
 *       {data.map(user => (
 *         <li key={user.id}>{user.name}</li>
 *       ))}
 *     </ul>
 *   )}
 * </DataLoader>
 */
export function DataLoader<T>({
    data,
    isLoading,
    error,
    onRetry,
    children,
    loadingComponent,
    errorComponent,
    showSkeleton = false,
    skeleton,
    className,
}: DataLoaderProps<T>) {
    // Default loading component
    const defaultLoadingComponent = (
        <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading...</span>
        </div>
    );

    // Default error component
    const defaultErrorComponent = (error: ApiError | Error) => (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                <div className="space-y-2">
                    <p>{error.message || "An unexpected error occurred"}</p>
                    {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            Try Again
                        </Button>
                    )}
                </div>
            </AlertDescription>
        </Alert>
    );

    return (
        <div className={cn("space-y-4", className)}>
            {isLoading && (
                <>
                    {showSkeleton && skeleton ? skeleton : loadingComponent || defaultLoadingComponent}
                </>
            )}

            {!isLoading && error && (
                <>
                    {errorComponent
                        ? typeof errorComponent === "function"
                            ? errorComponent(error)
                            : errorComponent
                        : defaultErrorComponent(error)}
                </>
            )}

            {!isLoading && !error && data && (
                <>
                    {typeof children === "function" ? children(data) : children}
                </>
            )}
        </div>
    );
}
