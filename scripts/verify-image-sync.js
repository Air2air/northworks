#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../public/content');
const DATA_DIR = path.join(__dirname, '../src/data/normalized');

// Load JSON data
function loadJsonData() {
  const jsonFiles = [
    'cheryl-interviews.json',
    'cheryl-articles.json', 
    'cheryl-reviews.json'
  ];
  
  const allData = {};
  
  jsonFiles.forEach(filename => {
    const filepath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filepath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        if (data.items) {
          data.items.forEach(item => {
            if (item.id) {
              allData[item.id] = item;
            }
          });
        }
      } catch (error) {
        console.error(`Error loading ${filename}:`, error.message);
      }
    }
  });
  
  return allData;
}

// Parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: '', body: content };
  }
  
  return {
    frontmatter: match[1],
    body: match[2]
  };
}

// Check if frontmatter has images
function hasImages(frontmatter) {
  return frontmatter.includes('images:') && frontmatter.match(/images:\s*\n\s*-\s*src:/);
}

// Main function
function main() {
  console.log('🔍 Verifying image sync between JSON and frontmatter...\n');
  
  const jsonData = loadJsonData();
  console.log(`📂 Loaded ${Object.keys(jsonData).length} items from JSON files\n`);
  
  const markdownFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(CONTENT_DIR, file));
  
  let jsonHasImages = 0;
  let frontmatterHasImages = 0;
  let bothHaveImages = 0;
  let neitherHasImages = 0;
  
  const mismatches = [];
  
  markdownFiles.forEach(filepath => {
    const filename = path.basename(filepath, '.md');
    const fileId = filename.replace(/^c_/, 'c-').replace(/_/g, '-');
    
    const content = fs.readFileSync(filepath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    
    const jsonItem = jsonData[fileId];
    const hasJsonImages = jsonItem && jsonItem.media && jsonItem.media.length > 0;
    const hasFrontmatterImages = hasImages(frontmatter);
    
    if (hasJsonImages) jsonHasImages++;
    if (hasFrontmatterImages) frontmatterHasImages++;
    
    if (hasJsonImages && hasFrontmatterImages) {
      bothHaveImages++;
    } else if (!hasJsonImages && !hasFrontmatterImages) {
      neitherHasImages++;
    } else {
      mismatches.push({
        id: fileId,
        hasJsonImages,
        hasFrontmatterImages
      });
    }
  });
  
  console.log('📊 Results:');
  console.log(`   Total files: ${markdownFiles.length}`);
  console.log(`   JSON has images: ${jsonHasImages}`);
  console.log(`   Frontmatter has images: ${frontmatterHasImages}`);
  console.log(`   Both have images: ${bothHaveImages}`);
  console.log(`   Neither has images: ${neitherHasImages}`);
  console.log(`   Mismatches: ${mismatches.length}`);
  
  if (mismatches.length > 0) {
    console.log('\n⚠️  Mismatches found:');
    mismatches.forEach(mismatch => {
      const status = mismatch.hasJsonImages ? 'JSON only' : 'Frontmatter only';
      console.log(`   ${mismatch.id}: ${status}`);
    });
  } else {
    console.log('\n✅ Perfect sync! All files have matching image data.');
  }
}

if (require.main === module) {
  main();
}
