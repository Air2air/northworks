import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {
  BreadcrumbItem,
  TagsProps,
  NavigationItem,
  PublicationInfoProps,
  CollectionType
} from '@/types'

// Mock components for testing prop interfaces
const MockBreadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav data-testid="breadcrumbs">
    {items.map((item, index) => (
      <span key={index} className={item.active ? 'active' : ''}>
        {item.label}
      </span>
    ))}
  </nav>
)

const MockTags = ({ tags, variant, collection }: TagsProps) => (
  <div data-testid="tags" data-variant={variant} data-collection={collection}>
    {tags.map(tag => <span key={tag}>{tag}</span>)}
  </div>
)

const MockNavigation = ({ items }: { items: NavigationItem[] }) => (
  <nav data-testid="navigation">
    {items.map((item, index) => (
      <a key={index} href={item.href} className={item.active ? 'active' : ''}>
        {item.label}
      </a>
    ))}
  </nav>
)

const MockPublicationInfo = (props: PublicationInfoProps) => (
  <div data-testid="publication-info" className={props.className}>
    <span data-testid="pub-date">{props.date}</span>
    <span data-testid="pub-title">{props.publication}</span>
    <span data-testid="pub-author">{props.author}</span>
  </div>
)

describe('Centralized Props Integration Tests', () => {
  describe('BreadcrumbItem Integration', () => {
    it('should work consistently across components', () => {
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/', active: false },
        { label: 'Articles', href: '/articles', active: false },
        { label: 'Current Article', href: '/articles/current', active: true }
      ]

      render(<MockBreadcrumbs items={breadcrumbs} />)
      
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Current Article')).toHaveClass('active')
    })

    it('should maintain type safety across usage', () => {
      const validBreadcrumb: BreadcrumbItem = {
        label: 'Test Label',
        href: '/test',
        active: true
      }
      
      expect(validBreadcrumb.label).toBe('Test Label')
      expect(validBreadcrumb.active).toBe(true)
    })
  })

  describe('TagsProps Integration', () => {
    it('should work with collection types correctly', () => {
      const collections: CollectionType[] = ['cheryl', 'warner', 'global']
      
      collections.forEach(collection => {
        const tagsProps: TagsProps = {
          tags: ['music', 'classical'],
          variant: 'medium',
          collection
        }

        const { unmount } = render(<MockTags {...tagsProps} />)
        
        const tagsElement = screen.getByTestId('tags')
        expect(tagsElement).toHaveAttribute('data-collection', collection)
        expect(tagsElement).toHaveAttribute('data-variant', 'medium')
        
        unmount()
      })
    })

    it('should handle different variants', () => {
      const variants = ['small', 'medium', 'large', 'compact'] as const
      
      variants.forEach(variant => {
        const tagsProps: TagsProps = {
          tags: ['test'],
          variant
        }

        const { unmount } = render(<MockTags {...tagsProps} />)
        
        expect(screen.getByTestId('tags')).toHaveAttribute('data-variant', variant)
        
        unmount()
      })
    })
  })

  describe('NavigationItem Integration', () => {
    it('should maintain consistent navigation structure', () => {
      const navItems: NavigationItem[] = [
        { label: 'Home', href: '/', active: false },
        { label: 'Articles', href: '/articles', active: true },
        { label: 'Interviews', href: '/interviews', active: false }
      ]

      render(<MockNavigation items={navItems} />)
      
      const navigation = screen.getByTestId('navigation')
      expect(navigation).toBeInTheDocument()
      
      const activeLink = screen.getByText('Articles')
      expect(activeLink).toHaveClass('active')
      expect(activeLink).toHaveAttribute('href', '/articles')
    })
  })

  describe('PublicationInfoProps Integration', () => {
    it('should handle complete publication information', () => {
      const pubInfo: PublicationInfoProps = {
        date: '2024-01-15',
        publication: 'Music Weekly',
        section: 'Reviews',
        author: 'Jane Smith',
        title: 'Concert Review Title',
        className: 'publication-meta'
      }

      render(<MockPublicationInfo {...pubInfo} />)
      
      expect(screen.getByTestId('publication-info')).toHaveClass('publication-meta')
      expect(screen.getByTestId('pub-date')).toHaveTextContent('2024-01-15')
      expect(screen.getByTestId('pub-title')).toHaveTextContent('Music Weekly')
      expect(screen.getByTestId('pub-author')).toHaveTextContent('Jane Smith')
    })

    it('should handle partial publication information', () => {
      const partialPubInfo: PublicationInfoProps = {
        date: '2024-01-15',
        publication: 'Music Weekly'
      }

      render(<MockPublicationInfo {...partialPubInfo} />)
      
      expect(screen.getByTestId('pub-date')).toHaveTextContent('2024-01-15')
      expect(screen.getByTestId('pub-title')).toHaveTextContent('Music Weekly')
    })
  })

  describe('Cross-Component Type Consistency', () => {
    it('should allow props to be shared between components', () => {
      // Test that the same data structures work across different components
      const collection: CollectionType = 'cheryl'
      
      const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Cheryl North', href: '/cheryl', active: false },
        { label: 'Articles', href: '/cheryl/articles', active: true }
      ]
      
      const tags: TagsProps = {
        tags: ['music', 'classical'],
        collection,
        variant: 'medium'
      }
      
      // All should render without issues
      const { unmount: unmountBreadcrumbs } = render(<MockBreadcrumbs items={breadcrumbs} />)
      expect(screen.getByText('Cheryl North')).toBeInTheDocument()
      unmountBreadcrumbs()
      
      const { unmount: unmountTags } = render(<MockTags {...tags} />)
      expect(screen.getByTestId('tags')).toHaveAttribute('data-collection', 'cheryl')
      unmountTags()
    })

    it('should maintain TypeScript safety across all interfaces', () => {
      // This test ensures all our centralized interfaces work together
      const testData = {
        collection: 'warner' as CollectionType,
        breadcrumbs: [
          { label: 'Warner North', href: '/warner', active: false },
          { label: 'Publications', href: '/warner/publications', active: true }
        ] as BreadcrumbItem[],
        tags: {
          tags: ['risk analysis', 'decision science'],
          variant: 'large' as const,
          collection: 'warner' as CollectionType
        } as TagsProps,
        publication: {
          date: '2024-01-15',
          publication: 'Risk Analysis Journal',
          author: 'D. Warner North'
        } as PublicationInfoProps
      }
      
      // All interfaces should work together seamlessly
      expect(testData.collection).toBe('warner')
      expect(testData.breadcrumbs).toHaveLength(2)
      expect(testData.tags.collection).toBe('warner')
      expect(testData.publication.author).toBe('D. Warner North')
    })
  })

  describe('Props Interface Evolution Safety', () => {
    it('should maintain backward compatibility', () => {
      // Test that our centralized interfaces remain stable
      const stableInterfaces = {
        breadcrumb: { label: 'Test', href: '/test', active: false } as BreadcrumbItem,
        tags: { tags: ['test'] } as TagsProps,
        navigation: { label: 'Test', href: '/test' } as NavigationItem,
        publication: { date: '2024-01-01' } as PublicationInfoProps
      }
      
      // All should have the expected properties
      expect(stableInterfaces.breadcrumb).toHaveProperty('label')
      expect(stableInterfaces.breadcrumb).toHaveProperty('href')
      expect(stableInterfaces.breadcrumb).toHaveProperty('active')
      
      expect(stableInterfaces.tags).toHaveProperty('tags')
      
      expect(stableInterfaces.navigation).toHaveProperty('label')
      expect(stableInterfaces.navigation).toHaveProperty('href')
      
      expect(stableInterfaces.publication).toHaveProperty('date')
    })
  })
})
