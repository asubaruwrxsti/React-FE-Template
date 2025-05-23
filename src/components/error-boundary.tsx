import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatErrorDetails } from "@/lib/error-handling";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the component tree.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Update state with the error details
        this.setState({
            errorInfo
        });

        // Call the optional onError callback
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log the error to the console
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    resetErrorBoundary = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            // Return custom fallback UI if provided
            if (fallback) {
                return fallback;
            }

            // Default fallback UI
            return (
                <div className="flex items-center justify-center min-h-[400px] p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-t-lg">
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Something went wrong
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 pb-2">
                            <div className="text-sm text-muted-foreground space-y-2">
                                <p className="font-medium text-foreground">{error?.message ?? "An unexpected error occurred"}</p>
                                {error && (
                                    <pre className="text-xs p-2 bg-muted rounded-md overflow-auto max-h-32">
                                        {formatErrorDetails({
                                            message: error.message,
                                            code: error.name,
                                            severity: 'error',
                                            details: error.stack,
                                            timestamp: new Date()
                                        }).join('\n')}
                                    </pre>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => window.location.href = "/"}>
                                Go to Home
                            </Button>
                            <Button onClick={this.resetErrorBoundary}>
                                <RefreshCw className="h-4 w-4 mr-1" /> Try Again
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            );
        }

        return children;
    }
}

/**
 * A higher-order component that wraps the specified component in an ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
): React.ComponentType<P> {
    const displayName = Component.displayName ?? Component.name ?? "Component";
    const ComponentWithErrorBoundary = (props: P) => {
        return (
            <ErrorBoundary {...errorBoundaryProps}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };

    ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

    return ComponentWithErrorBoundary;
}
