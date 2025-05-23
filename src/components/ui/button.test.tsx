import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import { Button } from './button';

describe('Button', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-primary');
    });

    it('renders as a different element when asChild is true', () => {
        render(
            <Button asChild>
                <a href="#">Link Button</a>
            </Button>
        );
        const linkButton = screen.getByRole('link', { name: /link button/i });
        expect(linkButton).toBeInTheDocument();
        expect(linkButton).toHaveClass('bg-primary');
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        expect(button).toHaveClass('bg-destructive');
    });

    it('applies size classes correctly', () => {
        render(<Button size="sm">Small Button</Button>);
        const button = screen.getByRole('button', { name: /small button/i });
        expect(button).toHaveClass('h-8');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: /disabled/i });
        expect(button).toBeDisabled();
    });
});
