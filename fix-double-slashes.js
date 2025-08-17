#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const normalizedDir = path.join(__dirname, 'src/data/normalized');

function fixDoubleSlashes(filePath) {
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
                if (key === 'url' && typeof value === 'string' && value.includes('//')) {
                    // Only fix internal URLs (starting with /) not external URLs (http/https)
                    if (value.startsWith('/') && value.includes('//')) {
                        const oldUrl = value;
                        obj[key] = value.replace(/\/+/g, '/');
                        console.log(`  Fixed: ${oldUrl} → ${obj[key]}`);
                        changesCount++;
                    }
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
            console.log(`✅ Updated ${changesCount} URLs in ${path.basename(filePath)}`);
        } else {
            console.log(`✓ No double slashes found in ${path.basename(filePath)}`);
        }
        
        return changesCount;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return 0;
    }
}

function main() {
    console.log('🔧 Fixing double slashes in URLs...\n');
    
    const files = fs.readdirSync(normalizedDir)
        .filter(file => file.endsWith('.json') && file !== 'migration-report.json');
    
    let totalChanges = 0;
    
    files.forEach(file => {
        const filePath = path.join(normalizedDir, file);
        console.log(`Processing ${file}:`);
        const changes = fixDoubleSlashes(filePath);
        totalChanges += changes;
    });
    
    console.log(`\n🎉 Completed! Fixed ${totalChanges} URLs with double slashes.`);
}

if (require.main === module) {
    main();
}
