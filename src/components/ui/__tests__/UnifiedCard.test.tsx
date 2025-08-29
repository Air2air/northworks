import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMockContentItem } from '@/test/utils'
import UnifiedCard from '../UnifiedCard'

describe('UnifiedCard', () => {
  const mockItem = createMockContentItem({
    title: 'Test Article Title',
    summary: 'This is a test summary for the article',
    publishedDate: '2024-01-15',
    category: 'articles'
  })

  it('renders the card with basic content', () => {
    render(<UnifiedCard item={mockItem} />)
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('This is a test summary for the article')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const mockOnClick = vi.fn()
    
    render(
      <UnifiedCard 
        item={mockItem} 
        onClick={mockOnClick}
      />
    )
    
    const user = userEvent.setup()
    // Since the item has tags, it will have role="button" instead of "article"
    const card = screen.getByRole('button')
    await user.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockItem)
  })

  it('applies custom className', () => {
    render(
      <UnifiedCard item={mockItem} className="custom-class" />
    )
    
    // Since the item has tags, it will have role="button"
    const card = screen.getByRole('button')
    expect(card).toHaveClass('custom-class')
  })

  it('renders with horizontal layout by default', () => {
    render(<UnifiedCard item={mockItem} />)
    
    // Since the item has tags, it will have role="button"
    const card = screen.getByRole('button')
    expect(card).toHaveClass('flex')
  })

  it('renders with vertical layout when specified', () => {
    render(
      <UnifiedCard 
        item={mockItem} 
        options={{ layout: 'vertical' }}
      />
    )
    
    // Since the item has tags, it will have role="button"
    const card = screen.getByRole('button')
    expect(card).toHaveClass('flex', 'flex-col')
  })

  it('shows category when showCategory is true', () => {
    render(
      <UnifiedCard 
        item={mockItem} 
        options={{ showCategory: true }}
      />
    )
    
    expect(screen.getByText('articles')).toBeInTheDocument()
  })

  it('shows date when showDate is true', () => {
    render(
      <UnifiedCard 
        item={mockItem} 
        options={{ showDate: true }}
      />
    )
    
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
  })

  it('renders without errors when optional fields are missing', () => {
    const minimalItem = createMockContentItem({
      title: 'Minimal Item',
      summary: undefined,
      publishedDate: undefined
    })
    
    render(<UnifiedCard item={minimalItem} />)
    
    expect(screen.getByText('Minimal Item')).toBeInTheDocument()
  })
})
