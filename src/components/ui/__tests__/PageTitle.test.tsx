import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageTitle from '../PageTitle';

// Mock the cleanTitle function
vi.mock('@/lib/pathUtils', () => ({
  cleanTitle: vi.fn((title: string) => title?.replace(/<[^>]*>/g, '').trim() || '')
}));

describe('PageTitle', () => {
  test('renders with default props', () => {
    render(<PageTitle title="Test Title" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-sky-900', 'mb-6');
  });

  test('renders title and description', () => {
    render(
      <PageTitle 
        title="Test Title" 
        description="Test description content" 
      />
    );
    
    const heading = screen.getByRole('heading', { level: 1 });
    const description = screen.getByText('Test description content');
    
    expect(heading).toHaveTextContent('Test Title');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('text-xl', 'text-sky-600');
  });

  test('applies correct alignment classes', () => {
    const { rerender } = render(<PageTitle title="Test" align="left" />);
    let container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('text-left');

    rerender(<PageTitle title="Test" align="center" />);
    container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('text-center');

    rerender(<PageTitle title="Test" align="right" />);
    container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('text-right');
  });

  test('applies correct size classes', () => {
    const { rerender } = render(<PageTitle title="Test" size="small" />);
    
    let heading = screen.getByRole('heading');
    let container = heading.closest('div')?.parentElement;
    expect(heading).toHaveClass('text-2xl');
    expect(container).toHaveClass('mb-3');

    rerender(<PageTitle title="Test" size="medium" />);
    heading = screen.getByRole('heading');
    container = heading.closest('div')?.parentElement;
    expect(heading).toHaveClass('text-3xl');
    expect(container).toHaveClass('mb-4');

    rerender(<PageTitle title="Test" size="large" />);
    heading = screen.getByRole('heading');
    container = heading.closest('div')?.parentElement;
    expect(heading).toHaveClass('text-4xl');
    expect(container).toHaveClass('mb-6');
  });

  test('applies custom className', () => {
    render(<PageTitle title="Test" className="custom-class" />);
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  test('centers description text when align is center', () => {
    render(
      <PageTitle 
        title="Test" 
        description="Test description" 
        align="center" 
      />
    );
    
    const description = screen.getByText('Test description');
    expect(description).toHaveClass('mx-auto');
  });

  test('does not add mx-auto to description when align is not center', () => {
    const { rerender } = render(
      <PageTitle 
        title="Test" 
        description="Test description" 
        align="left" 
      />
    );
    
    let description = screen.getByText('Test description');
    expect(description).not.toHaveClass('mx-auto');

    rerender(
      <PageTitle 
        title="Test" 
        description="Test description" 
        align="right" 
      />
    );
    
    description = screen.getByText('Test description');
    expect(description).not.toHaveClass('mx-auto');
  });

  test('applies correct description text size for different sizes', () => {
    const { rerender } = render(
      <PageTitle 
        title="Test" 
        description="Test description" 
        size="small" 
      />
    );
    
    let description = screen.getByText('Test description');
    expect(description).toHaveClass('text-lg');

    rerender(
      <PageTitle 
        title="Test" 
        description="Test description" 
        size="medium" 
      />
    );
    
    description = screen.getByText('Test description');
    expect(description).toHaveClass('text-xl');

    rerender(
      <PageTitle 
        title="Test" 
        description="Test description" 
        size="large" 
      />
    );
    
    description = screen.getByText('Test description');
    expect(description).toHaveClass('text-xl');
  });

  test('does not render description when not provided', () => {
    render(<PageTitle title="Test" />);
    
    const description = screen.queryByText(/description/i);
    expect(description).not.toBeInTheDocument();
    
    // Check that only h1 is rendered in the inner div
    const heading = screen.getByRole('heading');
    const innerDiv = heading.parentElement;
    expect(innerDiv?.children).toHaveLength(1);
    expect(innerDiv?.children[0]).toBe(heading);
  });

  test('applies min-height to container', () => {
    render(<PageTitle title="Test" />);
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('min-h-[160px]');
  });

  test('applies flex layout classes to container', () => {
    render(<PageTitle title="Test" />);
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'justify-end');
  });

  test('uses cleanTitle function to clean the title', async () => {
    const pathUtils = await import('@/lib/pathUtils');
    const { cleanTitle } = vi.mocked(pathUtils);
    
    render(<PageTitle title="<b>Test Title</b>" />);
    
    expect(cleanTitle).toHaveBeenCalledWith('<b>Test Title</b>');
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Test Title');
  });

  test('handles empty title gracefully', () => {
    render(<PageTitle title="" />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  test('handles undefined align prop (defaults to center)', () => {
    render(<PageTitle title="Test" align={undefined} />);
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    expect(container).toHaveClass('text-center');
  });

  test('handles undefined size prop (defaults to large)', () => {
    render(<PageTitle title="Test" size={undefined} />);
    
    const heading = screen.getByRole('heading');
    const container = heading.closest('div')?.parentElement;
    expect(heading).toHaveClass('text-4xl');
    expect(container).toHaveClass('mb-6');
  });

  test('handles empty className prop', () => {
    render(<PageTitle title="Test" className="" />);
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    // Should still have other classes even when className is empty
    expect(container).toHaveClass('flex', 'flex-col', 'justify-end');
    expect(container).toHaveClass('text-center'); // default alignment
    expect(container).toHaveClass('mb-6'); // default size
  });

  test('combines all classes correctly', () => {
    render(
      <PageTitle 
        title="Test" 
        description="Test description"
        align="left" 
        size="medium"
        className="custom-class"
      />
    );
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    const heading = screen.getByRole('heading');
    const description = screen.getByText('Test description');
    
    // Container classes
    expect(container).toHaveClass(
      'flex', 'flex-col', 'justify-end', 
      'text-left', 'mb-4', 'custom-class', 'min-h-[160px]'
    );
    
    // Heading classes
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-sky-900', 'mb-6');
    
    // Description classes
    expect(description).toHaveClass('text-xl', 'text-sky-600', 'max-w-3xl');
    expect(description).not.toHaveClass('mx-auto');
  });

  test('applies max-width to description', () => {
    render(
      <PageTitle 
        title="Test" 
        description="Test description" 
      />
    );
    
    const description = screen.getByText('Test description');
    expect(description).toHaveClass('max-w-3xl');
  });

  test('handles invalid align value gracefully', () => {
    // TypeScript would prevent this, but testing runtime behavior
    render(<PageTitle title="Test" align={'invalid' as any} />);
    
    const container = screen.getByRole('heading').closest('div')?.parentElement;
    // Should not have any text alignment class for invalid value
    expect(container).not.toHaveClass('text-invalid');
    expect(container).not.toHaveClass('text-left');
    expect(container).not.toHaveClass('text-center');
    expect(container).not.toHaveClass('text-right');
  });

  test('handles invalid size value gracefully', () => {
    // TypeScript would prevent this, but testing runtime behavior
    render(<PageTitle title="Test" size={'invalid' as any} />);
    
    const heading = screen.getByRole('heading');
    const container = heading.closest('div')?.parentElement;
    
    // Should fall back to large size
    expect(heading).toHaveClass('text-4xl');
    expect(container).toHaveClass('mb-6');
  });
});
