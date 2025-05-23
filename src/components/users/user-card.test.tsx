import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/test-utils';
import { UserCard } from './user-card';
import { User } from '@/types/User';

// Create a sample user for testing
const sampleUser: User = {
    id: 'user-123',
    username: 'johndoe',
    email: 'john.doe@example.com',
    role: 'admin',
    isActive: true,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    phoneNumber: '123-456-7890',
    personal: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890'
    }
};

describe('UserCard', () => {
    it('renders user details correctly', () => {
        render(<UserCard user={sampleUser} />);

        // Check if the user name is rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();

        // Check if the email is rendered
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();

        // Check if the role badge is rendered
        const roleBadge = screen.getByText('admin');
        expect(roleBadge).toBeInTheDocument();

        // Check if the status badge is rendered
        const statusBadge = screen.getByText('active');
        expect(statusBadge).toBeInTheDocument();
    });

    it('calls onView when view button is clicked', () => {
        const onViewMock = vi.fn();
        render(<UserCard user={sampleUser} onView={onViewMock} />);

        const viewButton = screen.getByRole('button', { name: /view/i });
        fireEvent.click(viewButton);

        expect(onViewMock).toHaveBeenCalledOnce();
        expect(onViewMock).toHaveBeenCalledWith(sampleUser);
    });

    it('calls onEdit when edit button is clicked', () => {
        const onEditMock = vi.fn();
        render(<UserCard user={sampleUser} onEdit={onEditMock} />);

        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);

        expect(onEditMock).toHaveBeenCalledOnce();
        expect(onEditMock).toHaveBeenCalledWith(sampleUser);
    });

    it('requires confirmation before calling onDelete', () => {
        const onDeleteMock = vi.fn();
        render(<UserCard user={sampleUser} onDelete={onDeleteMock} />);

        // Initial delete button click should not call the handler yet
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(onDeleteMock).not.toHaveBeenCalled();

        // After first click, the button should show "Confirm"
        const confirmButton = screen.getByText('Confirm');
        expect(confirmButton).toBeInTheDocument();

        // Clicking "Confirm" should call the delete handler
        fireEvent.click(confirmButton);
        expect(onDeleteMock).toHaveBeenCalledOnce();
        expect(onDeleteMock).toHaveBeenCalledWith(sampleUser);
    });

    it('renders correctly without optional fields', () => {
        // Create a minimal user without optional fields
        const minimalUser: User = {
            id: 'user-456',
            username: 'janedoe',
            email: 'jane.doe@example.com',
            role: 'user',
            isActive: true,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
        };

        render(<UserCard user={minimalUser} />);

        // Check if the content renders without errors
        expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('user')).toBeInTheDocument();

        // Phone number should not be displayed
        expect(screen.queryByText('123-456-7890')).not.toBeInTheDocument();
    });

    it('applies correct status color', () => {
        // Test with inactive status
        const inactiveUser = {
            ...sampleUser,
            status: 'inactive' as const
        };

        const { rerender } = render(<UserCard user={inactiveUser} />);
        let statusBadge = screen.getByText('inactive');
        expect(statusBadge).toHaveClass('bg-gray-100');

        // Test with pending status
        const pendingUser = {
            ...sampleUser,
            status: 'pending' as const
        };

        rerender(<UserCard user={pendingUser} />);
        statusBadge = screen.getByText('pending');
        expect(statusBadge).toHaveClass('bg-yellow-100');

        // Test with suspended status
        const suspendedUser = {
            ...sampleUser,
            status: 'suspended' as const
        };

        rerender(<UserCard user={suspendedUser} />);
        statusBadge = screen.getByText('suspended');
        expect(statusBadge).toHaveClass('bg-red-100');
    });
});
