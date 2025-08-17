#!/usr/bin/env node

const fs = require('fs');

const filePath = './src/data/normalized/warner-publications.json';
const content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);

console.log('Total items:', data.items?.length || 0);

if (data.items) {
    let foundCount = 0;
    data.items.forEach((item, index) => {
        // Check all URL properties
        if (item.url && item.url.includes('#')) {
            console.log(`Item ${index} url: ${item.url}`);
            foundCount++;
        }
        
        // Show first few items URLs
        if (index < 10) {
            console.log(`Item ${index} url: ${item.url}`);
        }
    });
    console.log(`Found ${foundCount} items with anchor URLs`);
}
