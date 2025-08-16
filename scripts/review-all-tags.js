#!/usr/bin/env node

/**
 * Comprehensive Tag Review
 * Reviews ALL tags on ALL pages without filtering
 */

const fs = require('fs');
const path = require('path');

class TagReviewer {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
        this.stats = {
            totalFiles: 0,
            filesWithTags: 0,
            totalTags: 0,
            uniqueTags: new Set(),
            tagFrequency: new Map(),
            filesByType: {
                interviews: [],
                articles: [],
                reviews: [],
                professional: [],
                background: []
            },
            tagsByType: {
                interviews: new Set(),
                articles: new Set(),
                reviews: new Set(),
                professional: new Set(),
                background: new Set()
            }
        };
    }

    async run() {
        console.log('📋 COMPREHENSIVE TAG REVIEW');
        console.log('Analyzing ALL tags on ALL pages...');
        console.log('═'.repeat(70));

        const files = this.getContentFiles();
        
        for (const file of files) {
            await this.reviewFile(file);
        }
        
        this.generateReport();
    }

    getContentFiles() {
        return fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.contentDir, file));
    }

    async reviewFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);
            
            this.stats.totalFiles++;
            
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
            if (!frontmatterMatch) {
                console.log(`⚠️  ${fileName}: No frontmatter found`);
                return;
            }
            
            const frontmatter = frontmatterMatch[1];
            const idMatch = frontmatter.match(/id:\s*(.+)/);
            const titleMatch = frontmatter.match(/title:\s*(.+)/);
            const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
            
            const id = idMatch ? idMatch[1].trim() : fileName.replace('.md', '');
            const title = titleMatch ? titleMatch[1].trim() : 'No title';
            
            let tags = [];
            if (subjectsMatch) {
                tags = subjectsMatch[1]
                    .split('\n')
                    .map(line => line.replace(/^\s*-\s*/, '').trim())
                    .filter(tag => tag.length > 0);
            }
            
            if (tags.length > 0) {
                this.stats.filesWithTags++;
                this.stats.totalTags += tags.length;
                
                tags.forEach(tag => {
                    this.stats.uniqueTags.add(tag);
                    this.stats.tagFrequency.set(tag, (this.stats.tagFrequency.get(tag) || 0) + 1);
                });
            }
            
            // Categorize by content type
            const contentType = this.categorizeFile(fileName);
            const fileInfo = {
                fileName,
                id,
                title: title.length > 60 ? title.substring(0, 60) + '...' : title,
                tagCount: tags.length,
                tags: tags
            };
            
            this.stats.filesByType[contentType].push(fileInfo);
            tags.forEach(tag => this.stats.tagsByType[contentType].add(tag));
            
        } catch (error) {
            console.error(`❌ Error reviewing ${path.basename(filePath)}:`, error.message);
        }
    }

    categorizeFile(fileName) {
        if (fileName.startsWith('c-reviews')) return 'reviews';
        if (fileName.startsWith('c-art') || fileName.startsWith('c-articles') || fileName.startsWith('c-main')) return 'articles';
        if (fileName.startsWith('c-')) return 'interviews';
        if (fileName.startsWith('w-projects') || fileName.startsWith('w-pub')) return 'professional';
        if (fileName.startsWith('w-') || fileName === 'index.md') return 'background';
        return 'other';
    }

    generateReport() {
        console.log('\n📊 OVERALL STATISTICS');
        console.log('═'.repeat(70));
        console.log(`Total files analyzed: ${this.stats.totalFiles}`);
        console.log(`Files with tags: ${this.stats.filesWithTags} (${((this.stats.filesWithTags / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        console.log(`Total tags: ${this.stats.totalTags}`);
        console.log(`Unique tags: ${this.stats.uniqueTags.size}`);
        console.log(`Average tags per file: ${(this.stats.totalTags / this.stats.filesWithTags).toFixed(1)}`);
        
        console.log('\n📈 CONTENT TYPE BREAKDOWN');
        console.log('═'.repeat(70));
        
        Object.entries(this.stats.filesByType).forEach(([type, files]) => {
            const totalTags = files.reduce((sum, file) => sum + file.tagCount, 0);
            const avgTags = files.length > 0 ? (totalTags / files.length).toFixed(1) : 0;
            
            console.log(`\n${type.toUpperCase()}: ${files.length} files`);
            console.log(`  Total tags: ${totalTags}`);
            console.log(`  Unique tags: ${this.stats.tagsByType[type].size}`);
            console.log(`  Average tags per file: ${avgTags}`);
        });
        
        console.log('\n🏷️  MOST FREQUENT TAGS (Top 30)');
        console.log('═'.repeat(70));
        
        const sortedTags = Array.from(this.stats.tagFrequency.entries())
            .sort(([,a], [,b]) => b - a)
            .slice(0, 30);
        
        sortedTags.forEach(([tag, count], index) => {
            const percentage = ((count / this.stats.totalTags) * 100).toFixed(1);
            console.log(`${(index + 1).toString().padStart(2)}. ${tag.padEnd(30)} ${count.toString().padStart(3)} files (${percentage}%)`);
        });
        
        console.log('\n📝 DETAILED FILE ANALYSIS');
        console.log('═'.repeat(70));
        
        Object.entries(this.stats.filesByType).forEach(([type, files]) => {
            if (files.length === 0) return;
            
            console.log(`\n${type.toUpperCase()} FILES:`);
            console.log('-'.repeat(50));
            
            // Sort by tag count (descending)
            files.sort((a, b) => b.tagCount - a.tagCount);
            
            files.slice(0, 10).forEach(file => { // Show top 10 per category
                console.log(`${file.fileName.padEnd(35)} ${file.tagCount.toString().padStart(2)} tags`);
                console.log(`  Title: ${file.title}`);
                if (file.tagCount > 0) {
                    console.log(`  Tags: ${file.tags.slice(0, 5).join(', ')}${file.tags.length > 5 ? '...' : ''}`);
                }
                console.log('');
            });
            
            if (files.length > 10) {
                console.log(`  ... and ${files.length - 10} more files\n`);
            }
        });
        
        console.log('\n🔍 TAG QUALITY INDICATORS');
        console.log('═'.repeat(70));
        
        // Analyze tag patterns
        const suspiciousPatterns = this.findSuspiciousPatterns();
        const shortTags = Array.from(this.stats.uniqueTags).filter(tag => tag.length <= 3);
        const longTags = Array.from(this.stats.uniqueTags).filter(tag => tag.length > 30);
        const lowercaseTags = Array.from(this.stats.uniqueTags).filter(tag => 
            tag.charAt(0) !== tag.charAt(0).toUpperCase()
        );
        
        console.log(`Tags with suspicious patterns: ${suspiciousPatterns.length}`);
        if (suspiciousPatterns.length > 0) {
            console.log('  Examples:', suspiciousPatterns.slice(0, 5).join(', '));
        }
        
        console.log(`Very short tags (≤3 chars): ${shortTags.length}`);
        if (shortTags.length > 0) {
            console.log('  Examples:', shortTags.slice(0, 10).join(', '));
        }
        
        console.log(`Very long tags (>30 chars): ${longTags.length}`);
        if (longTags.length > 0) {
            console.log('  Examples:', longTags.slice(0, 3).map(tag => tag.substring(0, 40) + '...').join(', '));
        }
        
        console.log(`Lowercase starting tags: ${lowercaseTags.length}`);
        if (lowercaseTags.length > 0) {
            console.log('  Examples:', lowercaseTags.slice(0, 10).join(', '));
        }
        
        console.log('\n✨ TAG RECOMMENDATIONS');
        console.log('═'.repeat(70));
        
        this.generateRecommendations();
    }

    findSuspiciousPatterns() {
        const suspiciousWords = [
            'the', 'and', 'or', 'but', 'with', 'from', 'to', 'of', 'in', 'on', 'at',
            'he', 'she', 'it', 'they', 'his', 'her', 'their', 'this', 'that',
            'were', 'was', 'been', 'have', 'has', 'had', 'will', 'would', 'could'
        ];
        
        return Array.from(this.stats.uniqueTags).filter(tag => {
            const words = tag.toLowerCase().split(' ');
            return words.length >= 2 && suspiciousWords.includes(words[0]);
        });
    }

    generateRecommendations() {
        console.log('1. 🎯 Focus on specific entities:');
        console.log('   - Person names (performers, composers)');
        console.log('   - Venue names (specific halls, opera houses)');
        console.log('   - Musical work titles (operas, symphonies)');
        console.log('   - Performance contexts (premieres, debuts)');
        
        console.log('\n2. 📏 Optimize tag count:');
        const avgTags = this.stats.totalTags / this.stats.filesWithTags;
        if (avgTags > 12) {
            console.log('   - Consider reducing average tags per file (currently high)');
        } else if (avgTags < 5) {
            console.log('   - Consider adding more descriptive tags (currently low)');
        } else {
            console.log('   - Current tag count is in good range');
        }
        
        console.log('\n3. 🔧 Quality improvements:');
        console.log('   - Standardize naming conventions');
        console.log('   - Remove fragment tags and partial phrases');
        console.log('   - Ensure tags appear in content');
        console.log('   - Use full names for people and places');
        
        console.log('\n4. 📚 Content-specific suggestions:');
        console.log('   - Interviews: Always include interviewee name');
        console.log('   - Reviews: Include venue, work, and key performers');
        console.log('   - Articles: Focus on main topics and featured works');
        console.log('   - Professional: Use specific methodologies and organizations');
    }
}

// CLI execution
if (require.main === module) {
    new TagReviewer().run();
}

module.exports = TagReviewer;
