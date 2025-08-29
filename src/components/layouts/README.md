# Layout Components

This directory contains the simplified layout system for the application.

## Components

### `UnifiedLayout.tsx` - Main Layout Component
**Primary layout component that handles both simple pages and detailed content pages.**

**Usage patterns:**

1. **Simple pages** (navigation pages, landing pages):
   ```tsx
   <UnifiedLayout breadcrumbs={breadcrumbs}>
     {children}
   </UnifiedLayout>
   ```

2. **Content detail pages** (articles, interviews, reviews):
   ```tsx
   <UnifiedLayout 
     frontmatter={frontmatter}
     content={content}
     slug={slug}
     contentType={contentType}
     breadcrumbConfig={breadcrumbConfig}
     collection={collection}
   />
   ```

**Features:**
- Automatic breadcrumb generation for content pages
- MDX content rendering with inline image support
- Tag and metadata display
- Responsive design
- Collection-specific styling

### `PageLayout.tsx` - Simple Page Layout
**Basic layout for simple pages that need minimal structure.**

**Usage:**
```tsx
<PageLayout breadcrumbs={breadcrumbs} className="custom-styles">
  {children}
</PageLayout>
```

**Features:**
- Breadcrumb support
- Simple container with padding
- Minimal structure

## Higher-Level Components

### `UnifiedContentPage.tsx` (in `/pages/`)
**Wrapper around UnifiedLayout for content pages that need:**
- Section-based rendering (long content lists)
- Back navigation links
- Content type-specific configuration

## Migration from Old System

**Removed components:**
- ❌ `ContentDetailLayout.tsx` - Functionality merged into `UnifiedLayout`

**Simplified structure:**
- ✅ One main layout component (`UnifiedLayout`) handles most use cases
- ✅ Simple layout (`PageLayout`) for basic pages
- ✅ Content wrapper (`UnifiedContentPage`) for complex content scenarios

## Best Practices

1. **Use `UnifiedLayout` directly** for most pages
2. **Use `PageLayout`** only for very simple pages that don't need content features
3. **Use `UnifiedContentPage`** when you need section-based rendering or back navigation
4. **Always provide breadcrumbs** for better navigation
5. **Use appropriate collection types** ("cheryl", "warner", "global") for proper styling

## Type Definitions

All layout components use types defined in `/src/types/index.ts`:
- `UnifiedLayoutProps`
- `PageLayoutProps`
- `BreadcrumbItem`
- `CollectionType`
