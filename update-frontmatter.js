#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get list of files to process
const { execSync } = require('child_process');
const fileListCommand = `find public/content -name "c-*.md" | grep -v "c-art" | grep -v "c-articles" | grep -v "c-reviews"`;
const fileList = execSync(fileListCommand, { encoding: 'utf8' }).trim().split('\n');

console.log(`🔄 Processing ${fileList.length} files to set type: interview`);

let updatedFiles = 0;
let errorFiles = 0;

fileList.forEach((filePath) => {
  try {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if file has frontmatter
    if (!content.startsWith('---')) {
      console.log(`⚠️  Skipping ${filePath} - no frontmatter found`);
      return;
    }
    
    // Split frontmatter and content
    const parts = content.split('---');
    if (parts.length < 3) {
      console.log(`⚠️  Skipping ${filePath} - invalid frontmatter format`);
      return;
    }
    
    let frontmatter = parts[1];
    const bodyContent = parts.slice(2).join('---');
    
    // Check if type field already exists
    if (frontmatter.includes('type:')) {
      // Replace existing type field
      frontmatter = frontmatter.replace(/type:\s*.*$/m, 'type: interview');
      console.log(`✏️  Updated existing type field in ${path.basename(filePath)}`);
    } else {
      // Add type field at the end of frontmatter
      frontmatter = frontmatter.trimEnd() + '\ntype: interview\n';
      console.log(`➕ Added type field to ${path.basename(filePath)}`);
    }
    
    // Reconstruct the file
    const newContent = `---${frontmatter}---${bodyContent}`;
    fs.writeFileSync(fullPath, newContent);
    updatedFiles++;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errorFiles++;
  }
});

console.log(`\n✅ Processing complete!`);
console.log(`   Updated files: ${updatedFiles}`);
console.log(`   Error files: ${errorFiles}`);
console.log(`   Total processed: ${fileList.length}`);
