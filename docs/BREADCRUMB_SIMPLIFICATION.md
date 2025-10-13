# Breadcrumb & Type Field Simplification

## Overview
Simplified the breadcrumb generation system to reduce complexity and remove redundant configuration.

## What Changed

### 1. **Type Field is Now Optional for Breadcrumbs**
**Before:** The `type` field in frontmatter was required to determine the parent breadcrumb:
```yaml
type: professional  # Required to map to /warner parent
```

**After:** Collection is determined automatically from slug prefix:
- `w-*` slugs → Warner collection → "D. Warner North" parent
- `c-*` slugs → Cheryl collection → "Cheryl North" parent

**The `type` field is still useful for:**
- Content filtering (e.g., showing only publications)
- Card display logic (different metadata for different types)
- Search categorization
- But it's NO LONGER required for breadcrumb generation

### 2. **breadcrumbConfig is Now Optional**
**Before:** Required prop for UnifiedLayout:
```tsx
<UnifiedLayout 
  breadcrumbs={generateBreadcrumbsFromFrontmatter('w-management')}
  breadcrumbConfig={{
    parentLabel: "D. Warner North",
    parentPath: "/warner"
  }}
  // ... other props
/>
```

**After:** Auto-generated from slug, but can be customized when needed:
```tsx
// Simple pages - auto-generated breadcrumbs
<UnifiedLayout 
  frontmatter={content.frontmatter}
  content={content.content}
  slug="w-management"
  contentType="background"
  collection="warner"
/>

// Custom hierarchy pages - explicit breadcrumbConfig
<UnifiedLayout 
  frontmatter={content.frontmatter}
  content={content.content}
  slug="w-projects-nrc"
  contentType="projects"
  breadcrumbConfig={{
    parentLabel: "Projects",
    parentPath: "/projects"
  }}
  collection="warner"
/>
```

### 3. **No More Duplicate Breadcrumb Props**
**Before:** Pages had both `breadcrumbs` AND `breadcrumbConfig`:
```tsx
const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-management');

<UnifiedLayout 
  breadcrumbs={breadcrumbs}  // ← Overrides breadcrumbConfig!
  breadcrumbConfig={{ ... }}  // ← Never used!
/>
```

**After:** Choose ONE approach:
- Pass nothing → auto-generate from slug
- Pass `breadcrumbConfig` → custom hierarchy
- Pass `breadcrumbs` → fully custom breadcrumbs

## Migration Guide

### Simple Warner/Cheryl Pages
**Old Pattern:**
```tsx
import { generateBreadcrumbsFromFrontmatter } from '@/lib/breadcrumbUtils';

export default function MyPage() {
  const content = getContentBySlug('w-mypage', true);
  const breadcrumbs = generateBreadcrumbsFromFrontmatter('w-mypage');

  return (
    <UnifiedLayout 
      breadcrumbs={breadcrumbs}
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-mypage"
      contentType="background"
      breadcrumbConfig={{
        parentLabel: "D. Warner North",
        parentPath: "/warner"
      }}
      collection="warner"
    />
  );
}
```

**New Pattern:**
```tsx
// No imports needed for breadcrumbs!

export default function MyPage() {
  const content = getContentBySlug('w-mypage', true);

  return (
    <UnifiedLayout 
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-mypage"
      contentType="background"
      collection="warner"
    />
  );
}
```

### Custom Hierarchy Pages (Projects, etc.)
**Keep breadcrumbConfig for custom parent paths:**
```tsx
export default function ProjectsNRCPage() {
  const content = getContentBySlug('w-projects-nrc', true);

  return (
    <UnifiedLayout 
      frontmatter={content.frontmatter}
      content={content.content}
      slug="w-projects-nrc"
      contentType="projects"
      breadcrumbConfig={{
        parentLabel: "Projects",      // Custom parent
        parentPath: "/projects"
      }}
      collection="warner"
    />
  );
}
```

## Breadcrumb Generation Logic

### Auto-Generated (No breadcrumbConfig)
```
Home → [Collection Parent] → [Page Title]

Examples:
- w-background → Home → D. Warner North → Education & Awards
- c-interview-1 → Home → Cheryl North → Interview Title
```

### Custom Hierarchy (With breadcrumbConfig)
```
Home → [Custom Parent] → [Page Title]

Examples:
- w-projects-nrc → Home → D. Warner North → Projects → National Academies
- w-projects-government → Home → D. Warner North → Projects → Government Service
```

### With Grand Parent (Optional)
```
Home → [Grand Parent] → [Parent] → [Page Title]

Example breadcrumbConfig:
{
  grandParentLabel: "D. Warner North",
  grandParentPath: "/warner",
  parentLabel: "Projects",
  parentPath: "/projects"
}
```

## Benefits

1. **Less Boilerplate**: Most pages need 5-6 fewer lines of code
2. **No Duplicate Props**: Can't accidentally override breadcrumbConfig with breadcrumbs
3. **Type Field Independence**: `type` field is now purely for content classification, not navigation
4. **Clearer Intent**: breadcrumbConfig only used when you actually need custom hierarchy
5. **Automatic Collection Detection**: Slug prefix handles 90% of cases automatically

## Files Modified

- `src/lib/breadcrumbUtils.ts` - Uses slug prefix instead of type field
- `src/components/layouts/UnifiedLayout.tsx` - Made breadcrumbConfig optional, auto-generates breadcrumbs
- `src/app/management/page.tsx` - Example of simplified pattern

## Next Steps

Can optionally update other pages to use the simplified pattern:
- `src/app/background/page.tsx`
- `src/app/sra/page.tsx`
- Any other Warner/Cheryl pages that don't need custom hierarchy

Pages with custom hierarchy (projects-nrc, projects-government, etc.) can keep breadcrumbConfig as-is.
