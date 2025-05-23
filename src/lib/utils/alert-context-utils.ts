import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Define the interface for the context
export type AlertContextType = {
    showAlert: (title: string, description: string, options?: AlertOptions) => void;
    hideAlert: () => void;
};

// Define the alert types
export enum AlertType {
    Error = 'error',
    Success = 'success',
    Info = 'info',
}

// Define the alert options
export type AlertOptions = {
    type?: AlertType;
    timeout?: number;
    className?: string;
};

// Define the alert content
export interface AlertContent {
    title: string;
    description: string;
    type: AlertType;
    className: string;
    timeout?: number;
}

// Define the alert styles
export const getAlertStyles = (alertContent: AlertContent) => {
    switch (alertContent.type) {
        case AlertType.Error:
            return {
                styles: 'border-red-500 bg-red-50',
                icon: AlertCircle
            };
        case AlertType.Success:
            return {
                styles: 'border-green-500 bg-green-50',
                icon: CheckCircle
            };
        case AlertType.Info:
        default:
            return {
                styles: 'border-blue-500 bg-blue-50',
                icon: Info
            };
    }
};