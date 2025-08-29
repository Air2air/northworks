import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMockContentItem } from '@/test/utils'
import UnifiedMetadata from '../UnifiedMetadata'

describe('UnifiedMetadata', () => {
  const mockItem = createMockContentItem({
    title: 'Test Article',
    publishedDate: '2024-01-15',
    publication: {
      author: 'John Doe',
      publication: 'Test Magazine',
      date: '2024-01-15'
    }
  })

  it('renders metadata from content item', () => {
    render(
      <UnifiedMetadata 
        item={mockItem} 
        variant="detail"
        showDate={true}
        showAuthor={true}
        showPublication={true}
      />
    )
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Test Magazine')).toBeInTheDocument()
  })

  it('renders manual metadata fields', () => {
    const manualFields = [
      { label: 'Custom Field', value: 'Custom Value' },
      { label: 'Another Field', value: 'Another Value' }
    ]
    
    render(
      <UnifiedMetadata 
        fields={manualFields}
        variant="detail"
      />
    )
    
    expect(screen.getByText('Custom Field:')).toBeInTheDocument()
    expect(screen.getByText('Custom Value')).toBeInTheDocument()
    expect(screen.getByText('Another Field:')).toBeInTheDocument()
    expect(screen.getByText('Another Value')).toBeInTheDocument()
  })

  it('renders with card variant (no labels)', () => {
    render(
      <UnifiedMetadata 
        item={mockItem} 
        variant="card"
        showDate={true}
        showAuthor={true}
      />
    )
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    // Labels should not be present in card variant
    expect(screen.queryByText('Date:')).not.toBeInTheDocument()
    expect(screen.queryByText('Author:')).not.toBeInTheDocument()
  })

  it('renders with minimal variant', () => {
    render(
      <UnifiedMetadata 
        item={mockItem} 
        variant="minimal"
        showDate={true}
      />
    )
    
    const container = screen.getByText('January 15, 2024').closest('div')
    expect(container).toHaveClass('flex', 'items-center', 'gap-1', 'text-xs')
  })

  it('renders with custom title', () => {
    render(
      <UnifiedMetadata 
        item={mockItem} 
        variant="detail"
        title="Publication Details"
        showDate={true}
      />
    )
    
    expect(screen.getByText('Publication Details')).toBeInTheDocument()
  })

  it('returns null when no fields are available', () => {
    const emptyItem = createMockContentItem({
      publishedDate: undefined,
      publication: undefined
    })
    
    const { container } = render(
      <UnifiedMetadata 
        item={emptyItem} 
        variant="detail"
        showDate={false}
        showAuthor={false}
        showPublication={false}
        showCategory={false}
        showOrganization={false}
        showPosition={false}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('shows icons when enabled', () => {
    render(
      <UnifiedMetadata 
        item={mockItem} 
        variant="card"
        showIcons={true}
        showDate={true}
      />
    )
    
    // Check for calendar icon
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})
