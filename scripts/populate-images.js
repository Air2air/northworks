#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../public/content');
const IMAGES_DIR = path.join(__dirname, '../public/images');
const DATA_DIR = path.join(__dirname, '../src/data/normalized');

// Load normalized JSON data
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
        // Extract items from the data structure
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

// Get available image files
function getAvailableImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    return [];
  }
  
  return fs.readdirSync(IMAGES_DIR)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => ({
      filename: file,
      basename: path.parse(file).name.toLowerCase()
    }));
}

// Extract inline images from markdown content
function extractInlineImages(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const alt = match[1] || '';
    const src = match[2];
    
    // Only process local images (not external URLs)
    if (!src.startsWith('http') && !src.startsWith('//')) {
      images.push({
        src: src.startsWith('/') ? src : `/${src}`,
        alt: alt
      });
    }
  }
  
  return images;
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

// Convert images array to YAML string
function imagesToYaml(images) {
  if (!images || images.length === 0) {
    return '';
  }
  
  let yaml = 'images:\n';
  images.forEach(img => {
    yaml += `  - src: ${img.src}\n`;
    if (img.alt) yaml += `    alt: ${img.alt}\n`;
    if (img.caption) yaml += `    caption: ${img.caption}\n`;
    if (img.width) yaml += `    width: ${img.width}\n`;
    if (img.height) yaml += `    height: ${img.height}\n`;
  });
  
  return yaml;
}

// Update frontmatter with images
function updateFrontmatter(frontmatter, images) {
  const lines = frontmatter.split('\n');
  const newLines = [];
  let imagesLineIndex = -1;
  let inImagesSection = false;
  
  // Find existing images section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === 'images:') {
      imagesLineIndex = i;
      inImagesSection = true;
      continue;
    }
    
    if (inImagesSection) {
      // Skip existing images content until we hit a non-indented line
      if (line.startsWith('  ') || line.trim() === '') {
        continue;
      } else {
        inImagesSection = false;
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }
  
  // Insert or replace images section
  if (images && images.length > 0) {
    const yamlImages = imagesToYaml(images);
    if (imagesLineIndex >= 0) {
      // Replace existing images section
      newLines.splice(imagesLineIndex, 0, yamlImages.trim());
    } else {
      // Add images section after id line
      const idIndex = newLines.findIndex(line => line.startsWith('id:'));
      if (idIndex >= 0) {
        newLines.splice(idIndex + 1, 0, yamlImages.trim());
      } else {
        // Add at beginning
        newLines.unshift(yamlImages.trim());
      }
    }
  }
  
  return newLines.join('\n');
}

// Deduplicate images by src, keeping the most complete metadata
function deduplicateImages(images) {
  if (!images || images.length === 0) return images;
  
  const imageMap = new Map();
  
  images.forEach(image => {
    const existing = imageMap.get(image.src);
    
    if (!existing) {
      imageMap.set(image.src, image);
    } else {
      // Merge metadata, preferring non-empty values
      const merged = {
        src: image.src,
        alt: existing.alt || image.alt || '',
        caption: existing.caption || image.caption || undefined,
        width: existing.width || image.width || undefined,
        height: existing.height || image.height || undefined
      };
      
      // If both have alt text, prefer the more descriptive one (longer)
      if (existing.alt && image.alt && image.alt.length > existing.alt.length) {
        merged.alt = image.alt;
      }
      
      imageMap.set(image.src, merged);
    }
  });
  
  return Array.from(imageMap.values());
}

// Case 1: JSON media data
function getImagesFromJson(fileId, jsonData) {
  const item = jsonData[fileId];
  if (!item || !item.media) {
    return [];
  }
  
  return item.media
    .filter(media => media.type === 'image')
    .map(media => ({
      src: media.url,
      alt: media.alt || '',
      caption: media.caption || undefined,
      width: media.width || undefined,
      height: media.height || undefined
    }));
}

// Case 2: Inline markdown images
function getImagesFromInline(content) {
  return extractInlineImages(content);
}

// Case 3: Filename matching
function getImagesFromFilename(fileId, availableImages) {
  const baseId = fileId.replace(/^c[-_]/, '').toLowerCase();
  const matchingImages = [];
  
  // Direct filename match
  const directMatch = availableImages.find(img => 
    img.basename === baseId || 
    img.basename === fileId.toLowerCase() ||
    img.basename.includes(baseId) ||
    baseId.includes(img.basename)
  );
  
  if (directMatch) {
    matchingImages.push({
      src: `/images/${directMatch.filename}`,
      alt: fileId
    });
  }
  
  // For articles and reviews, also try matching key terms from the ID
  if (matchingImages.length === 0 && (fileId.includes('art-') || fileId.includes('reviews-'))) {
    // Extract keywords from the file ID
    const keywords = fileId.split('-').filter(word => 
      word.length > 3 && !['art', 'reviews', 'sfs', 'sfo', 'oebs', 'lvo'].includes(word)
    );
    
    for (const keyword of keywords) {
      const keywordMatch = availableImages.find(img => 
        img.basename.includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(img.basename)
      );
      
      if (keywordMatch) {
        matchingImages.push({
          src: `/images/${keywordMatch.filename}`,
          alt: `${fileId} - ${keyword}`
        });
        break; // Only take the first match to avoid too many images
      }
    }
  }
  
  return matchingImages;
}

// Remove duplicate inline images that are already in frontmatter
function removeDuplicateInlineImages(body, frontmatterImages) {
  if (!frontmatterImages || frontmatterImages.length === 0) {
    return body;
  }
  
  // Get all src URLs from frontmatter images
  const frontmatterSrcs = frontmatterImages.map(img => {
    // Normalize the src path
    let src = img.src;
    if (!src.startsWith('/')) src = '/' + src;
    return src;
  });
  
  console.log(`    Checking for duplicate inline images against ${frontmatterSrcs.length} frontmatter image(s)`);
  
  // Pattern to match markdown images: ![alt](src)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let updatedBody = body;
  let removedCount = 0;
  
  // Find all inline images
  const inlineImages = [];
  let match;
  while ((match = imageRegex.exec(body)) !== null) {
    const alt = match[1] || '';
    let src = match[2];
    
    // Normalize the src path
    if (!src.startsWith('http') && !src.startsWith('//')) {
      if (!src.startsWith('/')) src = '/' + src;
      
      // Check if this image is already in frontmatter
      if (frontmatterSrcs.includes(src)) {
        inlineImages.push({
          fullMatch: match[0],
          src: src,
          alt: alt
        });
      }
    }
  }
  
  // Remove duplicate inline images
  inlineImages.forEach(img => {
    // Replace the full markdown image syntax with empty string
    // Also remove any surrounding whitespace/newlines to avoid gaps
    const patterns = [
      // Image on its own line with potential whitespace
      new RegExp(`\\s*${escapeRegex(img.fullMatch)}\\s*\\n?`, 'g'),
      // Image inline within text
      new RegExp(`\\s*${escapeRegex(img.fullMatch)}\\s*`, 'g')
    ];
    
    let removed = false;
    patterns.forEach(pattern => {
      if (!removed && updatedBody.includes(img.fullMatch)) {
        const beforeLength = updatedBody.length;
        updatedBody = updatedBody.replace(pattern, ' ').replace(/\s+/g, ' ').trim();
        if (updatedBody.length < beforeLength) {
          removed = true;
          removedCount++;
          console.log(`    ✓ Removed duplicate inline image: ${img.src}`);
        }
      }
    });
  });
  
  if (removedCount > 0) {
    console.log(`    ✓ Removed ${removedCount} duplicate inline image(s)`);
  }
  
  return updatedBody;
}

// Helper function to escape special regex characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Process a single markdown file
function processMarkdownFile(filepath, jsonData, availableImages, forceUpdate = false) {
  const filename = path.basename(filepath, '.md');
  const fileId = filename.replace(/^c_/, 'c-').replace(/_/g, '-');
  
  console.log(`Processing: ${filename} (ID: ${fileId})`);
  
  const content = fs.readFileSync(filepath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Check if images already exist and are populated
  // Only skip if there are actual image entries with src AND not in force mode
  if (!forceUpdate && frontmatter.includes('images:') && frontmatter.match(/images:\s*\n\s*-\s*src:/)) {
    console.log(`  ✓ Already has images, skipping`);
    return false;
  }
  
  // Check if images section exists but is empty (images: followed by next section)
  const hasEmptyImages = frontmatter.match(/images:\s*\n(?=\w)/);
  
  let images = [];
  
  // Case 1: JSON media data
  const jsonImages = getImagesFromJson(fileId, jsonData);
  if (jsonImages.length > 0) {
    images = jsonImages;
    console.log(`  ✓ Found ${jsonImages.length} image(s) from JSON data`);
  }
  
  // Case 2: Inline markdown images (if no JSON images found)
  if (images.length === 0) {
    const inlineImages = getImagesFromInline(body);
    if (inlineImages.length > 0) {
      images = inlineImages;
      console.log(`  ✓ Found ${inlineImages.length} inline image(s)`);
    }
  }
  
  // Case 3: Filename matching (if no other images found)
  if (images.length === 0) {
    const filenameImages = getImagesFromFilename(fileId, availableImages);
    if (filenameImages.length > 0) {
      images = filenameImages;
      console.log(`  ✓ Found ${filenameImages.length} image(s) by filename matching`);
    }
  }
  
  if (images.length === 0) {
    console.log(`  - No images found for ${filename}`);
    return false;
  }
  
  // Deduplicate images by src URL
  const uniqueImages = deduplicateImages(images);
  const duplicatesRemoved = images.length - uniqueImages.length;
  
  if (duplicatesRemoved > 0) {
    console.log(`  ✓ Removed ${duplicatesRemoved} duplicate image(s) from frontmatter`);
  }
  
  // Remove any inline images that are now duplicated by frontmatter images
  const cleanedBody = removeDuplicateInlineImages(body, uniqueImages);
  
  // Update frontmatter
  const updatedFrontmatter = updateFrontmatter(frontmatter, uniqueImages);
  const updatedContent = `---\n${updatedFrontmatter}\n---\n${cleanedBody}`;
  
  // Write back to file
  fs.writeFileSync(filepath, updatedContent, 'utf8');
  console.log(`  ✓ Updated ${filename} with ${uniqueImages.length} unique image(s)`);
  
  return true;
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const forceUpdate = args.includes('--force') || args.includes('-f');
  
  console.log('🖼️  Starting automated image population...');
  if (forceUpdate) {
    console.log('⚡ Force mode enabled - will reprocess files with existing images\n');
  } else {
    console.log('');
  }
  
  // Load data
  console.log('📂 Loading JSON data...');
  const jsonData = loadJsonData();
  console.log(`   Loaded ${Object.keys(jsonData).length} items from JSON files\n`);
  
  console.log('🗂️  Scanning available images...');
  const availableImages = getAvailableImages();
  console.log(`   Found ${availableImages.length} image files\n`);
  
  // Get all markdown files
  console.log('📄 Finding markdown files...');
  const markdownFiles = fs.readdirSync(CONTENT_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(CONTENT_DIR, file));
  
  console.log(`   Found ${markdownFiles.length} markdown files\n`);
  
  // Process each file
  console.log('🔄 Processing files...\n');
  let processedCount = 0;
  let updatedCount = 0;
  
  markdownFiles.forEach(filepath => {
    try {
      const wasUpdated = processMarkdownFile(filepath, jsonData, availableImages, forceUpdate);
      processedCount++;
      if (wasUpdated) {
        updatedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(filepath)}:`, error.message);
    }
  });
  
  console.log(`\n✅ Processing complete!`);
  console.log(`   Processed: ${processedCount} files`);
  console.log(`   Updated: ${updatedCount} files`);
  console.log(`   Skipped: ${processedCount - updatedCount} files`);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  loadJsonData,
  getAvailableImages,
  extractInlineImages,
  removeDuplicateInlineImages,
  processMarkdownFile
};
