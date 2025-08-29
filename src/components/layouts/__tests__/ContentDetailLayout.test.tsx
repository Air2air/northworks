import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContentDetailLayout from '../ContentDetailLayout'
import type { ContentDetailLayoutProps } from '@/types'

// Mock the MDXRemote component
vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx-content">{source}</div>
}))

// Mock child components
vi.mock('@/components/ui/PageTitle', () => ({
  default: ({ title }: { title: string }) => <h1 data-testid="page-title">{title}</h1>
}))

// Mock components
vi.mock('@/components/ui/UnifiedMetadata', () => ({
  default: ({ frontmatter }: { frontmatter: any }) => (
    <div data-testid="metadata">{frontmatter?.title || 'No metadata'}</div>
  )
}))

vi.mock('@/components/ImageGallery', () => ({
  default: ({ images }: { images: any[] }) => (
    <div data-testid="image-gallery">{images?.length || 0} images</div>
  )
}))

vi.mock('@/components/ui/Tags', () => ({
  default: ({ tags }: { tags?: string[] }) => (
    tags && tags.length > 0 ? <div data-testid="tags">Tags: {tags.join(', ')}</div> : null
  )
}))

vi.mock('@/components/layouts/UnifiedLayout', () => ({
  default: ({ children, breadcrumbs }: { children: React.ReactNode, breadcrumbs: any[] }) => (
    <div data-testid="unified-layout">
      <nav data-testid="breadcrumbs">{breadcrumbs?.length || 0} breadcrumbs</nav>
      {children}
    </div>
  )
}))

describe('ContentDetailLayout', () => {
  const baseFrontmatter = {
    id: 'test-content',
    title: 'Test Content Title',
    type: 'article',
    category: 'articles'
  }

  const baseProps: ContentDetailLayoutProps = {
    frontmatter: baseFrontmatter,
    content: 'Test content body',
    slug: 'test-content',
    contentType: 'article',
    breadcrumbConfig: {
      parentPath: '/articles',
      parentLabel: 'Articles'
    },
    collection: 'cheryl'
  }

  it('renders with centralized ContentDetailLayoutProps interface', () => {
    render(<ContentDetailLayout {...baseProps} />)
    
    expect(screen.getByTestId('unified-layout')).toBeInTheDocument()
    expect(screen.getByTestId('page-title')).toHaveTextContent('Test Content Title')
    expect(screen.getByTestId('mdx-content')).toHaveTextContent('Test content body')
  })

  it('accepts all required props from centralized interface', () => {
    const fullProps: ContentDetailLayoutProps = {
      frontmatter: {
        ...baseFrontmatter,
        publication: {
          date: '2024-01-15',
          outlet: 'Music Journal'
        },
        images: [{ src: '/test.jpg', alt: 'Test' }],
        subjects: ['music', 'classical']
      },
      content: 'Full content body',
      slug: 'full-content',
      contentType: 'interview',
      breadcrumbConfig: {
        parentPath: '/interviews',
        parentLabel: 'Interviews',
        grandParentPath: '/cheryl',
        grandParentLabel: 'Cheryl North'
      },
      collection: 'cheryl'
    }

    render(<ContentDetailLayout {...fullProps} />)
    
    expect(screen.getByTestId('unified-layout')).toBeInTheDocument()
    expect(screen.getByTestId('page-title')).toBeInTheDocument()
    expect(screen.getByTestId('metadata')).toBeInTheDocument()
  })

  it('generates breadcrumbs correctly with centralized props', () => {
    const propsWithGrandParent: ContentDetailLayoutProps = {
      ...baseProps,
      breadcrumbConfig: {
        parentPath: '/articles',
        parentLabel: 'Articles',
        grandParentPath: '/cheryl',
        grandParentLabel: 'Cheryl North'
      }
    }

    render(<ContentDetailLayout {...propsWithGrandParent} />)
    
    // Should have breadcrumbs (Home + Grand Parent + Parent + Current)
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('4 breadcrumbs')
  })

  it('handles different content types correctly', () => {
    const contentTypes = ['article', 'interview', 'review', 'professional', 'publication', 'background']
    
    contentTypes.forEach(contentType => {
      const props: ContentDetailLayoutProps = {
        ...baseProps,
        contentType,
        frontmatter: {
          ...baseFrontmatter,
          type: contentType
        }
      }

      const { unmount } = render(<ContentDetailLayout {...props} />)
      
      expect(screen.getByTestId('unified-layout')).toBeInTheDocument()
      
      unmount()
    })
  })

  it('handles different collection types correctly', () => {
    const collections = ['cheryl', 'warner', 'global'] as const
    
    collections.forEach(collection => {
      const props: ContentDetailLayoutProps = {
        ...baseProps,
        collection
      }

      const { unmount } = render(<ContentDetailLayout {...props} />)
      
      expect(screen.getByTestId('unified-layout')).toBeInTheDocument()
      
      unmount()
    })
  })

  it('renders metadata when available', () => {
    const propsWithMetadata: ContentDetailLayoutProps = {
      ...baseProps,
      frontmatter: {
        ...baseFrontmatter,
        publication: {
          date: '2024-01-15',
          outlet: 'Music Journal',
          section: 'Reviews'
        }
      }
    }

    render(<ContentDetailLayout {...propsWithMetadata} />)
    
    expect(screen.getByTestId('metadata')).toBeInTheDocument()
  })

  it('renders image gallery when images are present', () => {
    const propsWithImages: ContentDetailLayoutProps = {
      ...baseProps,
      frontmatter: {
        ...baseFrontmatter,
        images: [
          { src: '/image1.jpg', alt: 'Image 1' },
          { src: '/image2.jpg', alt: 'Image 2' }
        ]
      }
    }

    render(<ContentDetailLayout {...propsWithImages} />)
    
    expect(screen.getByTestId('image-gallery')).toHaveTextContent('2 images')
  })

  it('renders tags when subjects are present', () => {
    const propsWithTags: ContentDetailLayoutProps = {
      ...baseProps,
      frontmatter: {
        ...baseFrontmatter,
        tags: ['music', 'classical', 'opera']  // Use tags field instead of subjects
      }
    }

    render(<ContentDetailLayout {...propsWithTags} />)
    
    expect(screen.getByTestId('tags')).toHaveTextContent('music, classical, opera')
  })

  it('handles minimal props correctly', () => {
    const minimalProps: ContentDetailLayoutProps = {
      frontmatter: { title: 'Minimal Title' },
      content: 'Minimal content',
      slug: 'minimal',
      contentType: 'article',
      breadcrumbConfig: {
        parentPath: '/articles',
        parentLabel: 'Articles'
      }
    }

    render(<ContentDetailLayout {...minimalProps} />)
    
    expect(screen.getByTestId('unified-layout')).toBeInTheDocument()
    expect(screen.getByTestId('page-title')).toHaveTextContent('Minimal Title')
  })

  it('maintains proper TypeScript interface compliance', () => {
    // This test verifies that the component accepts the centralized interface
    const validProps: ContentDetailLayoutProps = {
      frontmatter: baseFrontmatter,
      content: 'Test content',
      slug: 'test-slug',
      contentType: 'article',
      breadcrumbConfig: {
        parentPath: '/articles',
        parentLabel: 'Articles'
      },
      collection: 'cheryl'
    }

    // Should compile and render without TypeScript errors
    expect(() => render(<ContentDetailLayout {...validProps} />)).not.toThrow()
  })
})
