import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceView from '@/components/ResourceView';
import { ResourceType } from '@shared/schema';

// Mock clipboard API
const clipboardWriteTextMock = vi.fn().mockImplementation(() => Promise.resolve());
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: clipboardWriteTextMock,
  },
  writable: true,
});

// Mock toast
const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}));

describe('ResourceView Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    clipboardWriteTextMock.mockClear();
    toastMock.mockClear();
    vi.clearAllMocks();
  });

  it('renders user details correctly', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      createdAt: new Date('2025-03-27').toISOString(),
    };

    const handleClose = vi.fn();

    render(
      <ResourceView
        resourceType="users"
        item={mockUser}
        onClose={handleClose}
      />
    );

    // Check if the title contains the user's name (using a more specific query)
    const dialogTitle = screen.getByRole('heading', { name: /John Doe/i });
    expect(dialogTitle).toBeInTheDocument();
    
    // Check if fields are displayed correctly
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Created At')).toBeInTheDocument();
    
    // Check if values are displayed
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('johndoe')).toBeInTheDocument();
  });

  it('copies text to clipboard when copy button is clicked', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      createdAt: new Date('2025-03-27').toISOString(),
    };

    const handleClose = vi.fn();

    render(
      <ResourceView
        resourceType="users"
        item={mockUser}
        onClose={handleClose}
      />
    );

    // Find all copy buttons (they might be hidden due to CSS)
    const buttons = screen.getAllByTitle(/Copy/);
    
    // Click the first copy button (should be for name)
    await fireEvent.click(buttons[0]);
    
    // Check if clipboard API was called with correct value
    expect(clipboardWriteTextMock).toHaveBeenCalledWith('John Doe');
    
    // Check if toast was called
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Copied!',
      })
    );
  });

  it('renders post details correctly', () => {
    const mockPost = {
      id: 1,
      title: 'Test Post',
      body: 'This is a test post content',
      userId: 1,
      createdAt: new Date('2025-03-27').toISOString(),
    };

    const handleClose = vi.fn();

    render(
      <ResourceView
        resourceType="posts"
        item={mockPost}
        onClose={handleClose}
      />
    );

    // Check if the title contains the post title (using a more specific query)
    const postTitle = screen.getByRole('heading', { name: /Test Post/i });
    expect(postTitle).toBeInTheDocument();
    
    // Check if fields are displayed correctly
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('User ID')).toBeInTheDocument();
    
    // Check if values are displayed
    expect(screen.getByText('This is a test post content')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});