# Cleanup & Consolidation Opportunities

## Critical Issues to Address

### 1. **Orphaned `professional` Page Component** ⚠️
**Location:** `src/app/professional/page.tsx`

**Issue:** 
- This file still exists and references `w-professional` content
- The directory `src/app/professional/` was supposedly moved to `src/app/projects/`
- But the old file is still present and causes confusion

**Impact:**
- Route collision: Both `/professional` and `/projects` may exist
- Maintenance burden: Changes need to be made in two places
- User confusion: Two similar pages with different content

**Solution:**
```bash
# Delete the orphaned file
rm -rf src/app/professional/
```

---

### 2. **Duplicate Content Files** ⚠️

#### A. `w-professional.md` vs `w-projects.md`
Both files exist with similar but different content:
- `w-professional.md` - Old version with outdated links (`/professional/w-professional-*`)
- Content appears to be similar to projects subsections

#### B. `w_projects.md` (with underscore!)
- Raw HTML file that appears to be an unconverted legacy file
- Still references old `.htm` files and HTML table layouts
- Should be deleted or fully migrated

#### C. `w-projects-stanford.md` vs `w-stanford-experience.md`
Both files exist:
- `w-projects-stanford.md` - 91 lines
- `w-stanford-experience.md` - 91 lines (likely identical?)
- We renamed it but the old file may still be there

#### D. `w-professional-stanford.md`
Still exists and references old routes

**Solution:**
```bash
# Check for duplicates and remove old versions
rm public/content/w-professional.md              # Keep w-projects.md
rm public/content/w_projects.md                  # Legacy HTML file
rm public/content/w-projects-stanford.md         # Keep w-stanford-experience.md  
rm public/content/w-professional-stanford.md     # Old version
```

---

### 3. **Inconsistent Naming Conventions**

**Files with inconsistent patterns:**
- `w-projects-nrc.md` ✅
- `w-projects-government.md` ✅
- `w-projects-consulting.md` ✅
- `w-stanford-experience.md` ✅ (Different pattern!)
- `w-projects.md` (main) ✅

**Recommendation:** Decide on one pattern:

**Option A - Keep "projects-" prefix:**
```
w-projects.md
w-projects-nrc.md
w-projects-government.md
w-projects-consulting.md
w-projects-stanford.md  ← Rename w-stanford-experience.md
```

**Option B - Semantic naming (current):**
```
w-projects.md
w-projects-nrc.md
w-projects-government.md
w-projects-consulting.md
w-stanford-experience.md  ← Keep as is (more semantic)
```

**Recommended:** Option B (current) - More meaningful names

---

### 4. **Unused Static Page Directories**

Check if `background` needs cleanup:
- Old route was `/background/[slug]` with dynamic routing
- New route is `/background` (static page)
- May have orphaned `[slug]` directory

---

## Moderate Issues

### 5. **Broken Internal Links in w-professional.md**

If we keep `w-professional.md`, these links are broken:
```markdown
### [Government Service](/professional/w-professional-government)
### [The National Academies](/professional/w-professional-nrc)
### [Stanford University](/professional/w-professional-stanford)
```

Should be:
```markdown
### [Government Service](/projects-government)
### [The National Academies](/projects-nrc)
### [Stanford University](/stanford-experience)
```

---

### 6. **Type Field Inconsistency**

Files have mismatched `type` fields:
- `w-projects-stanford.md` → `type: company` (❌ should be `professional`)
- `w-professional.md` → `type: company` (❌ should be `professional`)
- `w-stanford-experience.md` → `type: professional` (✅)

**Note:** With the breadcrumb simplification, `type` is less critical, but consistency helps with filtering and search.

---

### 7. **Legacy Test References**

`src/lib/__tests__/linkResolver.test.ts`:
```typescript
expect(resolveContentLink('w-professional-2020')).toBe('/professional/w-professional-2020');
```

Should be updated to test `/projects/` routes.

---

## Minor Issues

### 8. **Documentation Updates Needed**

Files referencing old structure:
- `README.md` - Line 182: references `w-professional-nrc.md`
- `CODEBASE_MAP.md` - Line 488: references `w-professional-nrc.md`
- `docs/CODEBASE_CLEANUP_REPORT.md` - References to `w-professional.md`

---

## Recommended Action Plan

### Phase 1: Critical Cleanup (Do Now)
```bash
# 1. Remove orphaned professional directory
rm -rf src/app/professional/

# 2. Remove duplicate/legacy content files
rm public/content/w-professional.md
rm public/content/w_projects.md
rm public/content/w-professional-stanford.md

# 3. Check and remove old w-projects-stanford.md if duplicate
# First verify they're identical:
diff public/content/w-projects-stanford.md public/content/w-stanford-experience.md
# If identical, remove:
rm public/content/w-projects-stanford.md
```

### Phase 2: Fix Type Fields
Update frontmatter in these files to use `type: professional`:
- `w-projects.md`
- `w-projects-nrc.md`
- `w-projects-government.md`
- `w-projects-consulting.md`
- `w-stanford-experience.md`

### Phase 3: Update Tests
Fix test in `src/lib/__tests__/linkResolver.test.ts`:
```typescript
- expect(resolveContentLink('w-professional-2020')).toBe('/professional/w-professional-2020');
+ expect(resolveContentLink('w-projects-consulting')).toBe('/projects-consulting');
```

### Phase 4: Documentation
Update references in:
- `README.md`
- `CODEBASE_MAP.md`
- `docs/CODEBASE_CLEANUP_REPORT.md`

---

## Files to Delete (Summary)

```bash
src/app/professional/page.tsx              # Orphaned after rename
public/content/w-professional.md           # Replaced by w-projects.md
public/content/w_projects.md               # Legacy HTML
public/content/w-professional-stanford.md  # Replaced by w-stanford-experience.md
public/content/w-projects-stanford.md      # If duplicate of w-stanford-experience.md
```

---

## Benefits of Cleanup

1. **Reduced Confusion** - One clear file per concept
2. **Faster Development** - No need to check multiple files
3. **Easier Maintenance** - Single source of truth
4. **Better Performance** - Fewer files to process
5. **Cleaner Git History** - Remove dead code
6. **Improved Search** - No duplicate results

---

## Verification Checklist

After cleanup, verify:
- [ ] `/projects` page loads correctly
- [ ] `/projects-nrc` page loads correctly
- [ ] `/projects-government` page loads correctly
- [ ] `/projects-consulting` page loads correctly
- [ ] `/stanford-experience` page loads correctly
- [ ] `/professional` returns 404 (old route removed)
- [ ] No broken links in navigation
- [ ] All tests pass
- [ ] No TypeScript errors

---

## Risk Assessment

**Low Risk:**
- Deleting `w_projects.md` (legacy HTML, unused)
- Deleting `src/app/professional/page.tsx` (orphaned)

**Medium Risk:**
- Deleting `w-professional.md` (verify no links point to it)
- Deleting duplicate stanford files (verify they're truly duplicates)

**Recommendation:** Test on development server after each deletion to verify no breakage.
