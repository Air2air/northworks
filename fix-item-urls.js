#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, 'src/data/normalized');

function fixItemUrls(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        let changesCount = 0;
        
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(item => {
                if (item.url) {
                    let newUrl = item.url;
                    
                    // Fix publications URLs - all should point to w-pub page
                    if (item.url.startsWith('/publications/w-pub-pub-')) {
                        newUrl = '/publications/w-pub';
                        console.log(`  Fixed: ${item.url} → ${newUrl}`);
                        changesCount++;
                    }
                    // Fix professional URLs 
                    else if (item.url.startsWith('/professional/w-main-prof-')) {
                        newUrl = '/professional/w-main';
                        console.log(`  Fixed: ${item.url} → ${newUrl}`);
                        changesCount++;
                    }
                    else if (item.url.startsWith('/professional/w-projects-prof-')) {
                        newUrl = '/professional/w-projects';
                        console.log(`  Fixed: ${item.url} → ${newUrl}`);
                        changesCount++;
                    }
                    // Fix background URLs
                    else if (item.url.startsWith('/background/w-background-bg-')) {
                        newUrl = '/background/w-background';
                        console.log(`  Fixed: ${item.url} → ${newUrl}`);
                        changesCount++;
                    }
                    else if (item.url.startsWith('/background/w-northworks-bg-')) {
                        newUrl = '/background/w-northworks';
                        console.log(`  Fixed: ${item.url} → ${newUrl}`);
                        changesCount++;
                    }
                    // Fix double slashes
                    else if (item.url.includes('//')) {
                        newUrl = item.url.replace('//', '/');
                        console.log(`  Fixed: ${item.url} → ${newUrl}`);
                        changesCount++;
                    }
                    
                    item.url = newUrl;
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
            console.log(`✓ No URL fixes needed in ${path.basename(filePath)}`);
        }
        
        return changesCount;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Fixing item URLs to point to correct pages...\n');
    
    if (!fs.existsSync(normalizedDir)) {
        console.error(`❌ Normalized data directory not found: ${normalizedDir}`);
        process.exit(1);
    }
    
    const files = fs.readdirSync(normalizedDir)
        .filter(file => file.endsWith('.json') && file !== 'migration-report.json');
    
    let totalChanges = 0;
    
    files.forEach(file => {
        const filePath = path.join(normalizedDir, file);
        console.log(`\nProcessing ${file}:`);
        const changes = fixItemUrls(filePath);
        totalChanges += changes;
    });
    
    console.log(`\n🎉 Completed! Fixed ${totalChanges} URLs across ${files.length} files.`);
}

if (require.main === module) {
    main();
}
