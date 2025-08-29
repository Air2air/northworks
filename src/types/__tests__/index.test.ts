import { describe, it, expect } from 'vitest'
import type {
  CollectionType,
  BreadcrumbItem,
  LazyImageProps,
  CardImageProps,
  ContentDetailLayoutProps,
  UnifiedContentPageProps,
  ContentListingPageProps,
  ContentDetailPageProps,
  SectionCardProps,
  SectionGridProps,
  TagsProps,
  PublicationInfoProps,
  SearchFilters,
  SearchOptions,
  SearchResult,
  NavigationItem,
  PaginationProps,
  UnifiedLayoutProps
} from '@/types'

import {
  COLLECTIONS,
  getCollectionFromSlug,
  getCollectionFromCategory,
  isValidCollection,
  getCollectionConfig,
  getSearchUrlForCollection
} from '@/types'

describe('Centralized Types', () => {
  describe('CollectionType and Collection System', () => {
    it('should define valid collection types', () => {
      const collections: CollectionType[] = ['cheryl', 'warner', 'global']
      
      collections.forEach(collection => {
        expect(isValidCollection(collection)).toBe(true)
      })
      
      expect(isValidCollection('invalid' as CollectionType)).toBe(false)
    })

    it('should provide collection configurations', () => {
      expect(COLLECTIONS.cheryl).toEqual({
        id: 'cheryl',
        name: 'cheryl',
        displayName: 'Cheryl North',
        description: 'Classical music journalism, interviews, articles, and reviews',
        basePath: '/cheryl',
        contentPrefix: 'c-'
      })

      expect(COLLECTIONS.warner).toEqual({
        id: 'warner',
        name: 'warner',
        displayName: 'D. Warner North',
        description: 'Risk analysis, professional work, publications, and background',
        basePath: '/warner',
        contentPrefix: 'w-'
      })
    })

    it('should correctly identify collection from slug', () => {
      expect(getCollectionFromSlug('c-interview-conductor')).toBe('cheryl')
      expect(getCollectionFromSlug('w-professional-work')).toBe('warner')
      expect(getCollectionFromSlug('general-content')).toBe('global')
    })

    it('should correctly identify collection from category', () => {
      expect(getCollectionFromCategory('interviews')).toBe('cheryl')
      expect(getCollectionFromCategory('reviews')).toBe('cheryl')
      expect(getCollectionFromCategory('articles')).toBe('cheryl')
      
      expect(getCollectionFromCategory('professional')).toBe('warner')
      expect(getCollectionFromCategory('publications')).toBe('warner')
      expect(getCollectionFromCategory('background')).toBe('warner')
      
      expect(getCollectionFromCategory('unknown')).toBe('global')
    })

    it('should generate correct search URLs', () => {
      expect(getSearchUrlForCollection('global')).toBe('/search')
      expect(getSearchUrlForCollection('cheryl')).toBe('/search?collection=cheryl')
      expect(getSearchUrlForCollection('warner')).toBe('/search?collection=warner')
      expect(getSearchUrlForCollection('cheryl', 'test query')).toBe('/search?collection=cheryl&q=test+query')
    })
  })

  describe('Component Prop Interfaces', () => {
    it('should define BreadcrumbItem interface correctly', () => {
      const breadcrumb: BreadcrumbItem = {
        label: 'Home',
        href: '/',
        active: false
      }
      
      expect(breadcrumb.label).toBe('Home')
      expect(breadcrumb.href).toBe('/')
      expect(breadcrumb.active).toBe(false)
    })

    it('should define LazyImageProps interface correctly', () => {
      const imageProps: LazyImageProps = {
        src: '/test-image.jpg',
        alt: 'Test image',
        width: 400,
        height: 300,
        className: 'test-class',
        priority: true
      }
      
      expect(imageProps.src).toBe('/test-image.jpg')
      expect(imageProps.alt).toBe('Test image')
      expect(imageProps.priority).toBe(true)
    })

    it('should define TagsProps interface correctly', () => {
      const tagsProps: TagsProps = {
        tags: ['music', 'classical'],
        variant: 'medium',
        className: 'tags-container',
        collection: 'cheryl'
      }
      
      expect(tagsProps.tags).toEqual(['music', 'classical'])
      expect(tagsProps.variant).toBe('medium')
      expect(tagsProps.collection).toBe('cheryl')
    })

    it('should define SectionCardProps interface correctly', () => {
      const sectionProps: SectionCardProps = {
        title: 'Section Title',
        content: 'Section content',
        index: 1,
        className: 'section-card'
      }
      
      expect(sectionProps.title).toBe('Section Title')
      expect(sectionProps.content).toBe('Section content')
      expect(sectionProps.index).toBe(1)
    })

    it('should define SectionGridProps interface correctly', () => {
      const gridProps: SectionGridProps = {
        content: 'Grid content',
        frontmatter: { title: 'Test' },
        className: 'grid-container'
      }
      
      expect(gridProps.content).toBe('Grid content')
      expect(gridProps.frontmatter.title).toBe('Test')
    })

    it('should define PaginationProps interface correctly', () => {
      const paginationProps: PaginationProps = {
        currentPage: 1,
        totalPages: 10,
        onPageChange: (page: number) => console.log(page),
        maxVisiblePages: 5,
        className: 'pagination'
      }
      
      expect(paginationProps.currentPage).toBe(1)
      expect(paginationProps.totalPages).toBe(10)
      expect(paginationProps.maxVisiblePages).toBe(5)
    })
  })

  describe('Layout Component Interfaces', () => {
    it('should define ContentDetailLayoutProps interface correctly', () => {
      const layoutProps: ContentDetailLayoutProps = {
        frontmatter: { title: 'Test Article' },
        content: 'Article content',
        slug: 'test-article',
        contentType: 'article',
        breadcrumbConfig: {
          parentPath: '/articles',
          parentLabel: 'Articles',
          grandParentPath: '/cheryl',
          grandParentLabel: 'Cheryl North'
        },
        collection: 'cheryl'
      }
      
      expect(layoutProps.slug).toBe('test-article')
      expect(layoutProps.contentType).toBe('article')
      expect(layoutProps.breadcrumbConfig.parentPath).toBe('/articles')
      expect(layoutProps.collection).toBe('cheryl')
    })

    it('should define UnifiedLayoutProps interface correctly', () => {
      const layoutProps: UnifiedLayoutProps = {
        children: null,
        breadcrumbs: [{ label: 'Home', href: '/', active: false }],
        className: 'layout-container',
        frontmatter: { title: 'Test' },
        content: 'Content',
        slug: 'test-slug',
        contentType: 'article',
        collection: 'cheryl'
      }
      
      expect(layoutProps.className).toBe('layout-container')
      expect(layoutProps.breadcrumbs).toHaveLength(1)
      expect(layoutProps.contentType).toBe('article')
    })
  })

  describe('Search and Filter Interfaces', () => {
    it('should define SearchFilters interface correctly', () => {
      const filters: SearchFilters = {
        types: ['article', 'interview'],
        categories: ['articles', 'interviews'],
        tags: ['music', 'classical'],
        dateRange: {
          start: '2024-01-01',
          end: '2024-12-31'
        },
        authors: ['John Doe'],
        publishers: ['Music Magazine'],
        venues: ['Concert Hall'],
        instruments: ['violin'],
        composers: ['Bach'],
        status: ['published']
      }
      
      expect(filters.types).toEqual(['article', 'interview'])
      expect(filters.dateRange?.start).toBe('2024-01-01')
      expect(filters.authors).toEqual(['John Doe'])
    })

    it('should define SearchOptions interface correctly', () => {
      const options: SearchOptions = {
        query: 'test search',
        filters: {
          types: ['article']
        },
        sort: {
          field: 'publishedDate',
          order: 'desc'
        },
        limit: 20,
        offset: 0
      }
      
      expect(options.query).toBe('test search')
      expect(options.sort?.field).toBe('publishedDate')
      expect(options.limit).toBe(20)
    })
  })

  describe('Navigation and UI Interfaces', () => {
    it('should define NavigationItem interface correctly', () => {
      const navItem: NavigationItem = {
        label: 'Articles',
        href: '/articles',
        active: true
      }
      
      expect(navItem.label).toBe('Articles')
      expect(navItem.href).toBe('/articles')
      expect(navItem.active).toBe(true)
    })

    it('should define PublicationInfoProps interface correctly', () => {
      const pubInfo: PublicationInfoProps = {
        date: '2024-01-15',
        publication: 'Music Journal',
        section: 'Reviews',
        author: 'Jane Smith',
        title: 'Concert Review',
        className: 'publication-info'
      }
      
      expect(pubInfo.date).toBe('2024-01-15')
      expect(pubInfo.publication).toBe('Music Journal')
      expect(pubInfo.author).toBe('Jane Smith')
    })
  })
})
