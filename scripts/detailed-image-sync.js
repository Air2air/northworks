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

// Extract image URLs from frontmatter
function extractFrontmatterImages(frontmatter) {
  const images = [];
  const lines = frontmatter.split('\n');
  let inImages = false;
  
  for (const line of lines) {
    if (line.trim() === 'images:') {
      inImages = true;
      continue;
    }
    
    if (inImages) {
      if (line.startsWith('  - src:')) {
        const src = line.replace('  - src:', '').trim();
        images.push(src);
      } else if (line.startsWith('    ')) {
        // Skip image metadata lines
        continue;
      } else if (line.trim() && !line.startsWith('  ')) {
        // End of images section
        break;
      }
    }
  }
  
  return images;
}

// Main function
function main() {
  console.log('🔍 Detailed image sync analysis...\n');
  
  const jsonData = loadJsonData();
  console.log(`📂 Loaded ${Object.keys(jsonData).length} items from JSON files\n`);
  
  const markdownFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(CONTENT_DIR, file));
  
  const jsonOnlyImages = [];
  const frontmatterOnlyImages = [];
  const perfectSync = [];
  const neitherHasImages = [];
  
  markdownFiles.forEach(filepath => {
    const filename = path.basename(filepath, '.md');
    const fileId = filename.replace(/^c_/, 'c-').replace(/_/g, '-');
    
    const content = fs.readFileSync(filepath, 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    
    const jsonItem = jsonData[fileId];
    const hasJsonImages = jsonItem && jsonItem.media && jsonItem.media.length > 0;
    const hasFrontmatterImages = hasImages(frontmatter);
    
    if (hasJsonImages && hasFrontmatterImages) {
      perfectSync.push(fileId);
    } else if (hasJsonImages && !hasFrontmatterImages) {
      const jsonImages = jsonItem.media.map(m => m.url);
      jsonOnlyImages.push({
        id: fileId,
        images: jsonImages
      });
    } else if (!hasJsonImages && hasFrontmatterImages) {
      const frontImages = extractFrontmatterImages(frontmatter);
      frontmatterOnlyImages.push({
        id: fileId,
        images: frontImages
      });
    } else {
      neitherHasImages.push(fileId);
    }
  });
  
  console.log('📊 Detailed Results:');
  console.log(`   Perfect sync (both have images): ${perfectSync.length}`);
  console.log(`   JSON only: ${jsonOnlyImages.length}`);
  console.log(`   Frontmatter only: ${frontmatterOnlyImages.length}`);
  console.log(`   Neither has images: ${neitherHasImages.length}`);
  
  if (jsonOnlyImages.length > 0) {
    console.log('\n🚨 JSON-only images (need to sync to frontmatter):');
    jsonOnlyImages.forEach(item => {
      console.log(`   ${item.id}:`);
      item.images.forEach(img => {
        console.log(`     - ${img}`);
      });
    });
  }
  
  if (frontmatterOnlyImages.length > 0) {
    console.log('\n⚠️  Frontmatter-only images (first 5):');
    frontmatterOnlyImages.slice(0, 5).forEach(item => {
      console.log(`   ${item.id}:`);
      item.images.forEach(img => {
        console.log(`     - ${img}`);
      });
    });
    if (frontmatterOnlyImages.length > 5) {
      console.log(`   ... and ${frontmatterOnlyImages.length - 5} more`);
    }
  }
  
  if (jsonOnlyImages.length === 0) {
    console.log('\n✅ No JSON-only images found! All JSON images are synced to frontmatter.');
  }
}

if (require.main === module) {
  main();
}
