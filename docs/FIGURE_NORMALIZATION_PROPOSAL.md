# Figure Normalization Proposal: Old HTML Popup System to Integrated Figure Component

## Current Architecture Analysis

### Old System (HTML Popups)
The Warner pages use an older architecture where:
1. **HTML popup files** in `public/content/*.htm` contain single `<img>` tags
2. **Markdown contains inline links** to these HTML files with empty link text `[ ]`
3. **Separate "Click to enlarge" links** point to either the same HTML file or a Next.js route
4. **Images referenced** have relative paths like `images/filename.jpg` within the HTML

Example from `w-epasab1990.md`:
```markdown
[ ](1990 sab fig 1.htm) [Figure 1: Population Growth Projected by World Region - Click to enlarge](/content/1990 SAB Fig 1.htm)
```

### Current New System (Integrated Figures)
The new architecture used in `w-pub-vniigaz.md`:
1. **Bold figure captions** in markdown: `**Figure X. Caption text**`
2. **Click to enlarge links** immediately following
3. **Images in frontmatter** with matching figure numbers
4. **Figure component** renders integrated image + caption

---

## Problem Analysis

### Issues with Current Mixed System

1. **Duplicate link references**: Empty link `[ ](filename.htm)` + "Click to enlarge" link
2. **Orphaned HTML files**: 26 `.htm` files in `public/content/` serving only as image containers
3. **Missing images**: Some images referenced in HTML don't exist (e.g., `1990_sab_figure1.jpg`)
4. **Inconsistent inline placement**: Old system has figures grouped at end, not inline in content
5. **No caption integration**: Captions are separate from images in the markup

### Files Affected

**Warner pages with old HTML popup system:**
- `w-epasab1990.md` - 3 figures (1990 SAB figures 1-3)
- `w-pub-seif-iv.md` - 5 figures (Baltic gas analysis)

**HTML popup files (26 total):**
```
1990_SAB_Fig_1.htm → images/1990_sab_figure1.jpg (MISSING)
1990_SAB_Fig_2.htm → images/1990_sab_figure2.jpg (MISSING)
1990_SAB_Fig_3.htm → images/1990_sab_figure3.jpg (MISSING)
FEbalticgasinfdiag.htm → images/balticgasinfdiag.gif ✓
FEbalticgasparttree.htm → images/balticgasparttree.gif ✓
FEbalticgascumd.htm → images/balticgascumd.gif ✓
FEbalticgasmap.htm → images/balticgasmap.jpg ✓
FELbalticgasmap.htm → images/legbalticgasmap.jpg ✓
FElithgen.htm → images/lithgen.gif (need to verify)
FEpersiangulfinfd.htm → images/persiangulfinfd.gif (need to verify)
FEpersiangulfinfkey.htm → images/persiangulfinfkey.gif (need to verify)
FEsynfuelstree.htm → images/synfuelstree.gif (need to verify)
... (and duplicates)
```

---

## Proposed Normalization Strategy

### Phase 1: Image Audit and Migration

**Action Items:**
1. ✅ Extract image references from all 26 HTML files
2. ✅ Verify which images exist in `public/images/`
3. 🔴 Source missing images (1990 SAB figures 1-3, others)
4. 🔴 Add dimensions to image metadata (width/height from HTML files)

### Phase 2: Markdown Conversion

**For each Warner page with HTML popup links:**

#### A. Add Images to Frontmatter
```yaml
images:
  - src: /images/1990_sab_figure1.jpg
    alt: Population Growth Projected by World Region
    figureHint: "1"
    width: 667
    height: 864
  - src: /images/1990_sab_figure2.jpg
    alt: End-Use Fuel Demand by Region
    figureHint: "2"
    width: 667
    height: 864
```

#### B. Convert Inline Markdown Pattern

**OLD PATTERN:**
```markdown
[ ](1990 sab fig 1.htm) [Figure 1: Population Growth Projected by World Region - Click to enlarge](/content/1990 SAB Fig 1.htm)
```

**NEW PATTERN:**
```markdown
**Figure 1. Population Growth Projected by World Region** [Figure 1 - Click to enlarge](/articles/1990-sab-fig-1)
```

#### C. Position Figures Inline

Move figure references from end-of-document to appropriate inline locations based on:
- Where the figure is first mentioned in text
- Logical flow of the narrative
- After the paragraph that describes what the figure shows

**Example for `w-epasab1990.md`:**
- Figure 1 (Population) → After paragraph discussing population scenarios (SCW/RCW)
- Figure 2 (Energy Demand) → After paragraph about end-use fuel demand patterns
- Figure 3 (Energy Supply) → After paragraph about primary energy supply changes

### Phase 3: Route Updates

**Update Next.js routes** to handle new `/articles/[slug]` patterns:
- Create article detail routes for standalone figure viewing
- Or redirect to main article page with anchor to figure

### Phase 4: Cleanup

1. 🔴 Remove or archive 26 HTML popup files from `public/content/`
2. 🔴 Update any external links that might reference the old HTML files
3. 🔴 Test all "Click to enlarge" functionality

---

## Detailed Conversion Example: w-epasab1990.md

### Current State (End of Document)
```markdown
### Figures

[ ](1990 sab fig 1.htm) [Figure 1: Population Growth Projected by World Region - Click to enlarge](/content/1990 SAB Fig 1.htm) 
[ ](1990 sab fig 2.htm) [Figure 2: End-Use Fuel Demand by Region - Click to enlarge](/content/1990 SAB Fig 2.htm) 
[ ](1990 sab fig 3.htm) [Figure 3: Primary Energy Supply by Type - Click to enlarge](/content/1990 SAB Fig 3.htm)
```

### Proposed Inline Placements

**Figure 1 - After this paragraph (approx line 28):**
```markdown
The population projections by region used by EPA for the SCW and RCW scenarios and their 
policy derivatives are shown in Figure 1. It is evident that in both scenarios the population 
increase occurs outside of the OECD countries (the United States, Canada, Western Europe, 
Australia, New Zealand, and Japan).

**Figure 1. Population Growth Projected by World Region** [Figure 1 - Click to enlarge](/articles/1990-sab-fig-1)
```

**Figure 2 - After this paragraph (approx line 30):**
```markdown
Figure 2 shows the pattern of end-use fuel demand by region. The proportion of energy end 
use in the OECD countries decreases considerably over time, and the extent of energy end use 
saving from policy is much larger outside the OECD countries than within them. The rate of 
carbon dioxide emissions is driven primarily by the pattern of energy use in the non-OECD 
countries as the non-OECD countries develop and industrialize.

**Figure 2. End-Use Fuel Demand by Region** [Figure 2 - Click to enlarge](/articles/1990-sab-fig-2)
```

**Figure 3 - After this paragraph (approx line 32):**
```markdown
Figure 3 shows primary energy supply by type. In the non-policy cases, annual worldwide coal 
consumption expands from three to ten times the present level, while in the policy cases 
worldwide coal use stays approximately constant. To accomplish the necessary substitution for 
coal requires the creation of very large industries for the new energy technologies, such as 
biomass, photovoltaics and other solar, nuclear and conservation/increased energy efficiency.

**Figure 3. Primary Energy Supply by Type** [Figure 3 - Click to enlarge](/articles/1990-sab-fig-3)
```

**Remove the "Figures" section** at the end of the document.

---

## Implementation Script Proposal

```javascript
// scripts/normalize-html-figures.js

const fs = require('fs');
const path = require('path');

/**
 * Extract image info from HTML popup files
 */
function extractImageFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const imgMatch = html.match(/<img\s+src="([^"]+)"\s+height="(\d+)"\s+width="(\d+)"/i);
  
  if (imgMatch) {
    return {
      src: imgMatch[1].replace('images/', '/images/'),
      width: parseInt(imgMatch[3]),
      height: parseInt(imgMatch[2])
    };
  }
  return null;
}

/**
 * Audit all HTML files and their images
 */
function auditHtmlFiles() {
  const htmlFiles = fs.readdirSync('public/content')
    .filter(f => f.endsWith('.htm'));
  
  const report = [];
  
  htmlFiles.forEach(filename => {
    const htmlPath = path.join('public/content', filename);
    const imageInfo = extractImageFromHtml(htmlPath);
    
    if (imageInfo) {
      const imagePath = path.join('public', imageInfo.src);
      const exists = fs.existsSync(imagePath);
      
      report.push({
        htmlFile: filename,
        imageSrc: imageInfo.src,
        width: imageInfo.width,
        height: imageInfo.height,
        imageExists: exists
      });
    }
  });
  
  return report;
}

/**
 * Generate frontmatter images section
 */
function generateFrontmatterImages(imageInfoArray) {
  const yaml = ['images:'];
  
  imageInfoArray.forEach((img, index) => {
    yaml.push(`  - src: ${img.src}`);
    yaml.push(`    alt: "Figure ${index + 1}"`);
    yaml.push(`    figureHint: "${index + 1}"`);
    yaml.push(`    width: ${img.width}`);
    yaml.push(`    height: ${img.height}`);
  });
  
  return yaml.join('\n');
}

// Run audit
console.log('HTML Figure Audit Report:');
console.log('========================\n');

const audit = auditHtmlFiles();
audit.forEach(item => {
  console.log(`${item.htmlFile}:`);
  console.log(`  Image: ${item.imageSrc}`);
  console.log(`  Dimensions: ${item.width}x${item.height}`);
  console.log(`  Exists: ${item.imageExists ? '✓' : '✗ MISSING'}`);
  console.log();
});

console.log('\nSummary:');
console.log(`Total HTML files: ${audit.length}`);
console.log(`Missing images: ${audit.filter(a => !a.imageExists).length}`);
```

---

## Migration Checklist

### Pre-Migration
- [ ] Run audit script to identify all HTML files and their images
- [ ] Source missing images (particularly 1990 SAB figures)
- [ ] Document current markdown structure for each affected page

### w-epasab1990.md Migration
- [ ] Add frontmatter images section with 3 figures
- [ ] Read document to understand narrative flow
- [ ] Place Figure 1 inline after population discussion
- [ ] Place Figure 2 inline after energy demand discussion
- [ ] Place Figure 3 inline after energy supply discussion
- [ ] Convert markdown from `[ ](*.htm)` pattern to `**Figure X.**` pattern
- [ ] Update "Click to enlarge" links to new routes
- [ ] Remove "Figures" section from end
- [ ] Test rendering with Figure component

### w-pub-seif-iv.md Migration
- [ ] Add frontmatter images section with 5 figures
- [ ] Read document to identify inline placement locations
- [ ] Place each figure at appropriate inline position
- [ ] Convert markdown patterns
- [ ] Update links
- [ ] Test rendering

### Post-Migration
- [ ] Test all "Click to enlarge" functionality
- [ ] Verify all images display correctly
- [ ] Check responsive behavior
- [ ] Archive HTML popup files (don't delete yet, for rollback)
- [ ] Update any external documentation

---

## Benefits of Normalization

1. **Consistency**: All Warner pages use same Figure architecture
2. **Maintainability**: Single component handles all figures
3. **Performance**: No popup windows, faster UX
4. **SEO**: Content and images properly integrated
5. **Accessibility**: Better alt text, semantic HTML
6. **Mobile**: Better responsive behavior without popups
7. **Code cleanup**: Remove 26 legacy HTML files

---

## Risks and Mitigation

**Risk 1: Missing Images**
- **Mitigation**: Source images before migration, or create placeholders

**Risk 2: Breaking External Links**
- **Mitigation**: Keep HTML files initially, add redirects, gradual sunset

**Risk 3: Incorrect Inline Placement**
- **Mitigation**: Careful reading of each document, user review before commit

**Risk 4: Lost Context**
- **Mitigation**: Maintain figure captions from original link text

---

## Timeline Estimate

- **Audit & Image Sourcing**: 2-4 hours
- **Script Development**: 2-3 hours  
- **w-epasab1990.md Migration**: 1-2 hours
- **w-pub-seif-iv.md Migration**: 1-2 hours
- **Testing & QA**: 2 hours
- **Total**: 8-13 hours

---

## Next Steps

1. **Get user approval** on approach
2. **Run audit script** to catalog all HTML files and images
3. **Source missing images** (especially 1990 SAB figures)
4. **Start with w-epasab1990.md** as pilot migration
5. **Review results** before proceeding to other pages
6. **Complete remaining migrations**
7. **Archive HTML files** after verification period
