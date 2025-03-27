import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResourceType } from '@shared/schema';
import ResourceForm from '@/components/ResourceForm';

// Mock the react-query hooks
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
    isPending: false,
    isError: false,
    error: null,
  }),
  useQuery: () => ({
    data: [],
    isLoading: false,
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

describe('ResourceForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user form in create mode', () => {
    const handleClose = vi.fn();

    render(
      <ResourceForm 
        resourceType="users"
        mode="create"
        item={null}
        onClose={handleClose}
      />
    );

    // Verify dialog title
    expect(screen.getByText('Create User')).toBeInTheDocument();
    
    // Verify form fields by checking for input placeholders or exact label text
    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    
    // Find labels directly (using exact matches to prevent duplicate matches)
    const labels = screen.getAllByRole('textbox');
    expect(labels).toHaveLength(3); // name, email, username
    
    // Check for password field (which is not a textbox but a password input)
    const passwordField = screen.getByLabelText('Password');
    expect(passwordField).toBeInTheDocument();
    
    // Verify buttons - using more flexible query to find Cancel and submit buttons
    const buttons = screen.getAllByRole('button');
    const cancelButton = buttons.find(btn => btn.textContent?.includes('Cancel'));
    expect(cancelButton).toBeInTheDocument();
    
    // Find a button that looks like a submit/create button
    const submitButton = buttons.find(btn => 
      btn.textContent?.includes('Create') || 
      btn.textContent?.includes('Save') || 
      btn.textContent?.includes('Submit'));
    expect(submitButton).toBeInTheDocument();
  });

  it('renders product form in edit mode with prefilled values', () => {
    const handleClose = vi.fn();
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      description: 'Test description',
      category: 'Electronics',
      createdAt: new Date().toISOString(),
    };

    render(
      <ResourceForm 
        resourceType="products"
        mode="edit"
        item={mockProduct}
        onClose={handleClose}
      />
    );

    // Verify dialog title
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    
    // Verify form fields have correct values
    // Get all form inputs by role and check their values
    const textInputs = screen.getAllByRole('textbox');
    expect(textInputs.length).toBeGreaterThanOrEqual(2);
    
    // Find product name input by specific value
    const nameInput = screen.getByDisplayValue('Test Product');
    expect(nameInput).toBeInTheDocument();
    
    // We need to find the price input differently because it has a $ span and is in a div
    const priceInput = screen.getByPlaceholderText('0.00');
    expect(priceInput).toHaveValue(99.99);
    
    // Find description field by value (it's a textarea)
    const descInput = screen.getByDisplayValue('Test description');
    expect(descInput).toBeInTheDocument();
    
    // Find category input by value
    const categoryInput = screen.getByDisplayValue('Electronics');
    expect(categoryInput).toBeInTheDocument();
    
    // Verify buttons - using more flexible query to find Cancel and submit buttons
    const buttons = screen.getAllByRole('button');
    const cancelButton = buttons.find(btn => btn.textContent?.includes('Cancel'));
    expect(cancelButton).toBeInTheDocument();
    
    // Find a button that looks like a submit/save button
    const submitButton = buttons.find(btn => 
      btn.textContent?.includes('Save') || 
      btn.textContent?.includes('Update') || 
      btn.textContent?.includes('Submit'));
    expect(submitButton).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const handleClose = vi.fn();

    render(
      <ResourceForm 
        resourceType="users"
        mode="create"
        item={null}
        onClose={handleClose}
      />
    );

    // Click the cancel button
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await fireEvent.click(cancelButton);
    
    // Verify onClose was called
    expect(handleClose).toHaveBeenCalled();
  });

  // Add more tests for form submission, validation errors, etc.
});