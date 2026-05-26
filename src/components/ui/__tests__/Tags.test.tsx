import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Tags from '../Tags'

describe('Tags', () => {
  const mockTags = ['music', 'opera', 'classical']

  it('renders all tags correctly', () => {
    render(<Tags tags={mockTags} />)
    
    expect(screen.getByText('music')).toBeInTheDocument()
    expect(screen.getByText('opera')).toBeInTheDocument()
    expect(screen.getByText('classical')).toBeInTheDocument()
  })

  it('renders as links with correct href', () => {
    render(<Tags tags={['music', 'opera']} />)
    
    const musicLink = screen.getByRole('link', { name: 'music' })
    expect(musicLink).toHaveAttribute('href', '/search?q=music')
  })

  it('returns null when no tags provided', () => {
    const { container } = render(<Tags tags={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when tags is undefined', () => {
    const { container } = render(<Tags tags={undefined as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className', () => {
    const { container } = render(<Tags tags={mockTags} className="custom-class" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-class')
  })

  it('applies compact variant styles', () => {
    render(<Tags tags={['test']} variant="compact" />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveClass('rounded-full', 'px-3', 'py-1.5', 'text-sm')
  })

  it('applies medium variant styles (default)', () => {
    render(<Tags tags={['test']} variant="medium" />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveClass('rounded-md', 'px-3', 'py-1.5', 'text-sm')
  })

  it('applies large variant styles', () => {
    render(<Tags tags={['test']} variant="large" />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveClass('rounded-lg', 'px-4', 'py-2', 'text-base')
  })

  it('uses medium variant as default when no variant specified', () => {
    render(<Tags tags={['test']} />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveClass('rounded-md', 'px-3', 'py-1.5', 'text-sm')
  })

  it('applies consistent base styles for all variants', () => {
    render(<Tags tags={['test']} variant="compact" />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveClass(
      'inline-block',
      'transition-colors',
      'duration-200',
      'hover:opacity-80',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'no-underline'
    )
  })

  it('applies color and hover styles', () => {
    render(<Tags tags={['test']} />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveClass(
      'bg-sky-600',
      'text-white',
      'hover:bg-sky-700',
      'focus:ring-sky-500'
    )
  })

  it('handles different collection types for search URLs', () => {
    render(<Tags tags={['test']} collection="cheryl" />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveAttribute('href', '/search?collection=cheryl&q=test')
  })

  it('uses global search URL when collection is global', () => {
    render(<Tags tags={['test']} collection="global" />)
    
    const link = screen.getByRole('link', { name: 'test' })
    expect(link).toHaveAttribute('href', '/search?q=test')
  })

  it('sets correct title attribute for global collection', () => {
    render(<Tags tags={['music']} collection="global" />)
    
    const link = screen.getByRole('link', { name: 'music' })
    expect(link).toHaveAttribute('title', 'Search for "music"')
  })

  it('sets correct title attribute for specific collection', () => {
    render(<Tags tags={['music']} collection="cheryl" />)
    
    const link = screen.getByRole('link', { name: 'music' })
    expect(link).toHaveAttribute('title', 'Search for "music" in cheryl collection')
  })

  it('handles click events with stopPropagation', () => {
    const mockStopPropagation = vi.fn()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Tags tags={['test']} />)
    
    const link = screen.getByRole('link', { name: 'test' })

    // Prevent jsdom from attempting real navigation during this unit test.
    link.addEventListener('click', (event) => event.preventDefault())
    
    // Create a mock event and simulate click
    const mockEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    mockEvent.stopPropagation = mockStopPropagation
    
    // Fire the click event
    link.dispatchEvent(mockEvent)
    
    expect(mockStopPropagation).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('renders multiple tags with proper spacing', () => {
    const { container } = render(<Tags tags={mockTags} />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-wrap', 'gap-2')
    expect(wrapper.children).toHaveLength(3)
  })

  it('handles empty className gracefully', () => {
    const { container } = render(<Tags tags={['test']} className="" />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-wrap', 'gap-2')
  })

  it('handles undefined className gracefully', () => {
    const { container } = render(<Tags tags={['test']} className={undefined} />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-wrap', 'gap-2')
  })

  it('uses proper key for each tag', () => {
    const { container } = render(<Tags tags={mockTags} />)
    
    // React should render all tags without key conflicts
    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(3)
  })

  it('handles tags with special characters in search URL', () => {
    render(<Tags tags={['opera & symphony']} />)
    
    const link = screen.getByRole('link', { name: 'opera & symphony' })
    expect(link).toHaveAttribute('href', '/search?q=opera+%26+symphony')
  })
})
