#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, 'src/data/normalized');

function cleanUrlsInFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        let changesCount = 0;
        
        function cleanUrls(obj) {
            if (typeof obj !== 'object' || obj === null) return;
            
            if (Array.isArray(obj)) {
                obj.forEach(item => cleanUrls(item));
                return;
            }
            
            for (const [key, value] of Object.entries(obj)) {
                if (key === 'url' && typeof value === 'string' && value.includes('#')) {
                    const oldUrl = value;
                    obj[key] = value.split('#')[0];
                    console.log(`  Fixed: ${oldUrl} → ${obj[key]}`);
                    changesCount++;
                } else if (typeof value === 'object') {
                    cleanUrls(value);
                }
            }
        }
        
        cleanUrls(data);
        
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
    console.log('🔧 Removing ALL anchor fragments from URLs...\n');
    
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
        const changes = cleanUrlsInFile(filePath);
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
