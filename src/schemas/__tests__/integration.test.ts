import { describe, it, expect } from 'vitest'
import type { UnifiedCardProps, UnifiedListProps } from '@/schemas/unified-content-schema'
import type { CollectionType } from '@/types'

describe('Schema Integration with Centralized Types', () => {
  describe('UnifiedCardProps Integration', () => {
    it('should work with centralized CollectionType', () => {
      const validCollections: CollectionType[] = ['cheryl', 'warner', 'global']
      
      validCollections.forEach(collection => {
        const cardProps: UnifiedCardProps = {
          item: {
            id: 'test-item',
            type: 'article',
            category: 'articles',
            title: 'Test Article',
            url: '/test-article',
            status: 'published',
            featured: false,
            priority: 1
          },
          collection,
          options: {
            layout: 'horizontal',
            showImage: true,
            showDate: true,
            showCategory: true,
            imageVariant: 'thumbnail'
          }
        }
        
        expect(cardProps.collection).toBe(collection)
        expect(cardProps.item.title).toBe('Test Article')
      })
    })

    it('should support optional collection property', () => {
      const cardPropsWithoutCollection: UnifiedCardProps = {
        item: {
          id: 'test-item',
          type: 'article',
          category: 'articles',
          title: 'Test Article',
          url: '/test-article',
          status: 'published',
          featured: false,
          priority: 1
        }
      }
      
      expect(cardPropsWithoutCollection.collection).toBeUndefined()
    })

    it('should support all display options', () => {
      const cardPropsWithAllOptions: UnifiedCardProps = {
        item: {
          id: 'test-item',
          type: 'interview',
          category: 'interviews',
          title: 'Test Interview',
          url: '/test-interview',
          status: 'published',
          featured: true,
          priority: 1
        },
        collection: 'cheryl',
        options: {
          layout: 'vertical',
          showImage: true,
          showDate: true,
          showCategory: true,
          showTags: true,
          showExcerpt: true,
          imageVariant: 'thumbnail',
          className: 'custom-card-class'
        },
        onClick: (item) => console.log(item),
        className: 'wrapper-class'
      }
      
      expect(cardPropsWithAllOptions.options?.layout).toBe('vertical')
      expect(cardPropsWithAllOptions.options?.showTags).toBe(true)
      expect(cardPropsWithAllOptions.className).toBe('wrapper-class')
    })
  })

  describe('UnifiedListProps Integration', () => {
    it('should work with centralized CollectionType', () => {
      const mockItems = [
        {
          id: 'item-1',
          type: 'article' as const,
          category: 'articles' as const,
          title: 'Article 1',
          url: '/article-1',
          status: 'published' as const,
          featured: false,
          priority: 1
        },
        {
          id: 'item-2',
          type: 'interview' as const,
          category: 'interviews' as const,
          title: 'Interview 1',
          url: '/interview-1',
          status: 'published' as const,
          featured: true,
          priority: 2
        }
      ]

      const listProps: UnifiedListProps = {
        items: mockItems,
        collection: 'cheryl',
        options: {
          layout: 'list',
          pagination: true,
          itemsPerPage: 10,
          sortBy: 'date',
          sortOrder: 'desc'
        }
      }
      
      expect(listProps.collection).toBe('cheryl')
      expect(listProps.items).toHaveLength(2)
      expect(listProps.options?.layout).toBe('list')
    })

    it('should support optional collection property', () => {
      const listPropsWithoutCollection: UnifiedListProps = {
        items: [{
          id: 'test-item',
          type: 'article',
          category: 'articles',
          title: 'Test Article',
          url: '/test-article',
          status: 'published',
          featured: false,
          priority: 1
        }]
      }
      
      expect(listPropsWithoutCollection.collection).toBeUndefined()
    })

    it('should support all list display options', () => {
      const listPropsWithAllOptions: UnifiedListProps = {
        items: [],
        collection: 'warner',
        options: {
          layout: 'list',
          pagination: true,
          itemsPerPage: 20,
          sortBy: 'title',
          sortOrder: 'asc',
          groupBy: 'category'
        },
        onItemClick: (item) => console.log(item),
        className: 'list-wrapper'
      }
      
      expect(listPropsWithAllOptions.collection).toBe('warner')
      expect(listPropsWithAllOptions.options?.itemsPerPage).toBe(20)
      expect(listPropsWithAllOptions.options?.sortBy).toBe('title')
      expect(listPropsWithAllOptions.className).toBe('list-wrapper')
    })
  })

  describe('Cross-Schema Type Compatibility', () => {
    it('should allow CollectionType to be used across schema and types', () => {
      // Test that CollectionType from @/types works with schema interfaces
      const collection: CollectionType = 'cheryl'
      
      const cardProps: UnifiedCardProps = {
        item: {
          id: 'test',
          type: 'article',
          category: 'articles',
          title: 'Test',
          url: '/test',
          status: 'published',
          featured: false,
          priority: 1
        },
        collection // This should work seamlessly
      }
      
      const listProps: UnifiedListProps = {
        items: [cardProps.item],
        collection // This should also work seamlessly
      }
      
      expect(cardProps.collection).toBe('cheryl')
      expect(listProps.collection).toBe('cheryl')
    })

    it('should maintain type safety across schemas', () => {
      // This test ensures TypeScript compilation passes with proper types
      const validTypes = ['article', 'interview', 'review', 'professional', 'publication', 'background'] as const
      const validCategories = ['articles', 'interviews', 'reviews', 'professional', 'publications', 'background'] as const
      const validCollections: CollectionType[] = ['cheryl', 'warner', 'global']
      
      validTypes.forEach((type, index) => {
        const item = {
          id: `item-${index}`,
          type,
          category: validCategories[index] || 'articles',
          title: `Test ${type}`,
          url: `/test-${type}`,
          status: 'published' as const,
          featured: false,
          priority: 1
        }
        
        validCollections.forEach(collection => {
          const cardProps: UnifiedCardProps = { item, collection }
          const listProps: UnifiedListProps = { items: [item], collection }
          
          expect(cardProps.item.type).toBe(type)
          expect(listProps.collection).toBe(collection)
        })
      })
    })
  })

  describe('Props Interface Consistency', () => {
    it('should maintain consistent prop interfaces across components', () => {
      // Test that all components using centralized props maintain consistency
      const mockItem = {
        id: 'consistency-test',
        type: 'article' as const,
        category: 'articles' as const,
        title: 'Consistency Test',
        url: '/consistency-test',
        status: 'published' as const,
        featured: false,
        priority: 1
      }
      
      // UnifiedCard props should be compatible with centralized types
      const cardProps: UnifiedCardProps = {
        item: mockItem,
        collection: 'cheryl',
        options: { layout: 'horizontal' }
      }
      
      // UnifiedList props should be compatible with centralized types
      const listProps: UnifiedListProps = {
        items: [mockItem],
        collection: 'cheryl',
        options: { layout: 'list' }
      }
      
      // Both should work with the same item and collection
      expect(cardProps.item.id).toBe(listProps.items[0].id)
      expect(cardProps.collection).toBe(listProps.collection)
    })
  })
})
