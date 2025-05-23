import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/theme-context';
import { AlertProvider } from '@/contexts/alert-context';
import userEvent from '@testing-library/user-event';

// Define interface for the wrapper props
interface AllProvidersProps {
    children: ReactNode;
}

// Create a wrapper with all providers that most components need
const AllProviders = ({ children }: AllProvidersProps) => {
    return (
        <AlertProvider>
            <ThemeProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </ThemeProvider>
        </AlertProvider>
    );
};

// Custom render function that includes our providers
const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => {
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: AllProviders, ...options }),
    };
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
