import { z } from "zod";

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[0-9]{10,15}$/,
    url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^[0-9]+$/,
    alphaOnly: /^[a-zA-Z]+$/
};

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
    /**
     * User schema for registration and profile updates
     */
    user: z.object({
        email: z.string().email("Please enter a valid email address"),
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                ValidationPatterns.password,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
            .optional(),
        confirmPassword: z.string().optional(),
        phone: z
            .string()
            .regex(ValidationPatterns.phone, "Please enter a valid phone number")
            .optional(),
        role: z.enum(["admin", "manager", "user", "guest"]).optional(),
        profilePicture: z.string().optional()
    }).refine(data => !data.password || data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }),

    /**
     * Login schema
     */
    login: z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(1, "Password is required"),
        rememberMe: z.boolean().optional()
    }),

    /**
     * Item schema for creating and updating items
     */
    item: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        description: z.string().optional(),
        type: z.string().min(1, "Item type is required"),
        status: z.string().min(1, "Status is required"),
        tags: z.array(z.string()).optional(),
        featuredImage: z.string().optional(),
        images: z.array(z.string()).optional(),
        attributes: z.array(
            z.object({
                name: z.string().min(1, "Attribute name is required"),
                value: z.union([z.string(), z.number(), z.boolean()]),
                unit: z.string().optional(),
                category: z.string().optional()
            })
        ).optional(),
        customFields: z.record(z.union([z.string(), z.number(), z.boolean()])).optional()
    }),

    /**
     * Search criteria schema
     */
    searchCriteria: z.object({
        query: z.string().optional(),
        types: z.array(z.string()).optional(),
        status: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        sortField: z.string().optional(),
        sortDirection: z.enum(["asc", "desc"]).optional(),
        page: z.number().optional(),
        limit: z.number().optional()
    }),

    /**
     * Address schema
     */
    address: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().regex(ValidationPatterns.zipCode, "Please enter a valid ZIP code"),
        country: z.string().min(1, "Country is required")
    })
};

/**
 * Helper function to validate form data against a schema
 */
export function validateForm<T>(schema: z.ZodType<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
} {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors: Record<string, string> = {};
            error.errors.forEach(err => {
                const path = err.path.join(".");
                formattedErrors[path] = err.message;
            });
            return { success: false, errors: formattedErrors };
        }
        return { success: false, errors: { _form: "Validation failed" } };
    }
}

/**
 * Helper function to create a form state object
 */
export function createFormState<T extends Record<string, any>>(
    initialValues: T
): {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    setValue: (field: keyof T, value: any) => void;
    setTouched: (field: keyof T, value: boolean) => void;
    setError: (field: keyof T, error: string | null) => void;
    reset: () => void;
    setValues: (values: Partial<T>) => void;
} {
    let values = { ...initialValues };
    let errors: Partial<Record<keyof T, string>> = {};
    let touched: Partial<Record<keyof T, boolean>> = {};

    return {
        get values() {
            return values;
        },
        get errors() {
            return errors;
        },
        get touched() {
            return touched;
        },
        setValue(field, value) {
            values = { ...values, [field]: value };
        },
        setTouched(field, value) {
            touched = { ...touched, [field]: value };
        },
        setError(field, error) {
            if (error) {
                errors = { ...errors, [field]: error };
            } else {
                const { [field as string]: _, ...rest } = errors;
                errors = rest as Partial<Record<keyof T, string>>;
            }
        },
        reset() {
            values = { ...initialValues };
            errors = {};
            touched = {};
        },
        setValues(newValues) {
            values = { ...values, ...newValues };
        }
    };
}
