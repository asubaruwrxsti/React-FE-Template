import { useContext } from 'react';
import { AlertContext } from '@/contexts/alert-context';
import { AlertType, AlertContextType } from '@/lib/utils/alert-context-utils';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface FormValidationProps<T extends FieldValues> {
    form: UseFormReturn<T>;
}

export function useFormValidation<T extends FieldValues>({ form }: FormValidationProps<T>) {
    const alertContext = useContext<AlertContextType | undefined>(AlertContext);
    const showAlert = alertContext?.showAlert;

    // Generic field validation function
    const validateFields = async (
        fields: string[],
        errorMessage: string = "Please fill in all required fields before proceeding."
    ): Promise<boolean> => {
        // Trigger validation for the specified fields
        const result = await form.trigger(fields as any);

        if (!result) {
            showAlert?.("Validation Error", errorMessage, {
                type: AlertType.Error
            });
        }

        return result;
    };

    // Function to validate specific form sections
    const validateFormSection = async (
        sectionName: string,
        fields: string[],
        errorMessage?: string
    ): Promise<boolean> => {
        const customMessage = errorMessage || `Please complete all required ${sectionName} information.`;
        return validateFields(fields, customMessage);
    };

    return {
        validateFields,
        validateFormSection
    };
}