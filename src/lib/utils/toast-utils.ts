import { toast } from "sonner";

// Or define your ToastT type correctly:
type ToastT = string | number;

type ToastType = "success" | "error" | "info" | "warning";

// Define the return type of toast.promise() more accurately
type ToastPromiseReturn<T> = { unwrap: () => Promise<T> };

interface ToastOptions {
    id?: string;
    duration?: number;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
    icon?: React.ReactNode;
    description?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Toast utility for standardized application-wide notifications
 */
export const toastUtils = {
    /**
     * Show a success toast notification
     */
    success: (message: string, options?: ToastOptions): ToastT => {
        return toast.success(message, options);
    },

    /**
     * Show an error toast notification
     */
    error: (message: string, errorOrOptions?: unknown | ToastOptions, maybeOptions?: ToastOptions): ToastT => {
        let error: unknown | undefined;
        let options: ToastOptions | undefined;

        if (errorOrOptions && typeof errorOrOptions === 'object' && !maybeOptions) {
            // If second arg looks like options and no third arg, assume it's options
            options = errorOrOptions as ToastOptions;
        } else {
            // Otherwise, assume standard pattern (message, error, options)
            error = errorOrOptions;
            options = maybeOptions;
        }

        // Log the error to console if provided
        if (error) {
            console.error(message, error);
        }

        // Only pass message and options to toast.error
        return toast.error(message, {
            style: {
                backgroundColor: '#FFECEC',
                border: '1px solid #F87171',
                color: '#EF4444'
            },
            ...options
        });
    },

    /**
     * Show an info toast notification
     */
    info: (message: string, options?: ToastOptions): ToastT => {
        return toast(message, options);
    },

    /**
     * Show a warning toast notification
     */
    warning: (message: string, options?: ToastOptions): ToastT => {
        return toast(message, {
            style: {
                backgroundColor: '#FEF3C7',
                border: '1px solid #FBBF24',
                color: '#D97706'
            },
            ...options
        });
    },

    /**
     * Custom toast with specified type
     */
    custom: (message: string, type: ToastType, options?: ToastOptions): ToastT => {
        switch (type) {
            case "success":
                return toastUtils.success(message, options);
            case "error":
                // Pass options as the second argument since your error method can handle this
                return toastUtils.error(message, options);
            case "warning":
                return toastUtils.warning(message, options);
            case "info":
            default:
                return toastUtils.info(message, options);
        }
    },

    /**
     * Show a toast with promise
     */
    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: unknown) => string);
        }
    ): ToastPromiseReturn<T> => {
        return toast.promise(promise, messages);
    }
};