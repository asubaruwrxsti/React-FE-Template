import { useState, useEffect } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface UseMultiStepFormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    steps: string[];
    initialStep?: string;
}

export function useMultiStepForm<T extends FieldValues>({
    form,
    steps,
    initialStep,
}: UseMultiStepFormProps<T>) {
    const [activeStep, setActiveStep] = useState<string>(initialStep || steps[0]);
    const [formData, setFormData] = useState<T>({} as T);

    // Sync form data with the hook's state
    useEffect(() => {
        setFormData(form.getValues());
    }, [form]);

    // Subscribe to form changes
    useEffect(() => {
        const subscription = form.watch((value) => {
            setFormData(value as T);
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const goToStep = (step: string) => {
        if (steps.includes(step)) {
            setActiveStep(step);
        }
    };

    const nextStep = () => {
        const currentIndex = steps.indexOf(activeStep);
        if (currentIndex < steps.length - 1) {
            setActiveStep(steps[currentIndex + 1]);
        }
    };

    const prevStep = () => {
        const currentIndex = steps.indexOf(activeStep);
        if (currentIndex > 0) {
            setActiveStep(steps[currentIndex - 1]);
        }
    };

    return {
        activeStep,
        setActiveStep,
        formData,
        goToStep,
        nextStep,
        prevStep,
        isFirstStep: activeStep === steps[0],
        isLastStep: activeStep === steps[steps.length - 1],
        currentStepIndex: steps.indexOf(activeStep),
        totalSteps: steps.length,
    };
}