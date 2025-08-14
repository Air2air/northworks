#!/usr/bin/env node

/**
 * Fix UI Component Imports Script
 * Updates all import references from the deleted index.ts to direct imports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();

// Mapping of component names to their files
const componentMap = {
  'PageTitle': 'PageTitle',
  'NavigationCard': 'NavigationCard', 
  'ContentCard': 'ContentCard',
  'ProfessionalLists': 'ProfessionalLists',
  'Navigation': 'Navigation',
  'FilterableCollection': 'FilterableCollection',
  'LazyImage': 'LazyImage'
};

// Components that were deleted
const deletedComponents = [
  'PageHeader',
  'StatsGrid', 
  'QuickAccessLinks',
  'FeatureSection',
  'Sidebar'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file imports from '@/components/ui'
    if (content.includes("from '@/components/ui'")) {
      console.log(`Fixing: ${filePath}`);
      
      // Extract the import statement
      const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui['"]/);
      
      if (importMatch) {
        const importedComponents = importMatch[1]
          .split(',')
          .map(c => c.trim())
          .filter(c => c && !c.startsWith('type'));
        
        const typeImports = importMatch[1]
          .split(',')
          .map(c => c.trim())
          .filter(c => c.startsWith('type'));
        
        let newImports = [];
        let validComponents = [];
        
        // Process each imported component
        importedComponents.forEach(comp => {
          if (componentMap[comp]) {
            newImports.push(`import ${comp} from '@/components/ui/${componentMap[comp]}';`);
            validComponents.push(comp);
          } else if (deletedComponents.includes(comp)) {
            console.log(`  - Removing deleted component: ${comp}`);
          } else {
            console.log(`  - Unknown component: ${comp}`);
          }
        });
        
        // Replace the import statement
        if (newImports.length > 0) {
          content = content.replace(
            /import\s+{[^}]+}\s+from\s+['"]@\/components\/ui['"];?/,
            newImports.join('\n')
          );
          
          // Remove type imports if all components were removed
          if (typeImports.length > 0 && validComponents.length === 0) {
            content = content.replace(
              /import\s+type\s+{[^}]+}\s+from\s+['"]@\/components\/ui['"];?\n?/,
              ''
            );
          }
          
          modified = true;
        } else {
          // Remove the entire import if no valid components
          content = content.replace(
            /import\s+{[^}]+}\s+from\s+['"]@\/components\/ui['"];?\n?/,
            ''
          );
          content = content.replace(
            /import\s+type\s+{[^}]+}\s+from\s+['"]@\/components\/ui['"];?\n?/,
            ''
          );
          modified = true;
        }
        
        // Clean up any usage of deleted components
        deletedComponents.forEach(comp => {
          const regex = new RegExp(`<${comp}[^>]*>.*?<\/${comp}>`, 'gs');
          if (content.match(regex)) {
            console.log(`  - Removing usage of deleted component: ${comp}`);
            content = content.replace(regex, '');
            modified = true;
          }
          
          // Also remove self-closing tags
          const selfClosingRegex = new RegExp(`<${comp}[^>]*\/>`, 'g');
          if (content.match(selfClosingRegex)) {
            console.log(`  - Removing self-closing tag of deleted component: ${comp}`);
            content = content.replace(selfClosingRegex, '');
            modified = true;
          }
        });
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`  ✅ Fixed`);
      }
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function scanAndFixDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanAndFixDirectory(fullPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      fixFile(fullPath);
    }
  });
}

console.log('🔧 Fixing UI component imports...\n');

// Scan and fix all files in src
const srcDir = path.join(projectRoot, 'src');
scanAndFixDirectory(srcDir);

console.log('\n✅ Import fixes complete!');
