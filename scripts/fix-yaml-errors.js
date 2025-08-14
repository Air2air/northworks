#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Fix YAML parsing errors in markdown files
 */
async function fixYamlErrors() {
  const contentDir = path.join(__dirname, '../public/content');
  
  // Files with known YAML errors from our analysis
  const problematicFiles = [
    'c_bachtrack.md',
    'c_baryshnikov.md',
    'c_delavan.md',
    'c_macdonald.md',
    'c_reviews_BWE_Xerxes_11-10.md',
    'c_reviews_Cal_Symph_9-10.md',
    'c_reviews_criticsnotebook_2011.md',
    'c_reviews_sfopera_gianni_schicchi_2018.md'
  ];
  
  console.log('🔧 Fixing YAML parsing errors...\n');
  
  let fixed = 0;
  let errors = 0;
  
  for (const filename of problematicFiles) {
    const filePath = path.join(contentDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filename}`);
      continue;
    }
    
    try {
      console.log(`🔍 Checking: ${filename}`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Try to parse current YAML
      try {
        matter(fileContent);
        console.log(`✅ ${filename} - YAML is valid`);
        continue;
      } catch (yamlError) {
        console.log(`❌ ${filename} - YAML error: ${yamlError.message}`);
        
        // Fix common YAML issues
        let fixedContent = fixYamlIssues(fileContent, filename);
        
        // Test the fix
        try {
          matter(fixedContent);
          
          // Write back the fixed file
          fs.writeFileSync(filePath, fixedContent);
          console.log(`✅ ${filename} - Fixed and validated`);
          fixed++;
        } catch (stillBroken) {
          console.log(`❌ ${filename} - Still broken after fix: ${stillBroken.message}`);
          errors++;
        }
      }
    } catch (error) {
      console.log(`❌ ${filename} - Read error: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 YAML Fix Summary');
  console.log('='.repeat(50));
  console.log(`✅ Fixed: ${fixed} files`);
  console.log(`❌ Errors: ${errors} files`);
  console.log(`📁 Total processed: ${problematicFiles.length} files`);
  
  if (fixed > 0) {
    console.log('\n🎉 Successfully fixed YAML errors!');
    console.log('You can now run the JSON extraction again with clean data.');
  }
}

/**
 * Fix common YAML issues in content
 */
function fixYamlIssues(content, filename) {
  console.log(`  🔧 Applying fixes to ${filename}...`);
  
  // Split into frontmatter and content
  const parts = content.split('---');
  if (parts.length < 3) {
    console.log(`  ⚠️  No frontmatter found in ${filename}`);
    return content;
  }
  
  let frontmatter = parts[1];
  const bodyContent = parts.slice(2).join('---');
  
  // Common fixes
  const originalFrontmatter = frontmatter;
  
  // Fix 1: Unquoted strings with special characters
  frontmatter = frontmatter.replace(/title: ([^'\n]+[:\-&].+)/g, 'title: \'$1\'');
  
  // Fix 2: Unquoted strings with colons in publication fields
  frontmatter = frontmatter.replace(/publisher: ([^'\n]+:.+)/g, 'publisher: \'$1\'');
  frontmatter = frontmatter.replace(/publication: ([^'\n]+:.+)/g, 'publication: \'$1\'');
  
  // Fix 3: Date formatting issues
  frontmatter = frontmatter.replace(/date: (\d{4}-\d{2}-\d{2}T.+)/g, 'date: \'$1\'');
  
  // Fix 4: Boolean values that should be strings
  frontmatter = frontmatter.replace(/: (true|false)([^\n]*\w)/g, ': \'$1$2\'');
  
  // Fix 5: Escape single quotes in already quoted strings
  frontmatter = frontmatter.replace(/'([^']*)'([^']*)'([^']*)'/g, '"$1\'$2\'$3"');
  
  // Fix 6: Handle multiline strings that aren't properly formatted
  frontmatter = frontmatter.replace(/summary: ([^\n]+\n[^\n]+)/g, 'summary: >\n  $1');
  
  // Fix 7: Fix array formatting issues
  frontmatter = frontmatter.replace(/subjects:\s*\n\s*([^\-\n]+)/g, 'subjects:\n  - $1');
  
  // Fix 8: Handle image arrays with missing dashes
  frontmatter = frontmatter.replace(/images:\s*\n\s*height:/g, 'images:\n  - height:');
  
  if (frontmatter !== originalFrontmatter) {
    console.log(`  ✏️  Applied YAML fixes to ${filename}`);
  }
  
  return `---${frontmatter}---${bodyContent}`;
}

// Run the fixes
if (require.main === module) {
  fixYamlErrors();
}

module.exports = { fixYamlErrors };
