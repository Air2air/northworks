# AI Assistant Guide for Northworks Codebase

> **For**: Claude, GPT-4, and other AI coding assistants  
> **Purpose**: Prevent bugs, maintain consistency, preserve context  
> **Read This**: BEFORE making ANY code changes

---

## 🚨 Critical Rules (NEVER VIOLATE)

### 1. Type Safety - ALWAYS USE CENTRALIZED TYPES
```typescript
// ❌ NEVER DO THIS
import { ContentType } from '@/schemas/unified-content-schema';
import { BreadcrumbItem } from './Breadcrumbs';

// ✅ ALWAYS DO THIS
import { ContentType, BreadcrumbItem } from '@/types';
```

**Why**: Single source of truth prevents type drift and conflicts

### 2. Image Components - NEVER USE RAW IMG TAGS
```typescript
// ❌ NEVER DO THIS
<img src="/images/photo.jpg" alt="Photo" />

// ✅ ALWAYS DO THIS
import OptimizedImage from '@/components/ui/OptimizedImage';
<OptimizedImage 
  src="/images/photo.jpg" 
  alt="Photo" 
  width={300} 
  height={200} 
/>
```

**Why**: OptimizedImage handles responsive sizing, lazy loading, and performance

### 3. Content Loading - USE EXISTING UTILITIES
```typescript
// ❌ NEVER DO THIS
const content = fs.readFileSync(`/public/content/${slug}.md`);
const { data, content: body } = matter(content);

// ✅ ALWAYS DO THIS
import { getContentBySlug } from '@/lib/content';
const content = getContentBySlug(slug, true);
```

**Why**: Utilities handle caching, error handling, and normalization

### 4. Layout Components - USE UnifiedLayout
```typescript
// ❌ NEVER DO THIS - Creating new layout
export default function CustomLayout({ children }) {
  return <div className="layout">{children}</div>;
}

// ✅ ALWAYS DO THIS - Use existing
import UnifiedLayout from '@/components/layouts/UnifiedLayout';
<UnifiedLayout 
  breadcrumbs={breadcrumbs}
  frontmatter={frontmatter}
  content={content}
/>
```

**Why**: Consistency across all pages, single place to update

### 5. Tests - ALWAYS RUN AFTER CHANGES
```bash
# ✅ ALWAYS RUN
npm test

# ✅ VERIFY NO ERRORS
npm run build
```

**Why**: Catch breaking changes before they reach production

---

## 🎯 Context Preservation Strategy

### Problem: AI Loses Context After Long Conversations
**Solution**: Use these anchors to quickly regain context

### Step 1: Identify the Task Category

| User Asks About | Read These Files First |
|-----------------|----------------------|
| "Fix a bug in..." | 1. The file mentioned<br>2. Its test file<br>3. Related utilities |
| "Add a new page" | 1. `CODEBASE_MAP.md`<br>2. Similar existing page<br>3. `UnifiedLayout.tsx` |
| "Modify types" | 1. `src/types/index.ts`<br>2. `src/schemas/unified-content-schema.ts`<br>3. Related components |
| "Content not showing" | 1. `src/lib/unified-data.ts`<br>2. `src/lib/content.ts`<br>3. The page component |
| "Style changes" | 1. `src/lib/styleUtils.ts`<br>2. `src/app/globals.css`<br>3. Component in question |
| "Search issues" | 1. `src/lib/search.ts`<br>2. `src/app/search/page.tsx` |

### Step 2: Use Grep to Find Related Code
```bash
# Find all imports of a utility
grep -r "from '@/lib/unified-data'" src/

# Find all usages of a component
grep -r "UnifiedCard" src/

# Find type definitions
grep -r "interface.*Props" src/types/

# Find similar patterns
grep -r "similar-pattern" src/
```

### Step 3: Check Dependencies
Before modifying a file, check what imports it:
```bash
# What depends on this file?
grep -r "from.*filename" src/
```

---

## 🧩 Pattern Recognition Guide

### Pattern 1: Content Loading Pattern
**When you see**: A page needs to display content  
**Always use**: This exact pattern

```typescript
// File: src/app/some-page/page.tsx
import { getContentByType } from '@/lib/unified-data';
import UnifiedList from '@/components/ui/UnifiedList';

export default function SomePage() {
  const content = getContentByType('article'); // or 'interview', 'review', etc.
  
  return (
    <UnifiedList 
      items={content}
      options={{
        showImage: true,
        showSummary: true,
        showTags: true
      }}
    />
  );
}
```

### Pattern 2: Single Content Page Pattern
**When you see**: A page needs to show ONE piece of content  
**Always use**: This exact pattern

```typescript
// File: src/app/[...slug]/page.tsx
import { getContentBySlug } from '@/lib/content';
import UnifiedLayout from '@/components/layouts/UnifiedLayout';

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const slugString = Array.isArray(slug) ? slug.join('/') : slug;
  const content = getContentBySlug(slugString, true);

  return (
    <UnifiedLayout
      frontmatter={content.frontmatter}
      content={content.content}
      slug={slugString}
      contentType={content.frontmatter.type}
      breadcrumbConfig={{
        parentLabel: "Parent",
        parentPath: "/parent"
      }}
    />
  );
}
```

### Pattern 3: Static Generation Pattern
**When you see**: Need to generate static pages  
**Always use**: This exact pattern

```typescript
export async function generateStaticParams() {
  const slugs = getAllContentSlugs(); // from @/lib/content
  return slugs.map(slug => ({ slug: slug.split('/') }));
}
```

### Pattern 4: Component Props Pattern
**When you see**: Creating a new component  
**Always define**: Props interface in `@/types` OR inline

```typescript
// Option 1: Inline (for component-specific props)
interface MyComponentProps {
  title: string;
  items: UnifiedContentItem[]; // Import from @/types
  className?: string;
}

export default function MyComponent({ title, items, className }: MyComponentProps) {
  // ...
}

// Option 2: In @/types/index.ts (for shared props)
// Add to types/index.ts if multiple components use it
```

---

## 🔍 Debugging Workflow for AI

### When User Reports a Bug

#### Step 1: Gather Information
```markdown
**Ask User**:
1. What were you trying to do?
2. What did you expect to happen?
3. What actually happened?
4. Any error messages? (screenshot or copy-paste)
5. Which page/component?
```

#### Step 2: Locate the Code
```bash
# Find the page file
ls -la src/app/**/page.tsx | grep <page-name>

# Find the component
ls -la src/components/**/*.tsx | grep <component-name>

# Find related utilities
ls -la src/lib/*.ts | grep <utility-name>
```

#### Step 3: Check Related Files
```markdown
For each file found:
1. Read the main file
2. Read its imports
3. Read its tests (if exists)
4. Check for similar patterns in codebase
```

#### Step 4: Reproduce Mentally
```markdown
**Trace the data flow**:
1. Where does data come from?
2. How is it transformed?
3. Where is it displayed?
4. What could go wrong at each step?
```

#### Step 5: Propose Fix
```markdown
Before suggesting a fix:
1. ✅ Does it follow existing patterns?
2. ✅ Does it require type changes?
3. ✅ Will it break other code?
4. ✅ Can you test it?
```

#### Step 6: Implement & Verify
```bash
# After making changes:
npm test                    # Run tests
npm run build              # Check build
grep -r "changed-code" src/ # Check for impacts
```

---

## 🚫 Common Mistakes & How to Avoid

### Mistake 1: Creating Duplicate Utilities
**Problem**: AI creates new function instead of using existing one

**Prevention**:
```bash
# Before creating a new utility, search for similar ones
grep -r "function.*name" src/lib/

# Check these files first:
# - src/lib/unified-data.ts (content loading)
# - src/lib/content.ts (single content)
# - src/lib/pathUtils.ts (URL/path utilities)
# - src/lib/styleUtils.ts (styling)
# - src/lib/dateUtils.ts (date formatting)
```

### Mistake 2: Breaking Type Safety
**Problem**: AI imports types from wrong location

**Prevention**:
```typescript
// ✅ CORRECT - Single import point
import { 
  ContentType, 
  UnifiedContentItem, 
  BreadcrumbItem 
} from '@/types';

// ❌ WRONG - Multiple import points
import { ContentType } from '@/schemas/unified-content-schema';
import { BreadcrumbItem } from '@/components/Breadcrumbs';
```

**Check**: `src/types/index.ts` BEFORE defining new types

### Mistake 3: Inconsistent Styling
**Problem**: AI adds inline styles or custom CSS

**Prevention**:
```typescript
// ❌ WRONG
<div style={{ marginTop: '20px', color: 'blue' }}>

// ❌ WRONG
<div className="my-custom-class"> // with new CSS file

// ✅ CORRECT - Use Tailwind
<div className="mt-5 text-blue-600">

// ✅ CORRECT - Use styleUtils for dynamic classes
import { getSizeClasses } from '@/lib/styleUtils';
<div className={getSizeClasses('large')}>
```

### Mistake 4: Not Using Existing Components
**Problem**: AI creates new component that duplicates existing one

**Prevention**:
```bash
# Before creating a new component, search
grep -r "component.*name" src/components/

# Check these directories:
# - src/components/ui/ (reusable UI components)
# - src/components/layouts/ (layout components)
# - src/components/pages/ (page-level components)
```

**Key Components to Reuse**:
- `UnifiedCard` - For displaying any content type
- `UnifiedList` - For listing any content type
- `OptimizedImage` - For all images
- `UnifiedLayout` - For all page layouts
- `Tags` - For displaying tags
- `PageTitle` - For page titles

### Mistake 5: Ignoring Tests
**Problem**: AI makes changes without running tests

**Prevention**:
```bash
# ALWAYS run after making changes
npm test

# If tests fail, DON'T just update snapshots
# 1. Understand WHY they failed
# 2. Check if your change broke something
# 3. Fix the issue
# 4. THEN run tests again
```

---

## 📝 Documentation Requirements

### When Adding New Code

#### New Component
```typescript
/**
 * ComponentName
 * 
 * Purpose: Brief description of what this component does
 * 
 * Usage:
 * ```tsx
 * <ComponentName prop1="value" prop2={data} />
 * ```
 * 
 * Props:
 * - prop1: Description of prop1
 * - prop2: Description of prop2
 * 
 * @example
 * <ComponentName items={items} showImages={true} />
 */
export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // ...
}
```

#### New Utility Function
```typescript
/**
 * Utility function description
 * 
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of what is returned
 * 
 * @example
 * const result = utilityFunction('value', 123);
 */
export function utilityFunction(param1: string, param2: number): ReturnType {
  // ...
}
```

#### New Type
```typescript
/**
 * Type description
 * 
 * Used by: List components that use this type
 * 
 * @example
 * const item: TypeName = {
 *   field1: 'value',
 *   field2: 123
 * };
 */
export interface TypeName {
  /** Description of field1 */
  field1: string;
  /** Description of field2 */
  field2: number;
}
```

---

## 🎯 Specific Instructions by Task

### Task: User Reports "Content Not Showing"

**Checklist**:
1. ✅ Check if content file exists: `ls public/content/[slug].md`
2. ✅ Check frontmatter has required fields (id, title, type)
3. ✅ Check `getContentBySlug()` is called with correct slug
4. ✅ Check `processHtml` parameter (usually `true`)
5. ✅ Check `UnifiedLayout` receives correct props
6. ✅ Check browser console for errors
7. ✅ Check network tab for 404s

**Common Fixes**:
- Missing `breadcrumbConfig` prop on `UnifiedLayout`
- Wrong `processHtml` parameter (should be `true`)
- Malformed frontmatter (YAML syntax errors)
- Incorrect slug format

### Task: User Wants to "Add New Content Type"

**Steps**:
1. ✅ Edit `src/schemas/unified-content-schema.ts`
2. ✅ Add new type to `ContentType` union
3. ✅ Add new category to `ContentCategory` union (if needed)
4. ✅ Add new interface extending `UnifiedContentItem` (if special fields needed)
5. ✅ Update `src/lib/unified-data.ts` to handle new type
6. ✅ Add content files with new type in frontmatter
7. ✅ Create page route in `src/app/[new-type]/page.tsx`
8. ✅ Run tests: `npm test`
9. ✅ Test build: `npm run build`

### Task: User Wants to "Change Styling"

**Steps**:
1. ✅ Check if it's a global change → edit `src/app/globals.css`
2. ✅ Check if it's a component change → edit component's className
3. ✅ Use Tailwind classes (NOT custom CSS)
4. ✅ Use `styleUtils.ts` for dynamic classes
5. ✅ Test responsive behavior (mobile, tablet, desktop)
6. ✅ Check color contrast for accessibility

### Task: User Wants to "Fix Search"

**Files to Check**:
1. `src/lib/search.ts` - Main search logic
2. `src/app/search/page.tsx` - Search page
3. `src/components/SearchInterface.tsx` - Search UI

**Common Issues**:
- Search query not being passed correctly
- Filters not being applied
- Results not being displayed
- Collection filtering broken

---

## 🧠 Mental Model for AI

### Think of the Codebase as Layers

```
Layer 1: Data Layer (Bottom)
├── Content files (/public/content/*.md)
├── Schemas (src/schemas/)
└── Types (src/types/)

Layer 2: Logic Layer (Middle)
├── Content loaders (src/lib/unified-data.ts, content.ts)
├── Utilities (src/lib/*)
└── Search/filtering (src/lib/search.ts)

Layer 3: Presentation Layer (Top)
├── Components (src/components/ui/*)
├── Layouts (src/components/layouts/*)
└── Pages (src/app/**/page.tsx)
```

**Rule**: Upper layers import from lower layers, NEVER the reverse

### Think of Components as Building Blocks

```
Foundation Blocks (Use these first):
├── UnifiedLayout (wraps all pages)
├── UnifiedCard (displays any content)
├── UnifiedList (lists any content)
└── OptimizedImage (displays images)

Specialized Blocks (Use when needed):
├── Tags (tag display)
├── PageTitle (page titles)
├── Breadcrumbs (navigation)
└── SearchInterface (search UI)

Custom Blocks (Create only if necessary):
└── [Your new component if no existing one fits]
```

---

## ✅ Pre-Flight Checklist

Before suggesting ANY code change, verify:

1. ✅ I have read the relevant files
2. ✅ I understand the existing pattern
3. ✅ My solution follows the pattern
4. ✅ I'm not duplicating existing code
5. ✅ I'm using centralized types from `@/types`
6. ✅ I'm using existing utilities where possible
7. ✅ I'm using existing components where possible
8. ✅ My code includes TypeScript types
9. ✅ I've considered edge cases
10. ✅ Tests will pass (or I know which to update)

---

## 🆘 When Stuck

### If you lose context:
1. Read `CODEBASE_MAP.md` (this gives you the big picture)
2. Read this file (`AI_ASSISTANT_GUIDE.md`)
3. Use grep to find similar patterns
4. Check the file's imports to understand dependencies
5. Look at the tests to see expected behavior

### If you're unsure about a change:
1. Ask the user for clarification
2. Suggest reading a specific file together
3. Propose multiple options with trade-offs
4. Start with the smallest change possible

### If tests fail:
1. Read the error message carefully
2. Find the failing test file
3. Understand what the test expects
4. Check if your change broke the expectation
5. Fix the code (NOT the test, unless test is wrong)

---

## 📊 Success Metrics

### Your changes are successful when:
- ✅ All tests pass (`npm test`)
- ✅ Build succeeds (`npm run build`)
- ✅ No TypeScript errors
- ✅ Code follows existing patterns
- ✅ No duplicate code created
- ✅ Documentation is clear
- ✅ User's issue is resolved

---

## 🎓 Learning from Past Mistakes

### Common Bug Patterns in This Codebase

#### Bug: Static pages showing blank content
**Root Cause**: Missing `breadcrumbConfig` prop
**Solution**: Always provide `breadcrumbConfig` to `UnifiedLayout`
**Prevention**: Check `UnifiedLayout` prop requirements

#### Bug: MDX compilation errors
**Root Cause**: Malformed HTML in markdown (e.g., `<hr>` instead of `<hr />`)
**Solution**: Use self-closing tags in markdown
**Prevention**: Validate markdown syntax

#### Bug: TypeScript errors about missing types
**Root Cause**: Importing from wrong location
**Solution**: Always import from `@/types`
**Prevention**: Check imports in similar files first

---

## 🎯 Quick Reference Card

### When User Asks... → Do This...

| Request | Action |
|---------|--------|
| "Add a page" | Copy similar page, modify for new route |
| "Fix bug in [file]" | Read file + tests + imports, understand flow, fix |
| "Change style" | Use Tailwind classes, update component className |
| "Add component" | Check if existing component can be reused first |
| "Modify types" | Edit `schemas/`, types auto-export through `types/` |
| "Content not loading" | Check `unified-data.ts` and content file exists |
| "Tests failing" | Read error, find test, understand expectation, fix code |

---

**Version**: 1.0.0  
**Last Updated**: October 6, 2025  
**For AI Models**: Claude 3.5 Sonnet, GPT-4, and future assistants  
**Maintained By**: Development Team + AI Assistants

**Remember**: This codebase is clean and well-organized. Keep it that way! 🎯
