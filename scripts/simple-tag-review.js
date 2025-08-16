#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class SimpleTagReview {
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

    extractFrontmatter(content) {
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) return null;
        
        const frontmatter = {};
        const lines = match[1].split('\n');
        let currentKey = null;
        let currentArray = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            // Check if this is a new key
            if (trimmedLine.includes(':') && !trimmedLine.startsWith('-')) {
                // Save previous array if we were building one
                if (currentKey === 'subjects' && currentArray.length > 0) {
                    frontmatter.tags = currentArray;
                    currentArray = [];
                }
                
                const [key, ...valueParts] = trimmedLine.split(':');
                const value = valueParts.join(':').trim();
                currentKey = key.trim();
                
                if (currentKey === 'subjects') {
                    // Start collecting subjects array
                    if (value) {
                        currentArray.push(value);
                    }
                } else {
                    frontmatter[currentKey] = value;
                }
            } 
            // Check if this is an array item
            else if (trimmedLine.startsWith('- ') && currentKey === 'subjects') {
                const item = trimmedLine.substring(2).trim();
                if (item) {
                    currentArray.push(item);
                }
            }
        }
        
        // Save final array if we were building subjects
        if (currentKey === 'subjects' && currentArray.length > 0) {
            frontmatter.tags = currentArray;
        }
        
        // If no subjects found, set empty array
        if (!frontmatter.tags) {
            frontmatter.tags = [];
        }
        
        return frontmatter;
    }

    async analyzeFile(filename) {
        try {
            const filePath = path.join(this.contentDir, filename);
            const content = await fs.readFile(filePath, 'utf-8');
            
            const frontmatter = this.extractFrontmatter(content);
            const currentTags = frontmatter?.tags || [];
            
            // Get content preview (first few lines after frontmatter)
            const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
            const preview = contentWithoutFrontmatter
                .split('\n')
                .slice(0, 5)
                .join('\n')
                .substring(0, 200) + '...';

            return {
                currentTags,
                preview: preview.trim(),
                frontmatter
            };
        } catch (error) {
            console.error('Error analyzing file:', filename, error.message);
            return null;
        }
    }

    async showFileList() {
        const files = await this.getMarkdownFiles();
        
        console.log('\n📚 MARKDOWN FILES:');
        console.log('─'.repeat(60));
        
        files.forEach((file, index) => {
            const num = (index + 1).toString().padStart(3);
            console.log(num + '. ' + file);
        });
        
        console.log('\nTotal: ' + files.length + ' files');
        return files;
    }

    async reviewFile(filename) {
        console.log('\n' + '='.repeat(80));
        console.log('📄 REVIEWING: ' + filename);
        console.log('='.repeat(80));
        
        const analysis = await this.analyzeFile(filename);
        if (!analysis) return;

        console.log('\n🏷️  CURRENT TAGS:');
        if (analysis.currentTags.length === 0) {
            console.log('   (No tags)');
        } else {
            analysis.currentTags.forEach((tag, index) => {
                const num = (index + 1).toString().padStart(2);
                console.log('   ' + num + '. ' + tag);
            });
        }

        console.log('\n📝 CONTENT PREVIEW:');
        console.log(analysis.preview);
        
        return analysis;
    }

    async run() {
        console.log('🔍 Simple Tag Review Tool');
        console.log('='.repeat(40));
        
        const files = await this.showFileList();
        if (files.length === 0) {
            console.log('No markdown files found.');
            return;
        }

        console.log('\nEnter file number to review (1-' + files.length + '), or "q" to quit:');
        
        // For now, let's review the first file as an example
        const firstFile = files[0];
        console.log('\nShowing example with first file: ' + firstFile);
        await this.reviewFile(firstFile);
        
        console.log('\n📋 To use interactively:');
        console.log('1. Run: node simple-tag-review.js');
        console.log('2. Pick a file number to review');
        console.log('3. Review current tags and content');
        console.log('4. Use other scripts to update tags if needed');
    }
}

// Run if called directly
if (require.main === module) {
    const contentDir = path.join(__dirname, '..', 'public', 'content');
    const reviewer = new SimpleTagReview(contentDir);
    reviewer.run().catch(console.error);
}

module.exports = SimpleTagReview;
