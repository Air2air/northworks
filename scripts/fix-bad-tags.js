#!/usr/bin/env node

/**
 * Find and Fix Remaining Bad Tags
 * Identifies files with problematic fragment tags and fixes them
 */

const fs = require('fs');
const path = require('path');

class BadTagFixer {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
        this.badPatterns = [
            'then the', 'he has', 'you dad', 'by suddenly', 'of his', 'with horn',
            'heard me', 'when we', 'slated to', 'during his', 'not the', 'have to',
            'to his', 'bit of', 'by guest', 'her vocal', 'excited about', 'go into',
            'Area while', 'two accomplished', 'of her', 'to her', 'aunts toured',
            'stake every', 'accompanying and', 'understand why',
            'the most', 'hard to', 'luminaries to', 'him to', 'an opera',
            'on their', 'weeks to', 'of four', 'music is', 'young son',
            'renown opera', 'collaboration between', 'that visiting', 'English horn',
            'the upcoming', 'well as', 'old assistant', 'an assistant', 'rescue the',
            'are all', 'write and', 'pianist might', 'also will', 'ability in',
            'seem to', 'me to', 'Wright to', 'after the', 'programs were'
        ];
        this.stats = {
            filesChecked: 0,
            filesWithBadTags: 0,
            badTagsRemoved: 0,
            errors: 0
        };
    }

    async run(options = {}) {
        const { dryRun = true } = options;
        
        console.log('🔍 FINDING BAD TAGS');
        console.log(`Mode: ${dryRun ? 'DRY RUN' : 'FIX TAGS'}`);
        console.log('═'.repeat(50));

        const files = this.getContentFiles();
        
        for (const file of files) {
            await this.checkFile(file, dryRun);
        }
        
        this.printSummary();
    }

    getContentFiles() {
        return fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.contentDir, file));
    }

    async checkFile(filePath, dryRun) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);
            
            this.stats.filesChecked++;
            
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) return;
            
            const frontmatter = frontmatterMatch[1];
            const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
            
            if (!subjectsMatch) return;
            
            const subjectsSection = subjectsMatch[1];
            const tags = subjectsSection
                .split('\n')
                .map(line => line.replace(/^\s*-\s*/, '').trim())
                .filter(tag => tag.length > 0);
            
            const badTags = tags.filter(tag => 
                this.badPatterns.some(pattern => 
                    tag.toLowerCase().trim() === pattern.toLowerCase()
                )
            );
            
            if (badTags.length > 0) {
                this.stats.filesWithBadTags++;
                console.log(`\n❌ ${fileName}`);
                console.log(`   Bad tags found: ${badTags.length}`);
                badTags.forEach(tag => console.log(`   - "${tag}"`));
                
                if (!dryRun) {
                    await this.fixFile(filePath, content, badTags);
                    this.stats.badTagsRemoved += badTags.length;
                    console.log(`   ✅ Fixed - removed ${badTags.length} bad tags`);
                } else {
                    console.log(`   📋 Would remove ${badTags.length} bad tags`);
                }
            }
            
        } catch (error) {
            this.stats.errors++;
            console.error(`❌ Error checking ${path.basename(filePath)}:`, error.message);
        }
    }

    async fixFile(filePath, content, badTags) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;
        
        let frontmatter = frontmatterMatch[1];
        const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
        
        if (!subjectsMatch) return;
        
        const subjectsSection = subjectsMatch[1];
        const allTags = subjectsSection
            .split('\n')
            .map(line => line.replace(/^\s*-\s*/, '').trim())
            .filter(tag => tag.length > 0);
        
        // Remove bad tags
        const goodTags = allTags.filter(tag => 
            !this.badPatterns.some(pattern => 
                tag.toLowerCase().trim() === pattern.toLowerCase()
            )
        );
        
        // Rebuild subjects section
        const newSubjectsSection = goodTags.length > 0 
            ? `subjects:\n${goodTags.map(tag => `  - ${tag}`).join('\n')}`
            : 'subjects: []';
        
        // Replace in frontmatter
        frontmatter = frontmatter.replace(
            /subjects:\s*(?:\[\]|\n(?:\s*-\s*.*\n)*)/,
            newSubjectsSection + '\n'
        );
        
        // Rebuild content
        const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        const newContent = `---\n${frontmatter}\n---\n${bodyContent}`;
        
        fs.writeFileSync(filePath, newContent, 'utf-8');
    }

    printSummary() {
        console.log('\n' + '═'.repeat(50));
        console.log('📊 BAD TAG DETECTION SUMMARY');
        console.log('═'.repeat(50));
        console.log(`Files checked: ${this.stats.filesChecked}`);
        console.log(`Files with bad tags: ${this.stats.filesWithBadTags}`);
        console.log(`Bad tags removed: ${this.stats.badTagsRemoved}`);
        console.log(`Errors: ${this.stats.errors}`);
        
        if (this.stats.filesWithBadTags > 0) {
            console.log('\n🎯 Files with bad fragment tags identified');
            console.log('These are partial words/phrases that got extracted as tags');
        }
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        dryRun: !args.includes('--fix')
    };
    
    new BadTagFixer().run(options);
}

module.exports = BadTagFixer;
