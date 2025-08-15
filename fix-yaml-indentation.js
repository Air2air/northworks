#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix YAML indentation
function fixYamlIndentation(content) {
  const lines = content.split('\n');
  const fixedLines = [];
  let inFrontmatter = false;
  let inArray = false;
  let currentArrayIndent = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Start of frontmatter
    if (trimmed === '---' && i === 0) {
      inFrontmatter = true;
      fixedLines.push(line);
      continue;
    }
    
    // End of frontmatter
    if (trimmed === '---' && inFrontmatter) {
      inFrontmatter = false;
      fixedLines.push(line);
      continue;
    }
    
    // If not in frontmatter, just copy the line
    if (!inFrontmatter) {
      fixedLines.push(line);
      continue;
    }
    
    // Empty lines
    if (trimmed === '') {
      fixedLines.push(line);
      continue;
    }
    
    // Check if this is an array item line (starts with -)
    if (trimmed.startsWith('-')) {
      // This is an array item
      if (!inArray) {
        // First array item - determine proper indentation
        inArray = true;
        currentArrayIndent = 2;
      }
      
      // Extract the content after the dash
      const afterDash = trimmed.substring(1).trim();
      
      if (afterDash === '') {
        // Just a dash, likely followed by indented content
        fixedLines.push(`  -`);
      } else {
        // Dash with content on same line
        fixedLines.push(`  - ${afterDash}`);
      }
      continue;
    }
    
    // Check if this is a property of an array item (should be indented more than array)
    if (inArray && (line.startsWith(' ') || line.startsWith('\t'))) {
      // This is likely a property of the current array item
      const property = trimmed;
      
      // Check if this line contains a colon (key: value)
      if (property.includes(':')) {
        fixedLines.push(`    ${property}`);
      } else {
        // Might be a continuation or malformed
        fixedLines.push(`    ${property}`);
      }
      continue;
    }
    
    // Check if this is a top-level property (should reset array mode)
    if (trimmed.includes(':') && !line.startsWith(' ') && !line.startsWith('\t')) {
      inArray = false;
      fixedLines.push(line);
      continue;
    }
    
    // Check if this is a nested property (starts with space but not array item)
    if ((line.startsWith(' ') || line.startsWith('\t')) && !trimmed.startsWith('-')) {
      // This should be indented consistently
      const property = trimmed;
      if (!inArray) {
        // Regular nested property
        fixedLines.push(`  ${property}`);
      } else {
        // Property within an array item
        fixedLines.push(`    ${property}`);
      }
      continue;
    }
    
    // Fallback - if we get here, treat as top-level
    inArray = false;
    fixedLines.push(trimmed);
  }
  
  return fixedLines.join('\n');
}

// Function to process all markdown files in a directory
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let fixed = 0;
  let errors = 0;
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(dirPath, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Only process files that have frontmatter
      if (!content.startsWith('---')) continue;
      
      const fixedContent = fixYamlIndentation(content);
      
      // Only write if content changed
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`Fixed: ${file}`);
        fixed++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      errors++;
    }
  }
  
  console.log(`\nCompleted: ${fixed} files fixed, ${errors} errors`);
  return { fixed, errors };
}

// Main execution
const contentDir = path.join(__dirname, 'public', 'content');

if (!fs.existsSync(contentDir)) {
  console.error('Content directory not found:', contentDir);
  process.exit(1);
}

console.log('Fixing YAML indentation in content files...');
console.log('Content directory:', contentDir);
console.log('');

const result = processDirectory(contentDir);

if (result.errors === 0) {
  console.log('\n✅ All files processed successfully!');
} else {
  console.log(`\n⚠️  Completed with ${result.errors} errors`);
}
