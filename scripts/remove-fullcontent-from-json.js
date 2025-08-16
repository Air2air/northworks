#!/usr/bin/env node

/**
 * Remove fullContent from JSON files to reduce bundle size
 * Keep markdown files as the source of truth for full content
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'src', 'data');
const jsonFiles = [
  'cheryl-reviews.json',
  'cheryl-interviews.json',
  'cheryl-articles.json',
  'warner-professional.json',
  'warner-publications.json',
  'warner-background.json'
];

let totalRemoved = 0;
let totalSizeReduction = 0;

function removeFullContent(data, filename) {
  let removedCount = 0;
  let sizeReduction = 0;
  
  // Process different JSON structures
  const collections = ['reviews', 'interviews', 'articles', 'professional', 'publications', 'background'];
  
  for (const collection of collections) {
    if (data[collection] && Array.isArray(data[collection])) {
      data[collection].forEach(item => {
        if (item.content && item.content.fullContent) {
          const contentSize = JSON.stringify(item.content.fullContent).length;
          console.log(`  Removing fullContent from "${item.content.title || 'Untitled'}" (${contentSize} chars)`);
          delete item.content.fullContent;
          removedCount++;
          sizeReduction += contentSize;
        }
      });
    }
  }
  
  return { removedCount, sizeReduction };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function processJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return;
  }
  
  try {
    console.log(`\n📁 Processing ${filename}...`);
    
    const originalData = fs.readFileSync(filePath, 'utf8');
    const originalSize = originalData.length;
    const data = JSON.parse(originalData);
    
    const { removedCount, sizeReduction } = removeFullContent(data, filename);
    
    if (removedCount > 0) {
      // Update metadata
      if (data.metadata) {
        data.metadata.lastModified = new Date().toISOString();
      }
      
      // Write back to file
      const newData = JSON.stringify(data, null, 2);
      const newSize = newData.length;
      const actualSizeReduction = originalSize - newSize;
      
      fs.writeFileSync(filePath, newData);
      
      console.log(`✅ Removed ${removedCount} fullContent fields from ${filename}`);
      console.log(`📉 Size reduction: ${formatBytes(actualSizeReduction)} (${originalSize} → ${newSize} bytes)`);
      
      totalRemoved += removedCount;
      totalSizeReduction += actualSizeReduction;
    } else {
      console.log(`ℹ️  No fullContent fields found in ${filename}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

function main() {
  console.log('🧹 Removing fullContent fields from JSON files to reduce bundle size...\n');
  console.log('📝 Note: Markdown files will remain as the source of truth for full content\n');
  
  jsonFiles.forEach(processJsonFile);
  
  console.log(`\n🎉 Process complete!`);
  console.log(`📊 Summary:`);
  console.log(`   • Removed ${totalRemoved} fullContent fields total`);
  console.log(`   • Total size reduction: ${formatBytes(totalSizeReduction)}`);
  console.log(`\n💡 Benefits:`);
  console.log(`   • Reduced JSON bundle size for faster page loads`);
  console.log(`   • Eliminated content duplication`);
  console.log(`   • Markdown files remain authoritative source for individual pages`);
}

if (require.main === module) {
  main();
}

module.exports = { removeFullContent };
