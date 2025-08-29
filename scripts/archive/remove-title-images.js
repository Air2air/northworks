#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class TitleImageRemover {
    constructor(contentDir) {
        this.contentDir = contentDir;
    }

    async getMarkdownFiles() {
        try {
            const files = await fs.readdir(this.contentDir);
            return files
                .filter(file => file.endsWith('.md'))
                .sort();
        } catch (error) {
            console.error('Error reading directory:', error.message);
            return [];
        }
    }

    removeTitleImageBlock(content) {
        // Pattern to match the title image block with wildcard name
        // Matches:
        //   - height: <number>
        //     src: /images/title-<anything>.gif
        //     width: <number>
        const titleImagePattern = /^  - height: \d+\n    src: \/images\/title-[^.\n]+\.gif\n    width: \d+\n/gm;
        
        const originalContent = content;
        const updatedContent = content.replace(titleImagePattern, '');
        
        return {
            content: updatedContent,
            changed: originalContent !== updatedContent
        };
    }

    async processFile(filename) {
        try {
            const filePath = path.join(this.contentDir, filename);
            const content = await fs.readFile(filePath, 'utf-8');
            
            const result = this.removeTitleImageBlock(content);
            
            if (result.changed) {
                await fs.writeFile(filePath, result.content, 'utf-8');
                return { filename, removed: true };
            } else {
                return { filename, removed: false };
            }
        } catch (error) {
            console.error(`Error processing ${filename}:`, error.message);
            return { filename, error: error.message };
        }
    }

    async run() {
        console.log('🗑️  Removing title image blocks...\n');
        
        const files = await this.getMarkdownFiles();
        if (files.length === 0) {
            console.log('No markdown files found.');
            return;
        }

        const results = [];
        let removedCount = 0;
        
        for (const file of files) {
            const result = await this.processFile(file);
            results.push(result);
            
            if (result.removed) {
                removedCount++;
                console.log(`✅ ${file}: Title image block removed`);
            } else if (result.error) {
                console.log(`❌ ${file}: Error - ${result.error}`);
            } else {
                console.log(`⏭️  ${file}: No title image block found`);
            }
        }
        
        console.log(`\n📊 SUMMARY:`);
        console.log(`Total files processed: ${files.length}`);
        console.log(`Files with title images removed: ${removedCount}`);
        console.log(`Files unchanged: ${files.length - removedCount}`);
        
        if (removedCount > 0) {
            console.log(`\n🎉 Successfully removed title image blocks from ${removedCount} files!`);
        }
    }
}

// Run if called directly
if (require.main === module) {
    const contentDir = path.join(__dirname, '..', 'public', 'content');
    const remover = new TitleImageRemover(contentDir);
    remover.run().catch(console.error);
}

module.exports = TitleImageRemover;
