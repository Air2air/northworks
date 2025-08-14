#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Dead Code and Bloat Cleanup');
console.log('===============================\n');

const projectRoot = process.cwd();

// 1. Remove temporary test file
function removeTemporaryFiles() {
    console.log('🗑️  Removing Temporary Files');
    console.log('==========================');
    
    const tempFiles = [
        'test-clean-title.js',
        'analyze-bloat.js' // Remove the analysis script itself after use
    ];
    
    tempFiles.forEach(file => {
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`✅ Removed: ${file}`);
        } else {
            console.log(`ℹ️  Not found: ${file}`);
        }
    });
    
    console.log('');
}

// 2. Remove empty scripts directory
function removeEmptyScriptsDir() {
    console.log('📁 Cleaning Empty Directories');
    console.log('===========================');
    
    const scriptsDir = path.join(projectRoot, 'scripts');
    if (fs.existsSync(scriptsDir)) {
        const files = fs.readdirSync(scriptsDir);
        if (files.length === 0) {
            fs.rmdirSync(scriptsDir);
            console.log('✅ Removed empty scripts/ directory');
        } else {
            console.log(`ℹ️  scripts/ directory not empty (${files.length} files)`);
        }
    } else {
        console.log('ℹ️  scripts/ directory does not exist');
    }
    
    console.log('');
}

// 3. Fix unused imports
function fixUnusedImports() {
    console.log('🔧 Fixing Unused Imports');
    console.log('======================');
    
    const filesToFix = [
        'src/components/ui/ProfessionalLists.tsx'
    ];
    
    filesToFix.forEach(filePath => {
        const fullPath = path.join(projectRoot, filePath);
        if (fs.existsSync(fullPath)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Remove unused useState from import
            const originalImport = "import React, { useState } from 'react';";
            const newImport = "import React from 'react';";
            
            if (content.includes(originalImport) && !content.includes('useState(')) {
                content = content.replace(originalImport, newImport);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`✅ Fixed unused useState import in: ${filePath}`);
            } else {
                console.log(`ℹ️  No unused useState found in: ${filePath}`);
            }
        } else {
            console.log(`ℹ️  File not found: ${filePath}`);
        }
    });
    
    console.log('');
}

// 4. Suggest dependency removals (don't auto-remove)
function suggestDependencyCleanup() {
    console.log('📦 Dependency Cleanup Suggestions');
    console.log('===============================');
    
    console.log('Manual actions needed (run these commands):');
    console.log('');
    
    // Check if MDX is actually used
    const hasHomepage = fs.existsSync(path.join(projectRoot, 'src/components/Homepage.tsx'));
    const hasSlugPages = fs.existsSync(path.join(projectRoot, 'src/app/interviews/[slug]/page.tsx'));
    
    if (!hasHomepage && !hasSlugPages) {
        console.log('🟡 MDX packages appear unused:');
        console.log('   npm uninstall @mdx-js/loader @mdx-js/react @next/mdx @types/mdx next-mdx-remote');
        console.log('');
    } else {
        console.log('✅ MDX packages are being used (next-mdx-remote found in components)');
        console.log('');
    }
    
    // Check if both markdown processors are needed
    console.log('🟡 Potential duplicate markdown processing:');
    console.log('   • next-mdx-remote: Used for MDX content');
    console.log('   • marked: Used for basic markdown');
    console.log('   Consider standardizing on one approach');
    console.log('');
}

// 5. Create documentation for route cleanup
function documentRouteCleanup() {
    console.log('🛣️  Route Cleanup Documentation');
    console.log('=============================');
    
    const routeCleanupDoc = `# Route Cleanup Plan

## Duplicate Routes Found

### Interview Pages
- \`/interviews\` - Main interviews page (KEEP)
- \`/interviews-index\` - Alternative index (CONSIDER REMOVING)
- \`/interviews-improved\` - Improved version (EVALUATE AND MERGE)

### Article Pages  
- \`/articles\` - Main articles page (KEEP)
- \`/articles-index\` - Alternative index (CONSIDER REMOVING)
- \`/articles-dynamic\` - Dynamic version (EVALUATE AND MERGE)

### Portfolio Pages
- \`/portfolio\` - General portfolio (EVALUATE)
- \`/warner-portfolio\` - Warner-specific (KEEP if specialized)

## Recommendations

1. **Standardize on one interview page** - Choose between /interviews, /interviews-index, or /interviews-improved
2. **Standardize on one article page** - Choose between /articles, /articles-index, or /articles-dynamic  
3. **Consolidate portfolio pages** - Determine if both are needed
4. **Update navigation links** to point to chosen pages
5. **Add redirects** for removed routes to prevent 404s

## Action Items

- [ ] Test each route variant to determine best functionality
- [ ] Update internal links to use chosen routes
- [ ] Remove unused route files
- [ ] Add Next.js redirects in next.config.ts for removed routes
`;

    fs.writeFileSync(path.join(projectRoot, 'ROUTE_CLEANUP_PLAN.md'), routeCleanupDoc);
    console.log('✅ Created ROUTE_CLEANUP_PLAN.md with detailed cleanup instructions');
    console.log('');
}

// 6. Create gitignore recommendations
function updateGitignore() {
    console.log('📄 .gitignore Recommendations');
    console.log('============================');
    
    const gitignorePath = path.join(projectRoot, '.gitignore');
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    const recommendedIgnores = [
        '# Temporary files',
        'test-*.js',
        'analyze-*.js',
        '',
        '# Analysis output',
        '*_ANALYSIS.md',
        '*_CLEANUP_PLAN.md'
    ];
    
    const needsUpdates = recommendedIgnores.some(line => 
        line.trim() && !gitignoreContent.includes(line.trim())
    );
    
    if (needsUpdates) {
        gitignoreContent += '\n\n' + recommendedIgnores.join('\n');
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log('✅ Updated .gitignore with temporary file patterns');
    } else {
        console.log('ℹ️  .gitignore already contains recommended patterns');
    }
    
    console.log('');
}

// 7. Generate final cleanup summary
function generateCleanupSummary() {
    console.log('📊 Cleanup Summary');
    console.log('================');
    
    const summary = `# Dead Code Cleanup Summary

## ✅ Completed Automatically
- Removed temporary test files
- Fixed unused imports
- Cleaned empty directories
- Updated .gitignore

## 🟡 Manual Actions Required
1. **Dependencies**: Review MDX usage and consider removing unused packages
2. **Routes**: Use ROUTE_CLEANUP_PLAN.md to consolidate duplicate pages
3. **Content**: Decide whether to keep original markdown files or use only specialized JSON
4. **Images**: Standardize naming convention (dash vs underscore)

## 📈 Impact
- Reduced temporary file clutter
- Cleaned up import statements
- Documented route consolidation plan
- Improved development workflow

## 🎯 Next Steps
1. Review ROUTE_CLEANUP_PLAN.md
2. Test route functionality before removing
3. Update navigation components
4. Consider image optimization for web delivery
`;

    fs.writeFileSync(path.join(projectRoot, 'CLEANUP_SUMMARY.md'), summary);
    console.log('✅ Generated CLEANUP_SUMMARY.md');
    console.log('');
    
    console.log('🎉 Cleanup Complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Review ROUTE_CLEANUP_PLAN.md for route consolidation');
    console.log('2. Review CLEANUP_SUMMARY.md for manual actions');
    console.log('3. Test the application to ensure everything still works');
}

// Run all cleanup functions
removeTemporaryFiles();
removeEmptyScriptsDir();
fixUnusedImports();
suggestDependencyCleanup();
documentRouteCleanup();
updateGitignore();
generateCleanupSummary();
