# Content Consolidation and Schema Normalization

This document outlines the consolidation of cards and lists into reusable components and the normalization of JSON data for w-* and c-* content.

## Overview

The consolidation effort addresses the following goals:

1. **Single Card Component**: Replace all existing card variants with one unified component
2. **Single List Component**: Replace all existing list variants with one unified component  
3. **Normalized Data Schema**: Standardize all content data structures
4. **Type Safety**: Ensure consistent TypeScript interfaces throughout
5. **Backwards Compatibility**: Maintain compatibility during transition

## Component Consolidation

### Before (Multiple Components)
- `ContentCard.tsx` - For c-* content display
- `SimpleNavigationCard.tsx` - For navigation and w-* content
- `FeatureCard.tsx` - For project displays
- `InfoCard.tsx` - For static content
- `UniversalListComponent.tsx` - Partial consolidation attempt
- `ContentList.tsx` - For content listings

### After (Unified Components)
- `UnifiedCard.tsx` - Single card component for ALL content types
- `UnifiedList.tsx` - Single list component for ALL content types

## Schema Normalization

### New Unified Schema (`src/schemas/unified-content-schema.ts`)

The unified schema provides a consistent structure for all content types:

```typescript
interface UnifiedContentItem {
  // Universal identifiers
  id: string;
  slug?: string;
  
  // Content classification
  type: ContentType;
  category: ContentCategory;
  
  // Core content
  title: string;
  summary?: string;
  url?: string;
  
  // Enhanced attributes (optional based on content type)
  publication?: PublicationInfo;
  subject?: SubjectInfo;
  media?: MediaAsset[];
  professional?: ProfessionalInfo;
  performance?: PerformanceInfo;
  interview?: InterviewInfo;
  
  // Categorization
  tags?: string[];
  
  // Status and metadata
  status: ContentStatus;
  publishedDate?: string;
  lastModified?: string;
}
```

### Content Types Supported

- **Interviews** (`c-*`): Classical music interviews with artists, conductors, etc.
- **Articles** (`c-*`): Feature articles and journalistic pieces
- **Reviews** (`c-*`): Performance and recording reviews
- **Professional** (`w-*`): Career and consulting work
- **Publications** (`w-*`): Academic papers and publications
- **Background** (`w-*`): Educational and professional background
- **Projects** (`w-*`): Professional projects and affiliations
- **Bio** (`w-*`): Biographical information
- **Company** (`w-*`): Company and organizational information

## Data Migration

### Migration Utility (`data-normalization-utility.py`)

The Python utility normalizes existing JSON files to the new schema:

```bash
# Run the migration utility
python data-normalization-utility.py --source-dir src/data --output-dir src/data/normalized

# Options:
--source-dir      # Source directory (default: src/data)
--output-dir      # Output directory (default: src/data/normalized)
--no-backup       # Skip creating backup files
--no-validation   # Skip output validation
--verbose         # Verbose output
```

### Migration Process

1. **Read existing JSON files** (cheryl-*, warner-*)
2. **Map fields to unified schema** 
3. **Standardize media references**
4. **Generate consistent metadata**
5. **Create normalized output files**
6. **Validate data integrity**
7. **Provide migration statistics**

### Field Mapping

| Original Field | Normalized Field | Notes |
|---------------|------------------|-------|
| `metadata.id` | `id` | Direct mapping |
| `content.title` | `title` | Direct mapping |
| `content.summary` | `summary` | Cleaned and truncated |
| `publication.date` | `publishedDate` | Date normalization |
| `media.images[]` | `media[]` | Enhanced with variants/usage |
| `tags[]` | `tags[]` | Direct mapping |
| `subject.people[]` | `subject.people[]` | Enhanced with roles |

## Component Usage

### UnifiedCard Usage

```tsx
import UnifiedCard from '@/components/ui/UnifiedCard';

// Basic usage
<UnifiedCard item={contentItem} />

// With custom options
<UnifiedCard 
  item={contentItem}
  options={{
    layout: 'horizontal',
    size: 'medium',
    showTags: true,
    showImage: true,
    variant: 'featured'
  }}
  onClick={(item) => console.log('Clicked:', item)}
/>
```

### UnifiedList Usage

```tsx
import UnifiedList from '@/components/ui/UnifiedList';

// Basic usage
<UnifiedList items={contentItems} />

// With advanced options
<UnifiedList 
  items={contentItems}
  options={{
    layout: 'grid',
    columns: 3,
    searchable: true,
    filterable: true,
    pagination: true,
    itemsPerPage: 12,
    sortBy: 'date',
    cardOptions: {
      size: 'medium',
      showTags: true
    }
  }}
  onItemClick={(item) => router.push(item.url)}
/>
```

## Card Layout Options

### Layout Types
- **`horizontal`**: Image on left, content on right (default)
- **`vertical`**: Image on top, content below
- **`minimal`**: Compact layout with small image
- **`detailed`**: Extended layout with additional information

### Size Options
- **`small`**: Compact cards for dense layouts
- **`medium`**: Standard size for most use cases (default)
- **`large`**: Larger cards for featured content
- **`xl`**: Extra large for hero sections

### Variants
- **`default`**: Standard card styling
- **`minimal`**: Reduced shadows and padding
- **`featured`**: Enhanced styling with borders
- **`compact`**: Dense layout for lists

## List Layout Options

### Layout Types
- **`list`**: Vertical stack (default)
- **`grid`**: Responsive grid layout
- **`masonry`**: Pinterest-style masonry layout
- **`carousel`**: Horizontal scrolling carousel

### Features
- **Search**: Built-in search functionality
- **Filtering**: Filter by type, category, tags, dates
- **Sorting**: Multiple sort options (date, title, relevance, category)
- **Pagination**: Built-in pagination with page controls
- **Grouping**: Group items by type, category, date, or author
- **Selection**: Multi-select functionality for bulk operations

## Migration Strategy

### Phase 1: Schema and Components ✅
1. Create unified schema (`unified-content-schema.ts`)
2. Create unified card component (`UnifiedCard.tsx`)
3. Create unified list component (`UnifiedList.tsx`)
4. Create migration utility (`data-normalization-utility.py`)

### Phase 2: Data Migration
1. Run migration utility on existing JSON files
2. Validate normalized data
3. Update data loading utilities
4. Create data validation scripts

### Phase 3: Component Migration
1. Update existing pages to use unified components
2. Replace old card components with UnifiedCard
3. Replace old list components with UnifiedList
4. Update imports and prop interfaces

### Phase 4: Cleanup
1. Remove deprecated components
2. Update documentation
3. Performance optimization
4. Final testing and validation

## Benefits

### Developer Experience
- **Single Source of Truth**: One component handles all card use cases
- **Type Safety**: Comprehensive TypeScript interfaces
- **Consistency**: Uniform styling and behavior across the app
- **Maintainability**: Changes to one component affect entire app

### User Experience
- **Performance**: Optimized rendering and loading
- **Consistency**: Uniform interaction patterns
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Responsive**: Adaptive layouts for all screen sizes

### Content Management
- **Flexible**: Handles diverse content types with common interface
- **Extensible**: Easy to add new content types and fields
- **Searchable**: Built-in search and filtering capabilities
- **Organized**: Consistent categorization and tagging

## Testing Strategy

### Unit Tests
- Component rendering with various props
- Data transformation and normalization
- Search and filtering functionality
- Pagination and sorting logic

### Integration Tests  
- Full workflow from data loading to display
- Migration utility validation
- Cross-component compatibility
- Performance benchmarks

### Visual Regression Tests
- Card layouts across different content types
- List layouts and responsive behavior
- Styling consistency across variants
- Accessibility compliance

## Performance Considerations

### Optimization Techniques
- **Lazy Loading**: Images and content loaded on demand
- **Virtualization**: Large lists rendered efficiently
- **Memoization**: React.memo and useMemo for expensive operations
- **Code Splitting**: Components loaded as needed

### Bundle Size Impact
- Unified components reduce overall bundle size
- Tree-shaking eliminates unused component variants
- Shared utilities and styles reduce duplication

## Future Enhancements

### Planned Features
- **Advanced Filtering**: Faceted search with multiple filters
- **Infinite Scroll**: Alternative to pagination for large lists
- **Drag and Drop**: Reordering and organization capabilities
- **Export Functions**: PDF, CSV, and other format exports

### Extensibility
- **Plugin System**: Custom renderers for specific content types
- **Theme Support**: Multiple design themes and dark mode
- **Animation System**: Smooth transitions and micro-interactions
- **Analytics Integration**: Usage tracking and performance metrics

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check source file format and structure
   - Validate required fields are present
   - Review migration logs for specific errors

2. **Component Rendering Issues**
   - Verify data structure matches schema
   - Check for missing required props
   - Validate media asset URLs

3. **Performance Problems**
   - Enable lazy loading for large lists
   - Use pagination for datasets over 100 items
   - Optimize image sizes and formats

### Debug Mode
Enable verbose logging during development:

```tsx
<UnifiedList 
  items={items}
  options={{ debug: true }}
/>
```

## Support and Documentation

- **Schema Reference**: See `src/schemas/unified-content-schema.ts`
- **Component Props**: TypeScript interfaces provide inline documentation
- **Migration Logs**: Check `src/data/normalized/migration-report.json`
- **Test Coverage**: See test files for usage examples

---

*This consolidation effort significantly improves the maintainability, consistency, and performance of the NorthWorks content display system while providing a foundation for future enhancements.*
