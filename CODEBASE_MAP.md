# Northworks Codebase Map for AI Assistants

> **Purpose**: This document helps AI assistants quickly understand the codebase structure, locate relevant files, and avoid common pitfalls.

## 📋 Recent Changes

**October 2025**:
- **Image Height Increases**: Card thumbnail images increased for better visual impact
  - **UnifiedCard** (content pages): Mobile 160px → 208px (h-40 → h-52), Small 192px → 240px (sm:h-48 → sm:h-60)
  - **LandingCard** (homepage): Mobile 192px → 256px (h-48 → h-64), Small 288px (sm:h-72), Desktop 320px (md:h-80)
  - Location: `src/components/ui/UnifiedCard.tsx` and `LandingCard.tsx` `getImageClasses()` functions
- **Dead Code Removal**: Removed 7 unused files (4 components, 3 libraries)
  - See `docs/DEAD_CODE_REMOVAL_REPORT.md` for details

---

## 🎯 Quick Reference for AI Assistants

### CRITICAL: Read These First
1. This file (CODEBASE_MAP.md) - Overall structure
2. `AI_ASSISTANT_GUIDE.md` - How to work with this codebase
3. `src/types/index.ts` - Single source of truth for types
4. `src/schemas/unified-content-schema.ts` - Content data model

### When User Asks About...
- **Types/Interfaces** → `src/types/index.ts`
- **Content Data** → `src/schemas/unified-content-schema.ts`
- **Loading Content** → `src/lib/unified-data.ts`
- **Displaying Content** → `src/components/ui/UnifiedCard.tsx`, `UnifiedList.tsx`
- **Page Layouts** → `src/components/layouts/UnifiedLayout.tsx`
- **Styling** → `src/lib/styleUtils.ts`
- **Images** → `src/components/ui/OptimizedImage.tsx`
- **Search** → `src/app/search/page.tsx`, `src/lib/search.ts`

---

## 📁 Project Structure

```
northworks/
├── 📄 Configuration Files (Root)
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── tailwind.config.js        # Styling configuration
│   └── vitest.config.ts          # Testing configuration
│
├── 📚 Documentation (Root & /docs)
│   ├── CODEBASE_MAP.md           # THIS FILE - Start here!
│   ├── AI_ASSISTANT_GUIDE.md     # Guidelines for AI assistants
│   ├── README.md                 # Project overview
│   ├── docs/
│   │   ├── TYPE_SYSTEM_ANALYSIS.md
│   │   └── CODEBASE_CLEANUP_REPORT.md
│   └── FIELD_NORMALIZATION.md
│
├── 🎨 Source Code (/src)
│   ├── app/                      # Next.js 15 App Router pages
│   ├── components/               # React components
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript type definitions
│   ├── schemas/                  # Data schemas
│   └── test/                     # Test setup
│
├── 📦 Public Assets (/public)
│   ├── content/                  # Markdown content files (~200 files)
│   ├── data/                     # JSON data files
│   └── images/                   # Image assets (15MB)
│
└── 🔧 Scripts (/scripts)
    ├── image-manager.js          # Image management
    ├── populate-images.js        # Image population
    └── detailed-image-sync.js    # Image sync utility
```

---

## 🗂️ Directory Deep Dive

### `/src/app` - Next.js App Router (Pages)

**Structure**: Next.js 15 App Router with file-based routing

```
src/app/
├── layout.tsx                    # Root layout (wraps all pages)
├── page.tsx                      # Homepage (/)
├── globals.css                   # Global styles
│
├── [Collections] - Main content sections
├── cheryl/
│   ├── page.tsx                  # Cheryl North landing page
│   ├── interviews/page.tsx       # Interviews listing
│   ├── articles/page.tsx         # Articles listing
│   └── reviews/page.tsx          # Reviews listing
├── warner/
│   └── page.tsx                  # D. Warner North landing page
│
├── [Content Type Pages]
├── interviews/page.tsx           # All interviews
├── articles/page.tsx             # All articles
├── reviews/page.tsx              # All reviews
│
├── [Static Pages]
├── professional/
│   ├── page.tsx                  # Main professional page
│   └── [slug]/page.tsx           # Dynamic professional sub-pages
├── publications/
│   ├── page.tsx                  # Main publications page
│   └── [slug]/page.tsx           # Dynamic publication pages
├── background/
│   ├── page.tsx                  # Main background page
│   └── [slug]/page.tsx           # Dynamic background pages
├── northworks/page.tsx           # Company page
└── c-about/page.tsx              # About Cheryl page
│
├── [Dynamic Content Route]
└── [...slug]/page.tsx            # Catches ALL content pages
                                  # This is the main content renderer!
```

**Key Points for AI:**
- `[...slug]/page.tsx` handles ALL dynamic content (interviews, articles, reviews, etc.)
- Static pages (`/professional`, `/background`, etc.) have dedicated routes
- Each page imports from `@/lib/unified-data` for content loading

---

### `/src/components` - React Components

**Organization**: Grouped by function and hierarchy

```
src/components/
├── [Top-Level Utilities]
├── Breadcrumbs.tsx               # Navigation breadcrumbs
├── ImageGallery.tsx              # Multi-image display
├── Navigation.tsx                # Main navigation component
└── SearchInterface.tsx           # Search UI component
│
├── layouts/                      # Page layout components
│   └── UnifiedLayout.tsx         # ⭐ MAIN LAYOUT - Used by all pages
│
├── pages/                        # Page-level components
│   ├── ContentDetailPage.tsx    # Detail view for content items
│   ├── ContentListingPage.tsx   # List view for content items
│   └── UnifiedContentPage.tsx   # Universal content page wrapper
│
└── ui/                           # Reusable UI components
    ├── [Content Display]
    ├── UnifiedCard.tsx           # ⭐ Card for any content type
    ├── UnifiedList.tsx           # ⭐ List for any content type
    ├── UnifiedContentDisplay.tsx # Content body renderer
    └── UnifiedMetadata.tsx       # Metadata display (date, author, etc.)
    │
    ├── [Images]
    ├── OptimizedImage.tsx        # ⭐ Image wrapper (use this, not <img>)
    └── CardImage.tsx             # Image for cards (with responsive sizing)
    │
    ├── [Content Sections]
    ├── SectionCard.tsx           # Section display card
    ├── SectionGrid.tsx           # Section grid layout
    └── SectionSearchInterface.tsx # Section search
    │
    ├── [Navigation & UI]
    ├── PageTitle.tsx             # Page title component
    ├── Tags.tsx                  # Tag display/links
    ├── PublicationInfo.tsx       # Publication metadata
    ├── Pagination.tsx            # Pagination controls
    │
    └── [Landing Page]
        ├── LandingCard.tsx       # Landing page cards (larger images than UnifiedCard)
        └── TwoColumnGrid.tsx     # Two-column layout
```

**⭐ Key Components (Most Used):**
1. `UnifiedLayout.tsx` - Wraps all pages, provides consistent layout
2. `UnifiedCard.tsx` - Display any content type as a card
3. `UnifiedList.tsx` - Display any content type as a list
4. `OptimizedImage.tsx` - Always use this for images (never raw `<img>`)

---

### `/src/lib` - Utility Functions

**Organization**: Single-purpose utility files

```
src/lib/
├── [Content Loading] ⭐ Most Important
├── unified-data.ts               # ⭐⭐⭐ Main content loader
│   Functions:
│   - getAllContent()             # Get all content items
│   - getContentByType()          # Filter by type
│   - getContentByCategory()      # Filter by category
│   - getLandingPageNavigation()  # Get landing page data
│
├── content.ts                    # Legacy content loader
│   Functions:
│   - getContentBySlug()          # Load single content by slug
│   - getAllContentSlugs()        # Get all slugs for SSG
│
├── markdownLoader.ts             # Low-level markdown parsing
│
├── [Data Processing]
├── content-processing.ts         # Content analysis utilities
├── fieldNormalization.ts         # Field standardization
├── sectionParser.ts              # Parse content into sections
│
├── [Search & Navigation]
├── search.ts                     # ⭐ Search functionality
├── unifiedSearch.ts              # Advanced search
├── linkResolver.ts               # Internal link resolution
├── pathUtils.ts                  # URL/path utilities
├── breadcrumbUtils.ts            # Breadcrumb generation
│
├── [Presentation]
├── page-templates.ts             # Page template utilities
├── styleUtils.ts                 # CSS class helpers
├── metadataUtils.ts              # Metadata generation
│
└── [Utilities]
    └── dateUtils.ts              # Date formatting/parsing
```

**⭐ Most Important Files:**
1. **`unified-data.ts`** - Start here for ANY content loading
2. **`content.ts`** - Use for single-page loading
3. **`search.ts`** - Use for search functionality

---

### `/src/types` - TypeScript Definitions

**⭐ CRITICAL: SINGLE SOURCE OF TRUTH FOR TYPES**

```
src/types/
├── index.ts                      # ⭐⭐⭐ MAIN TYPE FILE
│   Exports:
│   - All content types (re-exported from schemas)
│   - All component prop interfaces
│   - Collection system types
│   - Utility types
│
└── image-types.ts                # Image-specific types
```

**⚠️ IMPORTANT FOR AI:**
- **ALWAYS import types from `@/types`** (never from individual files)
- **NEVER create duplicate type definitions**
- **Check `types/index.ts` first** before defining new types

---

### `/src/schemas` - Data Models

```
src/schemas/
└── unified-content-schema.ts     # ⭐⭐⭐ Content data model
    Main Exports:
    - UnifiedContentItem          # Base content structure
    - ContentType                 # 'article' | 'interview' | etc.
    - MediaAsset                  # Image/media structure
    - PublicationInfo             # Publication metadata
    - SubjectInfo                 # Subject/topic information
```

**Key Concept**: All content (interviews, articles, reviews, etc.) uses `UnifiedContentItem`

---

## 🎯 Common Tasks & File Locations

### Task: Add a new page route
1. Create file in `/src/app/[route]/page.tsx`
2. Import data from `@/lib/unified-data`
3. Use `UnifiedLayout` for consistent layout
4. Example: See `/src/app/articles/page.tsx`

### Task: Display content items
1. Use `UnifiedList` component from `@/components/ui/UnifiedList`
2. Pass array of `UnifiedContentItem[]`
3. Configure display with `ListDisplayOptions`
4. Example: See `/src/components/pages/ContentListingPage.tsx`

### Task: Modify content type definitions
1. **ONLY edit**: `src/schemas/unified-content-schema.ts`
2. Types auto-exported through `src/types/index.ts`
3. Run tests: `npm test`

### Task: Add new component
1. Create in appropriate subfolder:
   - UI component → `src/components/ui/`
   - Layout → `src/components/layouts/`
   - Page-level → `src/components/pages/`
2. Add TypeScript props interface
3. Add test file in `__tests__/` subfolder
4. Export from component file (default export)

### Task: Load content by slug
```typescript
import { getContentBySlug } from '@/lib/content';

const content = getContentBySlug('article-slug', true); // true = process HTML
```

### Task: Get all content of a type
```typescript
import { getContentByType } from '@/lib/unified-data';

const articles = getContentByType('article');
```

### Task: Add search functionality
```typescript
import { performSearch } from '@/lib/search';

const results = performSearch(query, allContent, {
  collection: 'cheryl', // or 'warner' or 'global'
  limit: 20
});
```

---

## 🔥 Common Pitfalls (AVOID THESE!)

### ❌ DON'T: Import types from multiple sources
```typescript
// ❌ WRONG
import { ContentType } from '@/schemas/unified-content-schema';
import { BreadcrumbItem } from '@/components/Breadcrumbs';

// ✅ CORRECT
import { ContentType, BreadcrumbItem } from '@/types';
```

### ❌ DON'T: Use raw HTML img tags
```typescript
// ❌ WRONG
<img src="/images/photo.jpg" alt="Photo" />

// ✅ CORRECT
import OptimizedImage from '@/components/ui/OptimizedImage';
<OptimizedImage src="/images/photo.jpg" alt="Photo" width={300} height={200} />
```

### ❌ DON'T: Create new layout components
```typescript
// ❌ WRONG - Creating new layout
export default function MyCustomLayout() { ... }

// ✅ CORRECT - Use UnifiedLayout
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
```

### ❌ DON'T: Duplicate content loading logic
```typescript
// ❌ WRONG - Loading content manually
const content = fs.readFileSync(...);
const parsed = matter(content);

// ✅ CORRECT - Use existing utilities
import { getContentBySlug } from '@/lib/content';
const content = getContentBySlug(slug, true);
```

### ❌ DON'T: Hardcode collection logic
```typescript
// ❌ WRONG
if (slug.startsWith('c-')) { collection = 'cheryl'; }

// ✅ CORRECT
import { getCollectionFromSlug } from '@/types';
const collection = getCollectionFromSlug(slug);
```

---

## 📊 Data Flow

### Content Loading Flow
```
1. User visits page
   ↓
2. Page component loads
   ↓
3. Page calls unified-data.ts or content.ts
   ↓
4. Utility reads from /public/content/*.md
   ↓
5. Markdown parsed with gray-matter
   ↓
6. HTML generated with marked
   ↓
7. Data normalized to UnifiedContentItem
   ↓
8. Returned to page component
   ↓
9. Passed to UnifiedLayout or UnifiedList
   ↓
10. Rendered with UnifiedCard or UnifiedContentDisplay
```

### Type Safety Flow
```
1. Types defined in schemas/unified-content-schema.ts
   ↓
2. Re-exported through types/index.ts
   ↓
3. Imported in components with @/types
   ↓
4. TypeScript validates at compile time
   ↓
5. Tests validate at test time
```

---

## 🧪 Testing Structure

```
src/
├── components/
│   └── __tests__/               # Component tests
├── lib/
│   └── __tests__/               # Utility function tests
├── types/
│   └── __tests__/               # Type integration tests
└── schemas/
    └── __tests__/               # Schema validation tests
```

**Running Tests:**
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

---

## 🎨 Styling Approach

- **Framework**: Tailwind CSS v4
- **Typography**: `@tailwindcss/typography` for content
- **Utilities**: `src/lib/styleUtils.ts` for class generation
- **Global**: `src/app/globals.css`

**Style Patterns:**
- Use Tailwind classes inline
- Use `styleUtils.ts` for dynamic classes
- Avoid custom CSS files (except globals.css)

---

## 🔍 Search & Filtering

**Main Search**: `/src/app/search/page.tsx`
- Searches across all content
- Filters by collection (cheryl/warner)
- Full-text search in title, summary, tags

**Implementation**: `/src/lib/search.ts`
- `performSearch()` - Main search function
- Supports fuzzy matching
- Returns scored results

---

## 📝 Content Organization

### Collections
- **Cheryl North** (prefix: `c-`) - Interviews, articles, reviews
- **D. Warner North** (prefix: `w-`) - Professional, publications, background

### Content Types
- `interview` - Q&A format content
- `article` - Editorial/opinion pieces
- `review` - Performance reviews
- `professional` - Professional work
- `publication` - Academic publications
- `background` - Biographical info

### File Naming
- Content files: `/public/content/[prefix]-[slug].md`
- Example: `c-interview-pianist.md`, `w-professional-nrc.md`

---

## 🚀 Build & Deploy

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Testing
npm test                # Run tests
npm run lint            # Check code quality

# Production
npm run build           # Build for production
npm start              # Start production server

# Image Management
npm run images:verify   # Verify image references
npm run images:analyze  # Analyze image usage
```

---

## 📚 Key Patterns

### 1. The Unified Pattern
**Concept**: One component handles all content types

```typescript
// Instead of: ArticleCard, InterviewCard, ReviewCard
// We have: UnifiedCard (handles all)

<UnifiedCard item={contentItem} options={displayOptions} />
```

### 2. The Collection Pattern
**Concept**: Content belongs to collections

```typescript
import { CollectionType } from '@/types';

const collection: CollectionType = 'cheryl' | 'warner' | 'global';
```

### 3. The Slug Pattern
**Concept**: File slugs determine routing

```
File: c-interview-pianist.md
Route: /interviews/c-interview-pianist
Collection: cheryl (prefix: c-)
Type: interview (from frontmatter)
```

---

## 🎯 Decision Log (Why things are this way)

### Why UnifiedLayout instead of multiple layouts?
- **DRY principle**: Don't repeat layout code
- **Consistency**: All pages look similar
- **Flexibility**: Props control behavior
- **Maintainability**: One place to update

### Why unified-data.ts separate from content.ts?
- **unified-data.ts**: Loads ALL content, collections
- **content.ts**: Loads SINGLE content by slug
- Different use cases, different caching strategies

### Why types in separate directory?
- **Centralization**: Single import point (`@/types`)
- **No circular dependencies**: Types imported by everything
- **Type safety**: TypeScript can validate across files

### Why schemas separate from types?
- **Schemas**: Define data structure (source of truth)
- **Types**: Re-export + add UI-specific types
- **Separation of concerns**: Data model vs. UI model

---

## 🆘 Debugging Guide

### Content not showing on page?
1. Check if file exists in `/public/content/`
2. Check slug matches filename (without extension)
3. Check frontmatter has required fields (id, title, type)
4. Run dev server and check console for errors
5. Verify `getContentBySlug()` returns data

### TypeScript errors about missing types?
1. Import from `@/types` (not individual files)
2. Check if type exists in `types/index.ts`
3. Run `npm run build` to check all type errors
4. Check `schemas/unified-content-schema.ts` for definition

### Images not loading?
1. Check file exists in `/public/images/`
2. Use `OptimizedImage` component (not `<img>`)
3. Provide width and height props
4. Run `npm run images:verify` to check references

### Tests failing?
1. Run `npm test` to see which tests fail
2. Check recent changes to components/utilities
3. Update test snapshots if needed (manually verify first)
4. Check mock data in test files

---

## 📞 Getting Help

### For AI Assistants:
1. Read this file completely before making changes
2. Check `AI_ASSISTANT_GUIDE.md` for specific instructions
3. When unsure, search codebase with grep:
   ```bash
   grep -r "pattern" src/
   ```
4. Look for similar implementations before creating new ones

### For Developers:
1. Check documentation in `/docs` folder
2. Look at existing components for patterns
3. Run tests frequently
4. Use TypeScript - it will catch errors early

---

## 📈 Metrics & Health

- **Total Files**: ~432 files
- **Test Coverage**: 308 tests, 100% passing
- **Content Files**: ~200 markdown files
- **Components**: 29 React components
- **Utilities**: 15 utility modules
- **Build Time**: ~30 seconds
- **Bundle Size**: Optimized for production

---

## 🗺️ Visual Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js App Router                │
│              (src/app/)                     │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│         UnifiedLayout Component             │
│       (src/components/layouts/)             │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│    Content Loading (unified-data.ts)        │
│          + content.ts                       │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│  Display Components (UnifiedCard/List)      │
│       (src/components/ui/)                  │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│     Type System (types/index.ts)            │
│   + Schema (schemas/unified-content-schema) │
└─────────────────────────────────────────────┘
```

---

**Last Updated**: October 6, 2025  
**Maintained By**: AI Assistants + Development Team  
**Version**: 1.0.0

**Next Update**: Add new patterns as they emerge
