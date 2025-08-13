#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing double slash issues in Image components...\n');

// Find all TypeScript files in src directory
const files = glob.sync('src/**/*.tsx', { cwd: process.cwd() });

let fixedCount = 0;
let totalMatches = 0;

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Pattern 1: src={`/${something.src}`} -> src={something.src}
  const pattern1 = /src=\{`\/\$\{([^}]+\.src)\}`\}/g;
  const matches1 = content.match(pattern1);
  if (matches1) {
    totalMatches += matches1.length;
    content = content.replace(pattern1, 'src={$1}');
    modified = true;
    console.log(`  Fixed ${matches1.length} matches in: ${filePath}`);
  }
  
  // Pattern 2: src={`/${variable}`} where variable might contain image paths
  const pattern2 = /src=\{`\/\$\{([^}]+)\}`\}/g;
  const matches2 = content.match(pattern2);
  if (matches2) {
    // Only replace if it looks like it might be an image path
    content = content.replace(pattern2, (match, variable) => {
      if (variable.includes('.src') || variable.includes('image') || variable.includes('Image')) {
        return `src={${variable}}`;
      }
      return match; // Don't modify if it doesn't look like an image path
    });
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed double slash issues in ${fixedCount} files.`);
console.log(`📊 Total pattern matches processed: ${totalMatches}`);
console.log('\n✨ All Image components should now have correct paths!');
