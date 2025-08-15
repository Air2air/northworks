# Route Consolidation Plan

## Interviews
**Keep:** `/interviews`
**Remove:** `/interviews-index`, `/interviews-improved`, `/interviews-dynamic`
**Reasoning:** Main /interviews route is referenced in homepage and navigation

## Articles
**Keep:** `/articles`
**Remove:** `/articles-index`, `/articles-dynamic`
**Reasoning:** Main /articles route is referenced in homepage and navigation

## Portfolio
**Keep:** `/warner-portfolio`
**Remove:** `/portfolio`
**Reasoning:** Warner-specific portfolio appears more specialized and used

## Steps to Execute:
1. Test functionality of main routes
2. Update any internal links pointing to duplicate routes
3. Remove duplicate route directories
4. Update navigation components if needed
5. Test site functionality after removal

## Commands:
```bash
# Remove duplicate route directories
rm -rf src/app/interviews-index src/app/interviews-improved src/app/interviews-dynamic
rm -rf src/app/articles-index src/app/articles-dynamic 
rm -rf src/app/portfolio

# Update any remaining references in code
# (Manual step - search and replace in IDE)
```
