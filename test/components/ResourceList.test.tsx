import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceList from '@/components/ResourceList';
import { ResourceType } from '@shared/schema';

describe('ResourceList Component', () => {
  // Mock handlers for the resource actions
  const mockHandlers = {
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onCreate: vi.fn(),
  };
  
  // Mock resources
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      createdAt: new Date('2025-03-27').toISOString(),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      createdAt: new Date('2025-03-26').toISOString(),
    },
  ];
  
  const mockProducts = [
    {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      description: 'High-performance laptop',
      category: 'Electronics',
      createdAt: new Date('2025-03-27').toISOString(),
    }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders users list correctly', () => {
    render(
      <ResourceList 
        resourceType="users"
        resources={mockUsers}
        isLoading={false}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onCreate={mockHandlers.onCreate}
      />
    );

    // Check if the user items are rendered correctly
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders products list correctly', () => {
    render(
      <ResourceList 
        resourceType="products"
        resources={mockProducts}
        isLoading={false}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onCreate={mockHandlers.onCreate}
      />
    );

    // Check if product items are rendered correctly
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('High-performance laptop')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <ResourceList 
        resourceType="users"
        resources={[]}
        isLoading={true}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onCreate={mockHandlers.onCreate}
      />
    );

    // Check if loading indicator is rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calls onCreate when Create Resource button is clicked in empty state', async () => {
    render(
      <ResourceList 
        resourceType="users"
        resources={[]} // Empty resources to trigger the empty state
        isLoading={false}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onCreate={mockHandlers.onCreate}
      />
    );

    // Find and click the Create Resource button
    const addButton = screen.getByText('Create Resource');
    await fireEvent.click(addButton);
    
    // Verify onCreate was called
    expect(mockHandlers.onCreate).toHaveBeenCalled();
  });

  it('calls appropriate handler when action buttons are clicked', async () => {
    render(
      <ResourceList 
        resourceType="users"
        resources={mockUsers}
        isLoading={false}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onCreate={mockHandlers.onCreate}
      />
    );

    // Find and click the View button on the first item
    const viewButtons = screen.getAllByText('View');
    await fireEvent.click(viewButtons[0]);
    
    // Verify onView was called with the correct item
    expect(mockHandlers.onView).toHaveBeenCalledWith(mockUsers[0]);
    
    // Find and click the Edit button on the first item
    const editButtons = screen.getAllByText('Edit');
    await fireEvent.click(editButtons[0]);
    
    // Verify onEdit was called with the correct item
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockUsers[0]);
    
    // Find and click the Delete button on the first item
    const deleteButtons = screen.getAllByText('Delete');
    await fireEvent.click(deleteButtons[0]);
    
    // Verify onDelete was called with the correct item
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('renders empty state when no resources are available', () => {
    render(
      <ResourceList 
        resourceType="users"
        resources={[]}
        isLoading={false}
        onView={mockHandlers.onView}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onCreate={mockHandlers.onCreate}
      />
    );

    // Check if the empty state message is displayed
    expect(screen.getByText('No resources found')).toBeInTheDocument();
  });
});