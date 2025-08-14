#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Quick fix for YAML formatting issues in frontmatter
 * Fixes the common pattern: "width: 160publication:" should be "width: 160\npublication:"
 */

const contentDir = path.join(__dirname, '../public/content');

function fixYamlFormatting(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the pattern where publication: is on the same line as width:
    let fixed = content.replace(/(\s+width:\s*\d+)publication:/g, '$1\npublication:');
    
    // Fix other similar patterns where properties are concatenated
    fixed = fixed.replace(/(\s+width:\s*\d+)([a-zA-Z]+:)/g, '$1\n$2');
    fixed = fixed.replace(/(\s+height:\s*\d+)([a-zA-Z]+:)/g, '$1\n$2');
    fixed = fixed.replace(/(\s+src:\s*[^\n]+)([a-zA-Z]+:)/g, '$1\n$2');
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed);
      console.log(`✓ Fixed YAML formatting in ${path.basename(filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing YAML formatting issues...\n');
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  let fixed = 0;
  
  files.forEach(filePath => {
    if (fixYamlFormatting(filePath)) {
      fixed++;
    }
  });
  
  console.log(`\n📊 Fixed YAML formatting in ${fixed} files!`);
}

if (require.main === module) {
  main();
}

module.exports = { fixYamlFormatting };
