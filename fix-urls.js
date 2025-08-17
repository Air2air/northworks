#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, 'src/data/normalized');

// Files to process
const files = [
  'warner-professional.json',
  'warner-background.json', 
  'warner-publications.json',
  'all-professional.json',
  'all-background.json',
  'all-publications.json'
];

function fixUrls(filename) {
  const filePath = path.join(normalizedDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  console.log(`Processing: ${filename}`);
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changedCount = 0;
  
  if (data.items) {
    data.items.forEach(item => {
      if (item.url && item.url.includes('#')) {
        const oldUrl = item.url;
        // Remove anchor fragment and create individual URLs
        // /professional/w-main#prof-1 -> /professional/w-main-prof-1
        const [basePath, anchor] = item.url.split('#');
        const baseFile = basePath.split('/').pop(); // e.g., 'w-main'
        const newUrl = `${basePath.replace(baseFile, baseFile + '-' + anchor)}`;
        
        item.url = newUrl;
        changedCount++;
        console.log(`  ${oldUrl} -> ${newUrl}`);
      }
    });
  }
  
  if (changedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`  Updated ${changedCount} URLs in ${filename}`);
  } else {
    console.log(`  No URLs to fix in ${filename}`);
  }
}

console.log('Fixing URLs with anchor fragments...\n');

files.forEach(fixUrls);

console.log('\nURL fixing complete!');
