# Field Normalization System Documentation

## Overview
This document describes the comprehensive field normalization system implemented to prevent inconsistencies in frontmatter field access across the NorthWorks application.

## Problem Solved
Previously, different parts of the system were looking for different field names for the same conceptual data:
- Some components checked `frontmatter.description`
- Others looked for `frontmatter.subtitle`
- Some used `frontmatter.summary`
- Content-specific logic checked `frontmatter.organization`, `frontmatter.interviewee`, etc.

This led to inconsistent behavior where descriptions wouldn't appear in some contexts.

## Solution: Centralized Field Normalization

### Core Module: `/src/lib/fieldNormalization.ts`

This module provides standardized field access with comprehensive fallback logic:

```typescript
// Core functions:
- normalizeFrontmatter(frontmatter): NormalizedFrontmatter
- getDescription(frontmatter): string
- getPageTitle(frontmatter): string
- getPageSubtitle(frontmatter, contentType): string
- getKeywords(frontmatter): string[]
- getPublicationInfo(frontmatter): object
- shouldShowPublicationInfo(frontmatter, contentType): boolean
```

### Field Resolution Order

#### Description Field Resolution:
1. `frontmatter.description` (primary)
2. `frontmatter.summary` (secondary)
3. `frontmatter.subtitle` (tertiary)
4. Content-type specific fields:
   - Publications: "Published in {journal}"
   - Professional: organization name
   - Interviews: "Interview with {interviewee}"

#### Keywords Field Resolution:
1. `frontmatter.keywords` (primary)
2. `frontmatter.tags` (fallback)

#### Title Field Resolution:
1. `frontmatter.title` (with consistent formatting)

## Updated Components

### 1. UnifiedLayout.tsx
- Replaced manual field checking with `normalizeFrontmatter()`
- Uses `getPageSubtitle()` for consistent subtitle logic
- Uses `getPublicationInfo()` for metadata display

### 2. metadataUtils.ts
- All metadata generation functions now use normalized field access
- Consistent description and keyword resolution across all page types

### 3. page-templates.ts
- Updated to use `getDescription()` for contextual descriptions

### 4. content-processing.ts
- Unified description extraction using normalized fields

## Benefits

### 1. Consistency
- All components now use the same field resolution logic
- Descriptions appear consistently across all page types
- Keywords/tags are handled uniformly

### 2. Maintainability
- Single source of truth for field access logic
- Changes to field resolution only need to be made in one place
- Clear fallback hierarchy for all field types

### 3. Robustness
- Graceful handling of missing fields
- Comprehensive fallback logic prevents empty content
- Type safety with NormalizedFrontmatter interface

### 4. Flexibility
- Easy to add new field types or modify resolution logic
- Backward compatibility maintained
- Content-type specific logic centralized

## Usage Examples

### Before (inconsistent):
```typescript
// Different components doing different things:
const description = frontmatter.description || frontmatter.summary;
const subtitle = frontmatter.subtitle;
const keywords = frontmatter.tags || [];
```

### After (normalized):
```typescript
// All components use the same logic:
const normalized = normalizeFrontmatter(frontmatter);
const description = getDescription(normalized);
const subtitle = getPageSubtitle(normalized, contentType);
const keywords = getKeywords(normalized);
```

## Field Mappings

| Concept | Primary Field | Fallback Fields | Content-Specific |
|---------|---------------|-----------------|------------------|
| Description | `description` | `summary`, `subtitle` | `journal`, `organization`, `interviewee` |
| Keywords | `keywords` | `tags` | - |
| Title | `title` | - | - |
| Subtitle | `subtitle` | `description`, `summary` | Content-type specific logic |

## Testing
- All page types tested for consistent description display
- Build process validates type safety
- No breaking changes to existing functionality

## Future Enhancements
The normalization system can be easily extended for:
- New content types
- Additional field mappings
- Custom resolution logic per content type
- Advanced field transformations

This system ensures that field access inconsistencies like the missing Warner page descriptions cannot occur again, as all field access goes through the centralized normalization layer.
