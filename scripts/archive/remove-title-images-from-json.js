#!/usr/bin/env node

/**
 * Remove title-* images from JSON files
 * These are generic header images that we don't want to display
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

function removeTitleImages(data, filename) {
  let removedCount = 0;
  
  // Function to filter out title-* images from arrays
  const filterImages = (images) => {
    if (!Array.isArray(images)) return images;
    
    const filtered = images.filter(img => {
      const url = img.url || img.src || '';
      const isTitleImage = url.includes('/title-') || url.includes('title-');
      if (isTitleImage) {
        console.log(`  Removing title image from array: ${url}`);
        removedCount++;
      }
      return !isTitleImage;
    });
    
    return filtered.length > 0 ? filtered : undefined;
  };
  
  // Function to remove title images from text content
  const removeTitleImagesFromText = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Remove both standard markdown and the "!(" variant with title- images
    const titleImageRegex = /![\[\(][^\]\)]*[\]\)]\([^)]*title-[^)]*\)/g;
    const titleImageRegex2 = /!\([^)]*title-[^)]*\)/g;
    
    let updatedText = text;
    
    // First regex for standard markdown
    const matches1 = updatedText.match(titleImageRegex);
    if (matches1) {
      matches1.forEach(match => {
        console.log(`  Removing title image from text: ${match}`);
        removedCount++;
      });
      updatedText = updatedText.replace(titleImageRegex, '');
    }
    
    // Second regex for the "!(" variant
    const matches2 = updatedText.match(titleImageRegex2);
    if (matches2) {
      matches2.forEach(match => {
        console.log(`  Removing title image from text: ${match}`);
        removedCount++;
      });
      updatedText = updatedText.replace(titleImageRegex2, '');
    }
    
    return updatedText;
  };
  
  // Function to process any item regardless of where it is
  const processItem = (item) => {
    // Remove from image arrays
    if (item.media && item.media.images) {
      const filtered = filterImages(item.media.images);
      if (filtered && filtered.length > 0) {
        item.media.images = filtered;
      } else {
        // Remove the images array if empty, but keep media object
        delete item.media.images;
      }
    }
    
    // Remove from content text fields
    if (item.content) {
      if (item.content.summary) {
        item.content.summary = removeTitleImagesFromText(item.content.summary);
      }
      if (item.content.fullContent) {
        item.content.fullContent = removeTitleImagesFromText(item.content.fullContent);
      }
      if (item.content.body) {
        item.content.body = removeTitleImagesFromText(item.content.body);
      }
      
      // Remove title images from thumbnail fields in content
      if (item.content.thumbnail && typeof item.content.thumbnail === 'string' && 
          (item.content.thumbnail.includes('/title-') || item.content.thumbnail.includes('title-'))) {
        console.log(`  Removing title thumbnail from content: ${item.content.thumbnail}`);
        delete item.content.thumbnail;
        removedCount++;
      }
    }
    
    // Also check other text fields that might contain images
    if (item.summary) {
      item.summary = removeTitleImagesFromText(item.summary);
    }
    if (item.fullContent) {
      item.fullContent = removeTitleImagesFromText(item.fullContent);
    }
    
    // Remove title images from thumbnail fields
    if (item.thumbnail && typeof item.thumbnail === 'string' && 
        (item.thumbnail.includes('/title-') || item.thumbnail.includes('title-'))) {
      console.log(`  Removing title thumbnail: ${item.thumbnail}`);
      delete item.thumbnail;
      removedCount++;
    }
  };
  
  // Process different JSON structures
  const collections = ['reviews', 'interviews', 'articles', 'professional', 'publications', 'background'];
  
  for (const collection of collections) {
    if (data[collection] && Array.isArray(data[collection])) {
      data[collection].forEach(processItem);
    }
  }
  
  return removedCount;
}

function processJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filename}`);
    return;
  }
  
  try {
    console.log(`\n📁 Processing ${filename}...`);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const removedCount = removeTitleImages(data, filename);
    
    if (removedCount > 0) {
      // Update metadata
      if (data.metadata) {
        data.metadata.lastModified = new Date().toISOString();
      }
      
      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Removed ${removedCount} title images from ${filename}`);
      totalRemoved += removedCount;
    } else {
      console.log(`ℹ️  No title images found in ${filename}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
}

function main() {
  console.log('🧹 Removing title-* images from JSON files...\n');
  
  jsonFiles.forEach(processJsonFile);
  
  console.log(`\n🎉 Process complete! Removed ${totalRemoved} title images total.`);
}

if (require.main === module) {
  main();
}

module.exports = { removeTitleImages };
