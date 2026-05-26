import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { createMockContentItem } from '@/test/utils'

// Import components that now use centralized props
import UnifiedCard from '@/components/ui/UnifiedCard'
import UnifiedList from '@/components/ui/UnifiedList'

describe('Existing Components with Centralized Props', () => {
  describe('UnifiedCard Backward Compatibility', () => {
    it('should still work with existing test patterns', () => {
      const mockItem = createMockContentItem({
        title: 'Backward Compatibility Test',
        summary: 'Testing that existing tests still work',
        type: 'article',
        category: 'articles'
      })

      // This should work the same as before centralization
      expect(() => render(<UnifiedCard item={mockItem} />)).not.toThrow()
    })

    it('should accept collection prop from centralized schema', () => {
      const mockItem = createMockContentItem({
        title: 'Collection Test',
        type: 'interview'
      })

      // Should accept collection prop from centralized types
      expect(() => render(
        <UnifiedCard 
          item={mockItem} 
          collection="cheryl"
        />
      )).not.toThrow()
    })
  })

  describe('UnifiedList Backward Compatibility', () => {
    it('should still work with existing test patterns', () => {
      const mockItems = [
        createMockContentItem({
          id: 'test-item-1',
          title: 'List Item 1',
          type: 'article'
        }),
        createMockContentItem({
          id: 'test-item-2',
          title: 'List Item 2', 
          type: 'interview'
        })
      ]

      // This should work the same as before centralization
      expect(() => render(<UnifiedList items={mockItems} />)).not.toThrow()
    })

    it('should accept collection prop from centralized schema', () => {
      const mockItems = [createMockContentItem()]

      // Should accept collection prop from centralized types
      expect(() => render(
        <UnifiedList 
          items={mockItems}
          collection="warner"
        />
      )).not.toThrow()
    })
  })

  describe('Type System Integration', () => {
    it('should maintain test utility compatibility', () => {
      // Test that our test utilities work with centralized types
      const mockItem = createMockContentItem({
        title: 'Type System Test',
        type: 'professional',
        category: 'professional'
      })

      // Should create items compatible with centralized interfaces
      expect(mockItem.title).toBe('Type System Test')
      expect(mockItem.type).toBe('professional')
      expect(mockItem.category).toBe('professional')
    })

    it('should work with different content types', () => {
      const contentTypes = ['article', 'interview', 'review', 'professional', 'publication', 'background'] as const
      
      contentTypes.forEach(type => {
        const mockItem = createMockContentItem({ type })
        
        // Each type should work with the components
        expect(() => render(<UnifiedCard item={mockItem} />)).not.toThrow()
      })
    })

    it('should work with all collection types', () => {
      const collections = ['cheryl', 'warner', 'global'] as const
      const mockItem = createMockContentItem()
      
      collections.forEach(collection => {
        // Each collection should work with the components
        expect(() => render(
          <UnifiedCard 
            item={mockItem} 
            collection={collection}
          />
        )).not.toThrow()
        
        expect(() => render(
          <UnifiedList 
            items={[mockItem]} 
            collection={collection}
          />
        )).not.toThrow()
      })
    })
  })

  describe('Props Interface Stability', () => {
    it('should maintain stable component APIs', () => {
      const mockItem = createMockContentItem()
      
      // Test that common prop patterns still work
      const cardVariations = [
        <UnifiedCard key="1" item={mockItem} />,
        <UnifiedCard key="2" item={mockItem} collection="cheryl" />,
        <UnifiedCard key="3" item={mockItem} options={{ layout: 'vertical' }} />,
        <UnifiedCard key="4" item={mockItem} className="custom-class" />,
        <UnifiedCard key="5" item={mockItem} onClick={() => {}} />
      ]
      
      cardVariations.forEach(component => {
        expect(() => render(component)).not.toThrow()
      })
    })

    it('should support options from centralized schema', () => {
      const mockItem = createMockContentItem()
      
      // Test options that come from centralized schema
      expect(() => render(
        <UnifiedCard 
          item={mockItem}
          options={{
            layout: 'horizontal',
            showImage: true,
            showDate: true,
            showCategory: true,
            imageVariant: 'thumbnail'
          }}
        />
      )).not.toThrow()
    })
  })

  describe('Error Handling with Centralized Types', () => {
    it('should handle missing optional props gracefully', () => {
      const minimalItem = createMockContentItem({
        title: 'Minimal Item'
      })
      
      // Should work with minimal props
      expect(() => render(<UnifiedCard item={minimalItem} />)).not.toThrow()
      expect(() => render(<UnifiedList items={[minimalItem]} />)).not.toThrow()
    })

    it('should handle undefined collection gracefully', () => {
      const mockItem = createMockContentItem()
      
      // Should work without collection prop
      expect(() => render(<UnifiedCard item={mockItem} />)).not.toThrow()
      expect(() => render(<UnifiedList items={[mockItem]} />)).not.toThrow()
    })
  })
})
