#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../public/content');
const DATA_DIR = path.join(__dirname, '../src/data/normalized');

// Load JSON data
function loadJsonFile(filename) {
  const filepath = path.join(DATA_DIR, filename);
  if (fs.existsSync(filepath)) {
    try {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    } catch (error) {
      console.error(`Error loading ${filename}:`, error.message);
      return null;
    }
  }
  return null;
}

// Save JSON data
function saveJsonFile(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error saving ${filename}:`, error.message);
    return false;
  }
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

// Extract images from frontmatter
function extractFrontmatterImages(frontmatter) {
  const images = [];
  const lines = frontmatter.split('\n');
  let inImages = false;
  let currentImage = {};
  
  for (const line of lines) {
    if (line.trim() === 'images:') {
      inImages = true;
      continue;
    }
    
    if (inImages) {
      if (line.startsWith('  - src:')) {
        // Save previous image if exists
        if (currentImage.url) {
          images.push({ ...currentImage });
        }
        // Start new image
        currentImage = {
          url: line.replace('  - src:', '').trim(),
          type: 'image',
          variant: 'thumbnail',
          usage: images.length === 0 ? 'primary' : 'secondary'
        };
      } else if (line.startsWith('    alt:')) {
        currentImage.alt = line.replace('    alt:', '').trim();
      } else if (line.startsWith('    caption:')) {
        currentImage.caption = line.replace('    caption:', '').trim();
      } else if (line.startsWith('    width:')) {
        currentImage.width = parseInt(line.replace('    width:', '').trim()) || null;
      } else if (line.startsWith('    height:')) {
        currentImage.height = parseInt(line.replace('    height:', '').trim()) || null;
      } else if (line.trim() && !line.startsWith('  ') && !line.startsWith('    ')) {
        // End of images section
        if (currentImage.url) {
          images.push({ ...currentImage });
        }
        break;
      }
    }
  }
  
  // Don't forget the last image
  if (inImages && currentImage.url) {
    images.push({ ...currentImage });
  }
  
  // Clean up images - set defaults
  return images.map(img => ({
    url: img.url,
    type: 'image',
    alt: img.alt || null,
    title: null,
    caption: img.caption || null,
    width: img.width || null,
    height: img.height || null,
    variant: 'thumbnail',
    usage: img.usage || 'secondary'
  }));
}

// Check if frontmatter has images
function hasImages(frontmatter) {
  return frontmatter.includes('images:') && frontmatter.match(/images:\s*\n\s*-\s*src:/);
}

// Find item in JSON data by ID
function findJsonItem(jsonData, itemId) {
  if (!jsonData || !jsonData.items) return null;
  return jsonData.items.find(item => item.id === itemId);
}

// Update JSON item with frontmatter images
function updateJsonItemImages(item, frontmatterImages) {
  if (!item.media) {
    item.media = [];
  }
  
  // Remove existing images
  item.media = item.media.filter(media => media.type !== 'image');
  
  // Add frontmatter images
  item.media.push(...frontmatterImages);
  
  return true;
}

// Get collection filename for content type
function getCollectionFilename(fileId) {
  // Most content goes to interviews
  if (fileId.startsWith('c-')) {
    // Check if it's a review
    if (fileId.includes('review')) {
      return 'cheryl-reviews.json';
    }
    // Check if it's an article  
    if (fileId.includes('art-') || fileId.includes('article')) {
      return 'cheryl-articles.json';
    }
    // Default to interviews
    return 'cheryl-interviews.json';
  }
  
  // Warner content (w- prefix)
  if (fileId.startsWith('w-')) {
    if (fileId.includes('pub')) {
      return 'warner-publications.json';
    }
    if (fileId.includes('background')) {
      return 'warner-background.json';
    }
    return 'warner-professional.json';
  }
  
  // Default fallback
  return 'cheryl-interviews.json';
}

// Main function
function main() {
  console.log('🔄 Syncing frontmatter images back to JSON files...\n');
  
  // Get all markdown files
  const markdownFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(CONTENT_DIR, file));
  
  console.log(`📄 Found ${markdownFiles.length} markdown files\n`);
  
  // Track changes by JSON file
  const jsonFiles = {
    'cheryl-interviews.json': null,
    'cheryl-articles.json': null,
    'cheryl-reviews.json': null,
    'warner-professional.json': null,
    'warner-publications.json': null,
    'warner-background.json': null
  };
  
  let processedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  
  markdownFiles.forEach(filepath => {
    const filename = path.basename(filepath, '.md');
    const fileId = filename.replace(/^c_/, 'c-').replace(/_/g, '-');
    
    console.log(`Processing: ${filename} (ID: ${fileId})`);
    
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const { frontmatter } = parseFrontmatter(content);
      
      // Check if frontmatter has images
      if (!hasImages(frontmatter)) {
        console.log(`  - No frontmatter images found`);
        skippedCount++;
        processedCount++;
        return;
      }
      
      // Extract frontmatter images
      const frontmatterImages = extractFrontmatterImages(frontmatter);
      if (frontmatterImages.length === 0) {
        console.log(`  - No valid images extracted from frontmatter`);
        skippedCount++;
        processedCount++;
        return;
      }
      
      console.log(`  ✓ Found ${frontmatterImages.length} image(s) in frontmatter`);
      
      // Determine which JSON file to update
      const jsonFilename = getCollectionFilename(fileId);
      
      // Load JSON file if not already loaded
      if (!jsonFiles[jsonFilename]) {
        jsonFiles[jsonFilename] = loadJsonFile(jsonFilename);
        if (!jsonFiles[jsonFilename]) {
          console.log(`  ❌ Could not load ${jsonFilename}`);
          processedCount++;
          return;
        }
      }
      
      // Find the item in JSON
      const jsonItem = findJsonItem(jsonFiles[jsonFilename], fileId);
      if (!jsonItem) {
        console.log(`  ⚠️  Item not found in ${jsonFilename}`);
        skippedCount++;
        processedCount++;
        return;
      }
      
      // Check if JSON already has images
      const hasJsonImages = jsonItem.media && jsonItem.media.some(m => m.type === 'image');
      if (hasJsonImages) {
        console.log(`  ✓ Already has images in JSON, skipping`);
        skippedCount++;
        processedCount++;
        return;
      }
      
      // Update JSON item with frontmatter images
      updateJsonItemImages(jsonItem, frontmatterImages);
      console.log(`  ✅ Added ${frontmatterImages.length} image(s) to JSON`);
      
      updatedCount++;
      processedCount++;
      
    } catch (error) {
      console.error(`  ❌ Error processing ${filename}:`, error.message);
      processedCount++;
    }
  });
  
  // Save updated JSON files
  console.log('\n💾 Saving updated JSON files...');
  let savedCount = 0;
  
  Object.entries(jsonFiles).forEach(([filename, data]) => {
    if (data) {
      if (saveJsonFile(filename, data)) {
        console.log(`  ✅ Saved ${filename}`);
        savedCount++;
      } else {
        console.log(`  ❌ Failed to save ${filename}`);
      }
    }
  });
  
  console.log(`\n🎉 Sync complete!`);
  console.log(`   Processed: ${processedCount} files`);
  console.log(`   Updated: ${updatedCount} files`);
  console.log(`   Skipped: ${skippedCount} files`);
  console.log(`   JSON files saved: ${savedCount}`);
  
  if (updatedCount > 0) {
    console.log(`\n✨ ${updatedCount} items now have images in both frontmatter and JSON!`);
    console.log(`   This will improve thumbnail display in card/list views.`);
  }
}

if (require.main === module) {
  main();
}
