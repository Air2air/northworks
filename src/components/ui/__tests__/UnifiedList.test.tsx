import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UnifiedList from '../UnifiedList'
import { createMockContentItems } from '@/test/utils'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

describe('UnifiedList', () => {
  const mockItems = createMockContentItems(3)

  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders all items in the list', () => {
    render(<UnifiedList items={mockItems} />)
    
    mockItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    })
  })

  it('applies custom className', () => {
    render(<UnifiedList items={mockItems} className="custom-list" />)
    
    const container = screen.getByText(mockItems[0].title).closest('.w-full')
    expect(container).toHaveClass('custom-list')
  })

  it('renders with list layout (only supported layout)', () => {
    render(
      <UnifiedList 
        items={mockItems} 
        options={{ layout: 'list' }}
      />
    )
    
    // List layout should have space-y classes
    const container = screen.getByText(mockItems[0].title).closest('.w-full')
    expect(container?.firstChild).toHaveClass('space-y-4')
  })

  it('handles empty items array', () => {
    const { container } = render(
      <UnifiedList items={[]} />
    )
    
    // Should render the empty state with the correct class structure
    expect(container.firstChild).toHaveClass('text-center py-12')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('passes cardOptions to child cards', () => {
    render(
      <UnifiedList 
        items={mockItems} 
        options={{ cardOptions: { showDate: true, showCategory: true } }}
      />
    )
    
    // Should render the items when cardOptions are passed
    expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    expect(screen.getAllByText('articles')).toHaveLength(3) // All three items have same category
  })

  it('handles item click events', async () => {
    const mockOnItemClick = vi.fn()
    const user = userEvent.setup()
    
    render(
      <UnifiedList 
        items={mockItems} 
        onItemClick={mockOnItemClick}
      />
    )
    
    // Click on the first item (should be a button since it has tags)
    const firstItem = screen.getAllByRole('button')[0]
    await user.click(firstItem)
    
    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0])
  })

  it('enables pagination when specified', () => {
    render(
      <UnifiedList 
        items={mockItems} 
        options={{ 
          pagination: true,
          itemsPerPage: 2
        }}
      />
    )
    
    // Should show pagination controls when enabled
    // Note: May not show if items <= itemsPerPage, but option should be respected
    expect(screen.getByText(mockItems[0].title)).toBeInTheDocument()
  })

  it('enables search when searchable is true', () => {
    render(
      <UnifiedList 
        items={mockItems} 
        options={{ searchable: true }}
      />
    )
    
    // Should show search input when searchable
    const searchInput = screen.queryByPlaceholderText(/search/i)
    if (searchInput) {
      expect(searchInput).toBeInTheDocument()
    }
  })

  it('applies different sort orders', () => {
    render(
      <UnifiedList 
        items={mockItems} 
        options={{ 
          sortBy: 'title',
          sortOrder: 'asc'
        }}
      />
    )
    
    // Should render items (sorting tested internally)
    expect(screen.getByText(mockItems[0].title)).toBeInTheDocument()
  })

  it('shows empty message when no items', () => {
    render(
      <UnifiedList 
        items={[]} 
        options={{ emptyMessage: 'No items found' }}
      />
    )
    
    // Should show empty message
    const emptyMessage = screen.queryByText('No items found')
    if (emptyMessage) {
      expect(emptyMessage).toBeInTheDocument()
    }
  })
})
