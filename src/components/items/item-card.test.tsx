import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests/test-utils';
import { ItemCard } from './item-card';
import type { Item } from '@/types/Item';

// Create a sample item for testing
const sampleItem: Item = {
    id: 'item-123',
    name: 'Test Item',
    description: 'This is a test item description',
    type: 'type1',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    tags: ['test', 'sample']
};

describe('ItemCard', () => {
    it('renders item details correctly', () => {
        render(<ItemCard item={sampleItem} />);

        // Check if the item name is rendered
        expect(screen.getByText('Test Item')).toBeInTheDocument();

        // Check if the description is rendered
        expect(screen.getByText('This is a test item description')).toBeInTheDocument();

        // Check if the status badge is rendered
        const statusBadge = screen.getByText('active');
        expect(statusBadge).toBeInTheDocument();
        expect(statusBadge).toHaveClass('bg-green-100');

        // Check if tags are rendered
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.getByText('sample')).toBeInTheDocument();
    });

    it('calls onView when view button is clicked', () => {
        const onViewMock = vi.fn();
        render(<ItemCard item={sampleItem} onView={onViewMock} />);

        const viewButton = screen.getByText('View');
        fireEvent.click(viewButton);

        expect(onViewMock).toHaveBeenCalledOnce();
        expect(onViewMock).toHaveBeenCalledWith(sampleItem);
    });

    it('calls onEdit when edit button is clicked', () => {
        const onEditMock = vi.fn();
        render(<ItemCard item={sampleItem} onEdit={onEditMock} />);

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(onEditMock).toHaveBeenCalledOnce();
        expect(onEditMock).toHaveBeenCalledWith(sampleItem);
    });

    it('requires confirmation before calling onDelete', () => {
        const onDeleteMock = vi.fn();
        render(<ItemCard item={sampleItem} onDelete={onDeleteMock} />);

        // Initial delete button click should not call the handler yet
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        expect(onDeleteMock).not.toHaveBeenCalled();

        // After first click, the button should show "Confirm"
        const confirmButton = screen.getByText('Confirm');
        expect(confirmButton).toBeInTheDocument();

        // Clicking "Confirm" should call the delete handler
        fireEvent.click(confirmButton);
        expect(onDeleteMock).toHaveBeenCalledOnce();
        expect(onDeleteMock).toHaveBeenCalledWith(sampleItem);
    });

    it('renders correctly without optional props', () => {
        // Create a minimal item without optional fields
        const minimalItem: Item = {
            id: 'item-456',
            name: 'Minimal Item',
            type: 'type2',
            status: 'inactive',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z'
        };

        render(<ItemCard item={minimalItem} />);

        expect(screen.getByText('Minimal Item')).toBeInTheDocument();
        expect(screen.getByText('inactive')).toBeInTheDocument();

        // Item without description should not break
        expect(screen.queryByText('This is a test item description')).not.toBeInTheDocument();

        // Buttons should still render even without handlers
        expect(screen.getByText('View')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });
});
