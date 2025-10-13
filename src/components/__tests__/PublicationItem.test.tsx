import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PublicationItem from '../PublicationItem';

describe('PublicationItem', () => {
  it('renders with required props', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
      />
    );

    expect(screen.getByText('Test Publication Title')).toBeInTheDocument();
    expect(screen.getByAltText('Test book cover')).toBeInTheDocument();
  });

  it('renders with all optional props', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
        authors="John Doe, Jane Smith"
        details="National Academy Press, 1996"
        href="/publications/test"
      />
    );

    expect(screen.getByText('Test Publication Title')).toBeInTheDocument();
    expect(screen.getByText('John Doe, Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('National Academy Press, 1996')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
        href="/publications/test"
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/publications/test');
  });

  it('opens external links in new tab', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
        href="https://example.com/publication"
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render as a link when href is not provided', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
      />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('correctly formats thumbnail path with /images/pubs/ prefix', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
      />
    );

    const img = screen.getByAltText('Test book cover');
    expect(img).toHaveAttribute('src', expect.stringContaining('book-understanding.gif'));
  });

  it('handles thumbnail path that already has prefix', () => {
    render(
      <PublicationItem
        thumbnail="/images/pubs/book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
      />
    );

    const img = screen.getByAltText('Test book cover');
    expect(img).toBeInTheDocument();
  });

  it('uses default dimensions when not specified', () => {
    const { container } = render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
      />
    );

    // Check that Image component receives default width and height
    const img = screen.getByAltText('Test book cover');
    expect(img).toBeInTheDocument();
  });

  it('uses custom dimensions when provided', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
        width={150}
        height={200}
      />
    );

    const img = screen.getByAltText('Test book cover');
    expect(img).toBeInTheDocument();
  });

  it('applies proper styling classes', () => {
    const { container } = render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
      />
    );

    // Check for flex layout container
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toBeInTheDocument();

    // Check for background styling
    const styledDiv = container.querySelector('.bg-gray-50');
    expect(styledDiv).toBeInTheDocument();
  });

  it('renders without authors when not provided', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
        details="National Academy Press, 1996"
      />
    );

    expect(screen.getByText('Test Publication Title')).toBeInTheDocument();
    expect(screen.getByText('National Academy Press, 1996')).toBeInTheDocument();
  });

  it('renders without details when not provided', () => {
    render(
      <PublicationItem
        thumbnail="book-understanding.gif"
        alt="Test book cover"
        title="Test Publication Title"
        authors="John Doe"
      />
    );

    expect(screen.getByText('Test Publication Title')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
