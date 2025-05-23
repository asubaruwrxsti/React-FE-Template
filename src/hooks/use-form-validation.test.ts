import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormValidation } from './use-form-validation';
import { AlertType } from '@/lib/utils/alert-context-utils';
import { AlertContext } from '@/contexts/alert-context';

// Mock the react-hook-form
const mockForm = {
    trigger: vi.fn(),
};

const createWrapper = (showAlert = vi.fn()) => {
    return function Wrapper({ children }: { children: React.ReactNode }) {
        return React.createElement(
            AlertContext.Provider,
            { value: { showAlert, hideAlert: vi.fn() } },
            children
        );
    };
};

describe('useFormValidation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return validation functions', () => {
        // Arrange & Act
        const { result } = renderHook(() => useFormValidation({ form: mockForm as any }));

        // Assert
        expect(result.current.validateFields).toBeInstanceOf(Function);
        expect(result.current.validateFormSection).toBeInstanceOf(Function);
    });

    describe('validateFields', () => {
        it('should return true when validation is successful', async () => {
            // Arrange
            mockForm.trigger.mockResolvedValue(true);
            const showAlert = vi.fn();
            const wrapper = createWrapper(showAlert);

            // Act
            const { result } = renderHook(() => useFormValidation({ form: mockForm as any }), { wrapper });
            const isValid = await result.current.validateFields(['name', 'email']);

            // Assert
            expect(mockForm.trigger).toHaveBeenCalledWith(['name', 'email']);
            expect(isValid).toBe(true);
            expect(showAlert).not.toHaveBeenCalled();
        });

        it('should show alert and return false when validation fails', async () => {
            // Arrange
            mockForm.trigger.mockResolvedValue(false);
            const showAlert = vi.fn();
            const wrapper = createWrapper(showAlert);

            // Act
            const { result } = renderHook(() => useFormValidation({ form: mockForm as any }), { wrapper });
            const isValid = await result.current.validateFields(['name', 'email']);

            // Assert
            expect(mockForm.trigger).toHaveBeenCalledWith(['name', 'email']);
            expect(isValid).toBe(false);
            expect(showAlert).toHaveBeenCalledWith(
                'Validation Error',
                'Please fill in all required fields before proceeding.',
                { type: AlertType.Error }
            );
        });

        it('should use custom error message when provided', async () => {
            // Arrange
            mockForm.trigger.mockResolvedValue(false);
            const showAlert = vi.fn();
            const wrapper = createWrapper(showAlert);
            const customMessage = 'Custom error message';

            // Act
            const { result } = renderHook(() => useFormValidation({ form: mockForm as any }), { wrapper });
            const isValid = await result.current.validateFields(['name', 'email'], customMessage);

            // Assert
            expect(isValid).toBe(false);
            expect(showAlert).toHaveBeenCalledWith(
                'Validation Error',
                customMessage,
                { type: AlertType.Error }
            );
        });
    });

    describe('validateFormSection', () => {
        it('should validate a specific form section with default error message', async () => {
            // Arrange
            mockForm.trigger.mockResolvedValue(false);
            const showAlert = vi.fn();
            const wrapper = createWrapper(showAlert);

            // Act
            const { result } = renderHook(() => useFormValidation({ form: mockForm as any }), { wrapper });
            const isValid = await result.current.validateFormSection('personal', ['firstName', 'lastName']);

            // Assert
            expect(mockForm.trigger).toHaveBeenCalledWith(['firstName', 'lastName']);
            expect(isValid).toBe(false);
            expect(showAlert).toHaveBeenCalledWith(
                'Validation Error',
                'Please complete all required personal information.',
                { type: AlertType.Error }
            );
        });

        it('should validate a specific form section with custom error message', async () => {
            // Arrange
            mockForm.trigger.mockResolvedValue(false);
            const showAlert = vi.fn();
            const wrapper = createWrapper(showAlert);
            const customMessage = 'Please enter your personal details';

            // Act
            const { result } = renderHook(() => useFormValidation({ form: mockForm as any }), { wrapper });
            const isValid = await result.current.validateFormSection(
                'personal',
                ['firstName', 'lastName'],
                customMessage
            );

            // Assert
            expect(isValid).toBe(false);
            expect(showAlert).toHaveBeenCalledWith(
                'Validation Error',
                customMessage,
                { type: AlertType.Error }
            );
        });

        it('should return true when section validation is successful', async () => {
            // Arrange
            mockForm.trigger.mockResolvedValue(true);
            const showAlert = vi.fn();
            const wrapper = createWrapper(showAlert);

            // Act
            const { result } = renderHook(() => useFormValidation({ form: mockForm as any }), { wrapper });
            const isValid = await result.current.validateFormSection('personal', ['firstName', 'lastName']);

            // Assert
            expect(isValid).toBe(true);
            expect(showAlert).not.toHaveBeenCalled();
        });
    });
});
