import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn, DefaultValues } from 'react-hook-form';

/**
 * Options for creating a form with zod schema
 */
export interface UseZodFormOptions<TSchema extends z.ZodType> {
    /**
     * The zod schema to validate the form against
     */
    schema: TSchema;

    /**
     * Default values for the form
     */
    defaultValues?: DefaultValues<z.infer<TSchema>>;

    /**
     * Whether to validate the form on change
     */
    validateOnChange?: boolean;

    /**
     * Whether to validate the form on blur
     */
    validateOnBlur?: boolean;

    /**
     * Custom resolver options
     */
    resolverOptions?: Parameters<typeof zodResolver>[1];

    /**
     * Custom mode for the form
     */
    mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' | 'all';
}

/**
 * Create a form with zod schema validation
 * 
 * @example
 * const schema = z.object({
 *   name: z.string().min(2).max(50),
 *   email: z.string().email(),
 *   age: z.number().min(18).max(100).optional(),
 * });
 * 
 * type FormValues = z.infer<typeof schema>;
 * 
 * function MyForm() {
 *   const form = useZodForm({
 *     schema,
 *     defaultValues: { name: '', email: '' },
 *   });
 * 
 *   const onSubmit = (data: FormValues) => {
 *     console.log(data);
 *   };
 * 
 *   return (
 *     <Form {...form}>
 *       <form onSubmit={form.handleSubmit(onSubmit)}>
 *         <FormField
 *           control={form.control}
 *           name="name"
 *           render={({ field }) => (
 *             <FormItem>
 *               <FormLabel>Name</FormLabel>
 *               <FormControl>
 *                 <Input {...field} />
 *               </FormControl>
 *               <FormMessage />
 *             </FormItem>
 *           )}
 *         />
 *         <Button type="submit">Submit</Button>
 *       </form>
 *     </Form>
 *   );
 * }
 */
export function useZodForm<TSchema extends z.ZodType>({
    schema,
    defaultValues,
    resolverOptions,
    mode = 'onSubmit',
}: UseZodFormOptions<TSchema>): UseFormReturn<z.infer<TSchema>> {
    return useForm<z.infer<TSchema>>({
        resolver: zodResolver(schema, resolverOptions),
        defaultValues,
        mode,
    });
}

/**
 * Get the default values from a zod schema
 * 
 * @param schema The zod schema
 * @returns Default values for the schema
 * 
 * @example
 * const schema = z.object({
 *   name: z.string(),
 *   email: z.string(),
 *   age: z.number().optional(),
 * });
 * 
 * const defaultValues = getSchemaDefaults(schema);
 * // { name: '', email: '', age: undefined }
 */
export function getSchemaDefaults<T extends z.ZodType>(
    schema: T
): DefaultValues<z.infer<T>> {
    return getDefaultValuesFromZodSchema(schema);
}

/**
 * Internal helper to extract default values from a zod schema
 */
function getDefaultValuesFromZodSchema(schema: z.ZodType): any {
    if (schema instanceof z.ZodObject) {
        const shape = schema._def.shape();
        const defaults: Record<string, any> = {};

        for (const key in shape) {
            const field = shape[key];
            defaults[key] = getDefaultValuesFromZodSchema(field);
        }

        return defaults;
    }

    if (schema instanceof z.ZodArray) {
        return [];
    }

    if (schema instanceof z.ZodString) {
        return '';
    }

    if (schema instanceof z.ZodNumber) {
        return undefined;
    }

    if (schema instanceof z.ZodBoolean) {
        return false;
    }

    if (schema instanceof z.ZodDate) {
        return undefined;
    }

    if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
        return undefined;
    }

    if (schema instanceof z.ZodDefault) {
        return schema._def.defaultValue();
    }

    return undefined;
}
