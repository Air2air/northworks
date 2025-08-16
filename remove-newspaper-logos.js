const fs = require('fs');
const path = require('path');

// List of JSON files to process
const jsonFiles = [
  'src/data/cheryl-reviews.json',
  'src/data/cheryl-interviews.json',
  'src/data/cheryl-articles.json',
  'src/data/warner-professional.json',
  'src/data/warner-publications.json',
  'src/data/warner-background.json'
];

let totalRemoved = 0;

function removeNewspaperLogos(obj, path = '') {
  let removedCount = 0;
  
  if (Array.isArray(obj)) {
    // Filter out any image objects that have logos-newspaper.gif
    const originalLength = obj.length;
    const filtered = obj.filter(item => {
      if (item && typeof item === 'object' && item.url && item.url.includes('logos-newspaper.gif')) {
        console.log(`  Removing newspaper logo image at ${path}`);
        return false;
      }
      return true;
    });
    
    removedCount += originalLength - filtered.length;
    
    // Process remaining items recursively
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] && typeof filtered[i] === 'object') {
        removedCount += removeNewspaperLogos(filtered[i], `${path}[${i}]`);
      }
    }
    
    // Update the array
    obj.length = 0;
    obj.push(...filtered);
    
  } else if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'thumbnail' && typeof value === 'string' && value.includes('logos-newspaper.gif')) {
        console.log(`  Removing newspaper logo thumbnail at ${path}.${key}`);
        delete obj[key];
        removedCount++;
      } else if (value && typeof value === 'object') {
        removedCount += removeNewspaperLogos(value, `${path}.${key}`);
      }
    }
  }
  
  return removedCount;
}

// Process each JSON file
jsonFiles.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  console.log(`\nProcessing ${filePath}...`);
  
  try {
    // Read and parse JSON
    const jsonContent = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(jsonContent);
    
    // Remove newspaper logo images
    const removedFromFile = removeNewspaperLogos(data);
    
    if (removedFromFile > 0) {
      // Write back to file
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
      console.log(`  ✅ Removed ${removedFromFile} newspaper logo references from ${filePath}`);
      totalRemoved += removedFromFile;
    } else {
      console.log(`  ℹ️ No newspaper logo references found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Complete! Removed ${totalRemoved} total newspaper logo references from JSON files.`);
