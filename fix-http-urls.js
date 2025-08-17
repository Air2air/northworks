#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, 'src/data/normalized');

function fixHttpUrls(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        let changesCount = 0;
        
        function processObject(obj) {
            if (typeof obj !== 'object' || obj === null) return;
            
            if (Array.isArray(obj)) {
                obj.forEach(item => processObject(item));
                return;
            }
            
            for (const [key, value] of Object.entries(obj)) {
                if (key === 'url' && typeof value === 'string') {
                    let newValue = value;
                    
                    // Fix broken http:/ back to http://
                    if (value.startsWith('http:/') && !value.startsWith('http://')) {
                        newValue = value.replace('http:/', 'http://');
                        console.log(`  Fixed: ${value} → ${newValue}`);
                        changesCount++;
                    }
                    // Fix broken https:/ back to https://
                    else if (value.startsWith('https:/') && !value.startsWith('https://')) {
                        newValue = value.replace('https:/', 'https://');
                        console.log(`  Fixed: ${value} → ${newValue}`);
                        changesCount++;
                    }
                    
                    obj[key] = newValue;
                } else if (typeof value === 'object') {
                    processObject(value);
                }
            }
        }
        
        processObject(data);
        
        if (changesCount > 0) {
            // Update metadata
            if (data.metadata) {
                data.metadata.lastModified = new Date().toISOString();
            }
            
            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Fixed ${changesCount} HTTP URLs in ${path.basename(filePath)}`);
        } else {
            console.log(`✓ No broken HTTP URLs found in ${path.basename(filePath)}`);
        }
        
        return changesCount;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Fixing broken HTTP URLs...\n');
    
    const files = fs.readdirSync(normalizedDir)
        .filter(file => file.endsWith('.json') && file !== 'migration-report.json');
    
    let totalChanges = 0;
    
    files.forEach(file => {
        const filePath = path.join(normalizedDir, file);
        console.log(`Processing ${file}:`);
        const changes = fixHttpUrls(filePath);
        totalChanges += changes;
    });
    
    console.log(`\n🎉 Completed! Fixed ${totalChanges} broken HTTP URLs.`);
}

if (require.main === module) {
    main();
}
