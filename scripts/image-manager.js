#!/usr/bin/env node

/**
 * UNIFIED IMAGE MANAGER
 * ====================
 * 
 * Consolidates functionality from:
 * - populate-images.js
 * - sync-frontmatter-to-json.js  
 * - detailed-image-sync.js
 * - verify-image-sync.js
 * 
 * Commands:
 * - populate: Add images to frontmatter from JSON/inline/filename matching
 * - sync: Sync images from frontmatter to JSON files
 * - verify: Check sync status between JSON and frontmatter
 * - analyze: Detailed analysis of image distribution
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../public/content');
const IMAGES_DIR = path.join(__dirname, '../public/images');
const DATA_DIR = path.join(__dirname, '../src/data/normalized');

class ImageManager {
  constructor() {
    this.jsonData = null;
    this.availableImages = null;
  }

  // ===============================================
  // CORE DATA LOADING
  // ===============================================

  loadJsonData() {
    if (this.jsonData) return this.jsonData;
    
    const jsonFiles = [
      'cheryl-interviews.json',
      'cheryl-articles.json', 
      'cheryl-reviews.json'
    ];
    
    this.jsonData = {};
    
    jsonFiles.forEach(filename => {
      const filepath = path.join(DATA_DIR, filename);
      if (fs.existsSync(filepath)) {
        try {
          const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          if (data.items) {
            data.items.forEach(item => {
              if (item.id) {
                this.jsonData[item.id] = item;
              }
            });
          }
        } catch (error) {
          console.error(`Error loading ${filename}:`, error.message);
        }
      }
    });
    
    return this.jsonData;
  }

  getAvailableImages() {
    if (this.availableImages) return this.availableImages;
    
    if (!fs.existsSync(IMAGES_DIR)) {
      console.error('Images directory not found:', IMAGES_DIR);
      return [];
    }
    
    const imageFiles = fs.readdirSync(IMAGES_DIR)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(filename => ({
        filename,
        basename: path.basename(filename, path.extname(filename)).toLowerCase()
      }));
    
    this.availableImages = imageFiles;
    return imageFiles;
  }

  // ===============================================
  // FRONTMATTER PARSING
  // ===============================================

  parseFrontmatter(content) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return { frontmatter: '', body: content };
    }
    
    return {
      frontmatter: frontmatterMatch[1],
      body: frontmatterMatch[2]
    };
  }

  hasImages(frontmatter) {
    return frontmatter.includes('images:') && 
           frontmatter.includes('- src:');
  }

  extractFrontmatterImages(frontmatter) {
    const images = [];
    const imageMatches = frontmatter.matchAll(/- src: (.+?)(?:\n|$)/g);
    
    for (const match of imageMatches) {
      images.push(match[1].trim());
    }
    
    return images;
  }

  // ===============================================
  // IMAGE DISCOVERY METHODS
  // ===============================================

  getImagesFromJson(fileId) {
    const jsonData = this.loadJsonData();
    const item = jsonData[fileId];
    
    if (!item || !item.media) return [];
    
    return item.media
      .filter(media => media.type === 'image')
      .map(media => ({
        src: media.url.startsWith('/') ? media.url : `/${media.url}`,
        alt: media.caption || fileId,
        caption: media.caption || undefined
      }));
  }

  getImagesFromInline(content) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      const alt = match[1] || '';
      let src = match[2];
      
      if (!src.startsWith('http') && !src.startsWith('//')) {
        if (!src.startsWith('/')) src = '/' + src;
        images.push({
          src: src,
          alt: alt || 'Inline image'
        });
      }
    }
    
    return images;
  }

  getImagesFromFilename(fileId) {
    const availableImages = this.getAvailableImages();
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
    
    return matchingImages;
  }

  // ===============================================
  // COMMAND IMPLEMENTATIONS
  // ===============================================

  async populate(options = {}) {
    const { force = false } = options;
    
    console.log('🖼️  Starting image population...');
    if (force) {
      console.log('⚡ Force mode enabled - will reprocess files with existing images\n');
    }
    
    const jsonData = this.loadJsonData();
    const availableImages = this.getAvailableImages();
    
    console.log(`📂 Loaded ${Object.keys(jsonData).length} items from JSON files`);
    console.log(`🗂️  Found ${availableImages.length} image files\n`);
    
    const markdownFiles = fs.readdirSync(CONTENT_DIR)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(CONTENT_DIR, file));
    
    let processedCount = 0;
    let updatedCount = 0;
    
    for (const filepath of markdownFiles) {
      try {
        const filename = path.basename(filepath, '.md');
        const fileId = filename.replace(/^c_/, 'c-').replace(/_/g, '-');
        
        const content = fs.readFileSync(filepath, 'utf8');
        const { frontmatter, body } = this.parseFrontmatter(content);
        
        // Skip if already has images and not forcing
        if (!force && this.hasImages(frontmatter)) {
          console.log(`  ⏭️  ${filename}: Already has images, skipping`);
          processedCount++;
          continue;
        }
        
        console.log(`🔄 Processing ${filename}...`);
        
        // Try to find images in order of preference
        let images = [];
        
        // 1. JSON data
        const jsonImages = this.getImagesFromJson(fileId);
        if (jsonImages.length > 0) {
          images = jsonImages;
          console.log(`  ✓ Found ${jsonImages.length} image(s) from JSON data`);
        }
        
        // 2. Inline markdown (if no JSON images)
        if (images.length === 0) {
          const inlineImages = this.getImagesFromInline(body);
          if (inlineImages.length > 0) {
            images = inlineImages;
            console.log(`  ✓ Found ${inlineImages.length} inline image(s)`);
          }
        }
        
        // 3. Filename matching (if no other images)
        if (images.length === 0) {
          const filenameImages = this.getImagesFromFilename(fileId);
          if (filenameImages.length > 0) {
            images = filenameImages;
            console.log(`  ✓ Found ${filenameImages.length} image(s) by filename matching`);
          }
        }
        
        if (images.length === 0) {
          console.log(`  - No images found for ${filename}`);
          processedCount++;
          continue;
        }
        
        // Update frontmatter with images
        const updatedFrontmatter = this.updateFrontmatter(frontmatter, images);
        const updatedContent = `---\n${updatedFrontmatter}\n---\n${body}`;
        
        fs.writeFileSync(filepath, updatedContent, 'utf8');
        console.log(`  ✅ Updated ${filename} with ${images.length} image(s)`);
        
        updatedCount++;
        processedCount++;
        
      } catch (error) {
        console.error(`❌ Error processing ${path.basename(filepath)}:`, error.message);
        processedCount++;
      }
    }
    
    console.log(`\n✅ Population complete!`);
    console.log(`   Processed: ${processedCount} files`);
    console.log(`   Updated: ${updatedCount} files`);
    console.log(`   Skipped: ${processedCount - updatedCount} files`);
  }

  async verify() {
    console.log('🔍 Verifying image sync between JSON and frontmatter...\n');
    
    const jsonData = this.loadJsonData();
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
      const { frontmatter } = this.parseFrontmatter(content);
      
      const jsonItem = jsonData[fileId];
      const hasJsonImages = jsonItem && jsonItem.media && jsonItem.media.length > 0;
      const hasFrontmatterImages = this.hasImages(frontmatter);
      
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

  async analyze() {
    console.log('🔍 Detailed image sync analysis...\n');
    
    const jsonData = this.loadJsonData();
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
      const { frontmatter } = this.parseFrontmatter(content);
      
      const jsonItem = jsonData[fileId];
      const hasJsonImages = jsonItem && jsonItem.media && jsonItem.media.length > 0;
      const hasFrontmatterImages = this.hasImages(frontmatter);
      
      if (hasJsonImages && hasFrontmatterImages) {
        perfectSync.push(fileId);
      } else if (hasJsonImages && !hasFrontmatterImages) {
        const jsonImages = jsonItem.media.map(m => m.url);
        jsonOnlyImages.push({
          id: fileId,
          images: jsonImages
        });
      } else if (!hasJsonImages && hasFrontmatterImages) {
        const frontImages = this.extractFrontmatterImages(frontmatter);
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
      jsonOnlyImages.slice(0, 5).forEach(item => {
        console.log(`   ${item.id}:`);
        item.images.forEach(img => {
          console.log(`     - ${img}`);
        });
      });
      if (jsonOnlyImages.length > 5) {
        console.log(`   ... and ${jsonOnlyImages.length - 5} more`);
      }
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
      console.log('\n✅ All JSON images are synced to frontmatter!');
    }
  }

  // ===============================================
  // UTILITY METHODS
  // ===============================================

  updateFrontmatter(frontmatter, images) {
    // Remove existing images section if present
    const withoutImages = frontmatter.replace(/images:\s*\n(?:  - .*\n)*/g, '');
    
    // Add new images section
    const imageYaml = images.map(img => {
      let yaml = `  - src: ${img.src}`;
      if (img.alt) yaml += `\n    alt: ${img.alt}`;
      if (img.caption) yaml += `\n    caption: ${img.caption}`;
      if (img.width) yaml += `\n    width: ${img.width}`;
      if (img.height) yaml += `\n    height: ${img.height}`;
      return yaml;
    }).join('\n');
    
    return `${withoutImages.trim()}\nimages:\n${imageYaml}`;
  }
}

// ===============================================
// CLI INTERFACE
// ===============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  const manager = new ImageManager();
  
  switch (command) {
    case 'populate':
      const force = args.includes('--force') || args.includes('-f');
      await manager.populate({ force });
      break;
      
    case 'verify':
      await manager.verify();
      break;
      
    case 'analyze':
      await manager.analyze();
      break;
      
    case 'help':
    default:
      console.log(`
🖼️  Image Manager - Unified image processing tool

Usage:
  node scripts/image-manager.js <command> [options]

Commands:
  populate [--force]  Add images to frontmatter from JSON/inline/filename matching
  verify             Check sync status between JSON and frontmatter  
  analyze            Detailed analysis of image distribution
  help               Show this help message

Options:
  --force, -f        Force reprocessing of files with existing images

Examples:
  node scripts/image-manager.js populate
  node scripts/image-manager.js populate --force
  node scripts/image-manager.js verify
  node scripts/image-manager.js analyze
`);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageManager;
