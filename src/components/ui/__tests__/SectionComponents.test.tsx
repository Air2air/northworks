import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionCard from '../SectionCard'
import SectionGrid from '../SectionGrid'
import type { SectionCardProps, SectionGridProps } from '@/types'

describe('Section Components with Centralized Props', () => {
  describe('SectionCard', () => {
    const defaultProps: SectionCardProps = {
      content: '# Test Section\n\nThis is test content for the section.',
      index: 1,
      className: 'test-section-card'
    }

    it('renders with centralized SectionCardProps interface', () => {
      render(<SectionCard {...defaultProps} />)
      
      // Should render the section content (parsed and cleaned) - content without markdown formatting
      expect(screen.getByText(/This is test content for the section/)).toBeInTheDocument()
    })

    it('accepts all properties from centralized interface', () => {
      const fullProps: SectionCardProps = {
        content: 'Full section content with **markdown**',
        index: 2,
        className: 'custom-section-class'
      }

      render(<SectionCard {...fullProps} />)
      
      // Should render with custom class and parsed content 
      const container = document.querySelector('.custom-section-class')
      expect(container).toBeInTheDocument()
      expect(screen.getByText('Full section content with')).toBeInTheDocument()
    })

    it('handles optional title correctly', () => {
      const propsWithoutTitle: SectionCardProps = {
        content: 'Content without title',
        index: 3
      }

      render(<SectionCard {...propsWithoutTitle} />)
      
      // Should render content even without title
      expect(screen.getByText(/Content without title/)).toBeInTheDocument()
    })

    it('handles optional index correctly', () => {
      const propsWithoutIndex: SectionCardProps = {
        content: 'Content only'
      }

      render(<SectionCard {...propsWithoutIndex} />)
      
      expect(screen.getByText('Content only')).toBeInTheDocument()
    })

    it('handles optional className correctly', () => {
      const propsWithoutClass: SectionCardProps = {
        content: 'Content without custom class'
      }

      render(<SectionCard {...propsWithoutClass} />)
      
      expect(screen.getByText('Content without custom class')).toBeInTheDocument()
    })

    it('maintains proper TypeScript interface compliance', () => {
      const validProps: SectionCardProps = {
        title: 'Valid Props',
        content: 'Valid content',
        index: 1,
        className: 'valid-class'
      }

      expect(() => render(<SectionCard {...validProps} />)).not.toThrow()
    })
  })

  describe('SectionGrid', () => {
    const defaultFrontmatter = {
      title: 'Grid Title',
      type: 'article',
      category: 'articles'
    }

    const defaultProps: SectionGridProps = {
      content: '# Grid Content\n\nThis is grid content.',
      frontmatter: defaultFrontmatter,
      className: 'test-section-grid'
    }

    it('renders with centralized SectionGridProps interface', () => {
      render(<SectionGrid {...defaultProps} />)
      
      // Should render the grid content
      expect(screen.getByText('Grid Title')).toBeInTheDocument()
    })

    it('accepts all properties from centralized interface', () => {
      const fullProps: SectionGridProps = {
        content: 'Full grid content with sections',
        frontmatter: {
          title: 'Full Grid Title',
          type: 'interview',
          category: 'interviews',
          publication: {
            date: '2024-01-15',
            outlet: 'Music Journal'
          }
        },
        className: 'custom-grid-class'
      }

      render(<SectionGrid {...fullProps} />)
      
      expect(screen.getByText('Full Grid Title')).toBeInTheDocument()
    })

    it('handles different frontmatter structures', () => {
      const propsWithMinimalFrontmatter: SectionGridProps = {
        content: 'Minimal content',
        frontmatter: {
          title: 'Minimal Title'
        }
      }

      render(<SectionGrid {...propsWithMinimalFrontmatter} />)
      
      expect(screen.getByText('Minimal Title')).toBeInTheDocument()
    })

    it('handles frontmatter with various content types', () => {
      const contentTypes = ['article', 'interview', 'review', 'professional']
      
      contentTypes.forEach(type => {
        const props: SectionGridProps = {
          content: `${type} content`,
          frontmatter: {
            title: `${type} Title`,
            type
          }
        }

        const { unmount } = render(<SectionGrid {...props} />)
        
        expect(screen.getByText(`${type} Title`)).toBeInTheDocument()
        
        unmount()
      })
    })

    it('handles optional className correctly', () => {
      const propsWithoutClass: SectionGridProps = {
        content: 'No class content',
        frontmatter: defaultFrontmatter
      }

      render(<SectionGrid {...propsWithoutClass} />)
      
      expect(screen.getByText('Grid Title')).toBeInTheDocument()
    })

    it('maintains proper TypeScript interface compliance', () => {
      const validProps: SectionGridProps = {
        content: 'Valid grid content',
        frontmatter: {
          title: 'Valid Grid',
          type: 'article'
        },
        className: 'valid-grid-class'
      }

      expect(() => render(<SectionGrid {...validProps} />)).not.toThrow()
    })
  })

  describe('Cross-Component Compatibility', () => {
    it('should work together with consistent prop interfaces', () => {
      const sharedContent = '# Shared Content\n\nThis content is used by both components.'
      
      const cardProps: SectionCardProps = {
        content: sharedContent,
        index: 1,
        className: 'shared-class'
      }
      
      const gridProps: SectionGridProps = {
        content: sharedContent,
        frontmatter: {
          title: 'Grid Title'
        },
        className: 'shared-class'
      }
      
      // Both should render without issues
      const { unmount: unmountCard } = render(<SectionCard {...cardProps} />)
      expect(screen.getByText(/This content is used by both components/)).toBeInTheDocument()
      unmountCard()
      
      const { unmount: unmountGrid } = render(<SectionGrid {...gridProps} />)
      expect(screen.getByText('Grid Title')).toBeInTheDocument()
      unmountGrid()
    })
  })
})
