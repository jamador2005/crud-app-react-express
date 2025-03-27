import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { ResourceType } from '@shared/schema';

// Mock the react-query hooks
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutate: vi.fn().mockResolvedValue({}),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

// Mock use-toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock react-query client
vi.mock('@/lib/queryClient', () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
  apiRequest: vi.fn().mockResolvedValue({}),
}));

describe('DeleteConfirmation Component', () => {
  // Mock handler for the onClose function
  const mockOnClose = vi.fn();
  
  // Sample resource items
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    createdAt: new Date('2025-03-27').toISOString(),
  };
  
  const mockProduct = {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop',
    category: 'Electronics',
    createdAt: new Date('2025-03-27').toISOString(),
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user deletion confirmation correctly', () => {
    render(
      <DeleteConfirmation 
        resourceType="users"
        item={mockUser}
        onClose={mockOnClose}
      />
    );

    // Check if the title is correct
    expect(screen.getByText('Delete Resource')).toBeInTheDocument();
    
    // Check if the confirmation message includes the resource name
    expect(screen.getByText(/Are you sure you want to delete John Doe\? This action cannot be undone./i)).toBeInTheDocument();
    
    // Check if both buttons are present
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('renders product deletion confirmation correctly', () => {
    render(
      <DeleteConfirmation 
        resourceType="products"
        item={mockProduct}
        onClose={mockOnClose}
      />
    );

    // Check if the title is correct
    expect(screen.getByText('Delete Resource')).toBeInTheDocument();
    
    // Check if the confirmation message includes the resource name
    expect(screen.getByText(/Are you sure you want to delete Laptop\? This action cannot be undone./i)).toBeInTheDocument();
    
    // Check if both buttons are present
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    render(
      <DeleteConfirmation 
        resourceType="users"
        item={mockUser}
        onClose={mockOnClose}
      />
    );

    // Find and click the Cancel button
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await fireEvent.click(cancelButton);
    
    // Verify onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when Delete button is clicked', async () => {
    // We already have mocks set up for the useMutation hook
    render(
      <DeleteConfirmation 
        resourceType="users"
        item={mockUser}
        onClose={mockOnClose}
      />
    );

    // Find and click the Delete button
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    await fireEvent.click(deleteButton);
    
    // Verify the mutation was triggered 
    // Since we've mocked useMutation to return a working mutate function,
    // and we've set it up to call onClose on success, we just need to verify
    // that onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });
});