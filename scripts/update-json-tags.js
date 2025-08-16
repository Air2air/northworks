#!/usr/bin/env node

/**
 * Update JSON files with new tags from improved markdown files
 * Synchronizes tags between markdown frontmatter and JSON data files
 */

const fs = require('fs');
const path = require('path');

class JsonTagUpdater {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
        this.dataDir = path.join(__dirname, '../src/data');
        this.stats = {
            jsonFilesUpdated: 0,
            entriesUpdated: 0,
            tagsUpdated: 0,
            errors: 0
        };
        
        // Map JSON files to their content patterns
        this.jsonMappings = {
            'cheryl-interviews.json': { pattern: /^c-(?!art|reviews)/, arrayKey: 'interviews' },
            'cheryl-articles.json': { pattern: /^c-(art|articles|main)/, arrayKey: 'articles' },
            'cheryl-reviews.json': { pattern: /^c-reviews/, arrayKey: 'reviews' },
            'warner-background.json': { pattern: /^(w-background|w-main|w-northworks)/, arrayKey: 'background' },
            'warner-professional.json': { pattern: /^w-projects/, arrayKey: 'professional' },
            'warner-publications.json': { pattern: /^w-pub/, arrayKey: 'publications' }
        };
    }

    async run(options = {}) {
        const { dryRun = true } = options;
        
        console.log('🔄 JSON TAG SYNCHRONIZATION');
        console.log(`Mode: ${dryRun ? 'DRY RUN' : 'UPDATE FILES'}`);
        console.log('═'.repeat(60));

        try {
            // Read all markdown files and extract tags
            const markdownData = await this.extractMarkdownTags();
            
            // Update each JSON file
            for (const [jsonFile, mapping] of Object.entries(this.jsonMappings)) {
                await this.updateJsonFile(jsonFile, mapping, markdownData, dryRun);
            }
            
            this.printSummary();
            
        } catch (error) {
            console.error('❌ JSON update failed:', error.message);
            this.stats.errors++;
        }
    }

    async extractMarkdownTags() {
        const markdownData = new Map();
        
        console.log('📖 Reading markdown files...');
        
        const files = fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'));
        
        for (const file of files) {
            try {
                const filePath = path.join(this.contentDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                
                const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
                if (!frontmatterMatch) continue;
                
                const frontmatter = frontmatterMatch[1];
                const idMatch = frontmatter.match(/id:\s*(.+)/);
                const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
                
                if (idMatch) {
                    const id = idMatch[1].trim();
                    let subjects = [];
                    
                    if (subjectsMatch) {
                        subjects = subjectsMatch[1]
                            .split('\n')
                            .map(line => line.replace(/^\s*-\s*/, '').trim())
                            .filter(tag => tag.length > 0);
                    }
                    
                    markdownData.set(id, {
                        filename: file,
                        subjects,
                        originalFile: file
                    });
                }
                
            } catch (error) {
                console.error(`❌ Error reading ${file}:`, error.message);
                this.stats.errors++;
            }
        }
        
        console.log(`✅ Extracted tags from ${markdownData.size} markdown files`);
        return markdownData;
    }

    async updateJsonFile(jsonFile, mapping, markdownData, dryRun) {
        const jsonPath = path.join(this.dataDir, jsonFile);
        
        if (!fs.existsSync(jsonPath)) {
            console.log(`⚠️  ${jsonFile} not found, skipping`);
            return;
        }
        
        try {
            console.log(`\n📝 Processing ${jsonFile}...`);
            
            const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            const arrayKey = mapping.arrayKey;
            const entries = jsonContent[arrayKey] || [];
            
            let entriesUpdated = 0;
            let tagsUpdated = 0;
            
            for (const entry of entries) {
                const entryId = entry.metadata?.id;
                if (!entryId) continue;
                
                // Check if this entry matches the file pattern
                if (!mapping.pattern.test(entryId)) continue;
                
                const markdownEntry = markdownData.get(entryId);
                if (!markdownEntry) {
                    console.log(`  ⚠️  No markdown found for ${entryId}`);
                    continue;
                }
                
                // Compare current tags with new tags
                const currentTopics = entry.subject?.topics || [];
                const newTopics = markdownEntry.subjects || [];
                
                if (!this.arraysEqual(currentTopics, newTopics)) {
                    console.log(`  🔄 ${entryId}:`);
                    console.log(`    Old: [${currentTopics.slice(0, 3).join(', ')}...]`);
                    console.log(`    New: [${newTopics.slice(0, 3).join(', ')}...]`);
                    
                    if (!dryRun) {
                        // Update the topics
                        if (!entry.subject) entry.subject = {};
                        entry.subject.topics = newTopics;
                        tagsUpdated++;
                    }
                    
                    entriesUpdated++;
                }
            }
            
            if (entriesUpdated > 0) {
                this.stats.jsonFilesUpdated++;
                this.stats.entriesUpdated += entriesUpdated;
                this.stats.tagsUpdated += tagsUpdated;
                
                if (!dryRun) {
                    // Update metadata
                    jsonContent.metadata.lastModified = new Date().toISOString();
                    jsonContent.metadata.count = entries.length;
                    
                    // Write updated file
                    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2), 'utf-8');
                    console.log(`  ✅ Updated ${entriesUpdated} entries`);
                } else {
                    console.log(`  📋 Would update ${entriesUpdated} entries`);
                }
            } else {
                console.log(`  ✅ ${jsonFile} already up to date`);
            }
            
        } catch (error) {
            console.error(`❌ Error updating ${jsonFile}:`, error.message);
            this.stats.errors++;
        }
    }

    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        
        // Sort both arrays for comparison
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        
        return sorted1.every((val, index) => val === sorted2[index]);
    }

    printSummary() {
        console.log('\n' + '═'.repeat(60));
        console.log('📊 JSON UPDATE SUMMARY');
        console.log('═'.repeat(60));
        console.log(`JSON files updated: ${this.stats.jsonFilesUpdated}`);
        console.log(`Entries updated: ${this.stats.entriesUpdated}`);
        console.log(`Tag sets updated: ${this.stats.tagsUpdated}`);
        console.log(`Errors: ${this.stats.errors}`);
        
        if (this.stats.entriesUpdated > 0) {
            console.log('\n🎉 JSON files synchronized with improved markdown tags!');
        }
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        dryRun: !args.includes('--apply')
    };
    
    new JsonTagUpdater().run(options);
}

module.exports = JsonTagUpdater;
