#!/usr/bin/env node

/**
 * Remove anchor fragments from URLs in normalized JSON files
 * All w-pub URLs should point to just "/publications/w-pub"
 */

const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, 'src/data/normalized');

function removeAnchorsFromFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        let changesCount = 0;
        
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(item => {
                // Check direct url property
                if (item.url && item.url.includes('#')) {
                    const oldUrl = item.url;
                    item.url = item.url.split('#')[0];
                    console.log(`Fixed URL: ${oldUrl} → ${item.url}`);
                    changesCount++;
                }
                
                // Check nested content.url property
                if (item.content && item.content.url && item.content.url.includes('#')) {
                    const oldUrl = item.content.url;
                    item.content.url = item.content.url.split('#')[0];
                    console.log(`Fixed content URL: ${oldUrl} → ${item.content.url}`);
                    changesCount++;
                }
            });
        }
        
        if (changesCount > 0) {
            // Update metadata
            if (data.metadata) {
                data.metadata.lastModified = new Date().toISOString();
            }
            
            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Updated ${changesCount} URLs in ${path.basename(filePath)}`);
        } else {
            console.log(`✓ No anchor URLs found in ${path.basename(filePath)}`);
        }
        
        return changesCount;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Removing anchor fragments from URLs...\n');
    
    if (!fs.existsSync(normalizedDir)) {
        console.error(`❌ Normalized data directory not found: ${normalizedDir}`);
        process.exit(1);
    }
    
    const files = fs.readdirSync(normalizedDir)
        .filter(file => file.endsWith('.json') && file !== 'migration-report.json');
    
    let totalChanges = 0;
    
    files.forEach(file => {
        const filePath = path.join(normalizedDir, file);
        const changes = removeAnchorsFromFile(filePath);
        totalChanges += changes;
    });
    
    console.log(`\n🎉 Completed! Removed anchor fragments from ${totalChanges} URLs across ${files.length} files.`);
    
    if (totalChanges > 0) {
        console.log('\n⚠️  Note: You may need to restart your development server for changes to take effect.');
    }
}

if (require.main === module) {
    main();
}
