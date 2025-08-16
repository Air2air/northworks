#!/usr/bin/env node

/**
 * Tag Improvement Implementation Script
 * Applies AI-generated tag improvements to content files
 */

const fs = require('fs');
const path = require('path');

class TagImplementer {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
        this.stats = {
            processed: 0,
            improved: 0,
            errors: 0,
            unchanged: 0
        };
        this.dryRun = true; // Safety first
    }

    async run(options = {}) {
        this.dryRun = options.dryRun !== false;
        
        console.log('🚀 Tag Improvement Implementation');
        console.log(`Mode: ${this.dryRun ? 'DRY RUN (preview only)' : 'APPLY CHANGES'}`);
        console.log('═'.repeat(60));

        const files = this.getContentFiles();
        
        for (const file of files) {
            await this.processFile(file);
        }
        
        this.printSummary();
    }

    getContentFiles() {
        return fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.contentDir, file));
    }

    async processFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);
            
            const analysis = this.analyzeContent(content, fileName);
            const improvements = this.generateImprovements(analysis);
            
            if (improvements.shouldUpdate) {
                this.stats.improved++;
                console.log(`\n📝 ${fileName}`);
                console.log(`Current tags: ${analysis.currentTags.length}`);
                console.log(`Quality: ${analysis.quality} (${analysis.score})`);
                console.log(`New tags: ${improvements.newTags.length}`);
                
                if (this.dryRun) {
                    console.log('Preview changes:');
                    console.log('  Remove:', improvements.removeTagsPreview);
                    console.log('  Add:', improvements.addTagsPreview);
                } else {
                    await this.applyChanges(filePath, content, improvements);
                    console.log('✅ Applied changes');
                }
            } else {
                this.stats.unchanged++;
            }
            
            this.stats.processed++;
            
        } catch (error) {
            this.stats.errors++;
            console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
        }
    }

    analyzeContent(content, fileName) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            return {
                currentTags: [],
                quality: 'No frontmatter',
                score: -10,
                contentType: this.detectContentType(fileName, content)
            };
        }

        const frontmatter = frontmatterMatch[1];
        const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
        
        let currentTags = [];
        if (subjectsMatch) {
            currentTags = subjectsMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*-\s*/, '').trim())
                .filter(tag => tag.length > 0);
        }

        const contentType = this.detectContentType(fileName, content);
        const analysis = this.analyzeTagQuality(currentTags, content, contentType);
        
        return {
            currentTags,
            quality: analysis.quality,
            score: analysis.score,
            contentType,
            frontmatter,
            bodyContent: content.replace(/^---\n[\s\S]*?\n---\n/, '')
        };
    }

    detectContentType(fileName, content) {
        if (fileName.startsWith('c_interview')) return 'interview';
        if (fileName.startsWith('c_reviews')) return 'review';
        if (fileName.startsWith('c_art')) return 'article';
        if (fileName.startsWith('w-')) return 'professional';
        
        // Fallback to content analysis
        if (content.includes('interview') || content.includes('conversation')) return 'interview';
        if (content.includes('review') || content.includes('performance')) return 'review';
        return 'article';
    }

    analyzeTagQuality(tags, content, contentType) {
        let score = 0;
        const issues = [];
        
        for (const tag of tags) {
            // Check if tag appears in content (case-insensitive)
            const inContent = content.toLowerCase().includes(tag.toLowerCase());
            
            // Quality scoring
            if (this.isSpecificEntity(tag)) score += 2;
            else if (this.isGenericTerm(tag)) score -= 1;
            
            if (inContent) score += 1;
            else score -= 3;
            
            if (tag.length < 3) score -= 2;
            if (!tag.match(/^[A-Z]/)) score -= 1;
        }
        
        const avgScore = tags.length > 0 ? score / tags.length : 0;
        
        let quality;
        if (avgScore > 0) quality = 'Good';
        else if (avgScore > -1) quality = 'Fair';
        else quality = 'Poor';
        
        return { score: avgScore, quality, issues };
    }

    isSpecificEntity(tag) {
        // Check for proper names, specific works, venues
        const patterns = [
            /^[A-Z][a-z]+ [A-Z][a-z]+/, // "First Last"
            /Opera$|Symphony$|Philharmonic$/, // Venues
            /^(Mozart|Beethoven|Wagner|Verdi|Puccini)/, // Composer names
            /Concerto|Symphony|Sonata|Opera|Quartet/ // Specific works
        ];
        
        return patterns.some(pattern => pattern.test(tag));
    }

    isGenericTerm(tag) {
        const generic = [
            'Opera', 'Symphony', 'Classical', 'Music', 'Performance',
            'Aria', 'Concert', 'Orchestra', 'Piano', 'Violin'
        ];
        
        return generic.includes(tag);
    }

    generateImprovements(analysis) {
        const { currentTags, contentType, bodyContent } = analysis;
        
        // Generate smart tags based on content
        const smartTags = this.extractSmartTags(bodyContent, contentType);
        
        // Remove poor quality tags
        const tagsToRemove = currentTags.filter(tag => 
            !bodyContent.toLowerCase().includes(tag.toLowerCase()) ||
            this.isGenericTerm(tag)
        );
        
        // Add high-value missing tags
        const tagsToAdd = smartTags.filter(tag => 
            !currentTags.some(existing => 
                existing.toLowerCase() === tag.toLowerCase()
            )
        );
        
        const newTags = currentTags
            .filter(tag => !tagsToRemove.includes(tag))
            .concat(tagsToAdd)
            .slice(0, 12); // Limit to reasonable number
        
        const shouldUpdate = 
            tagsToRemove.length > 0 || 
            tagsToAdd.length > 0 ||
            analysis.quality === 'Poor';
        
        return {
            shouldUpdate,
            newTags,
            tagsToRemove,
            tagsToAdd,
            removeTagsPreview: tagsToRemove.slice(0, 3).join(', '),
            addTagsPreview: tagsToAdd.slice(0, 3).join(', ')
        };
    }

    extractSmartTags(content, contentType) {
        const tags = new Set();
        
        // Extract proper names (people)
        const namePattern = /\b([A-Z][a-z]+ [A-Z][a-z]+(?:[a-z])*)\b/g;
        let match;
        while ((match = namePattern.exec(content)) !== null) {
            const name = match[1];
            if (this.isLikelyPersonName(name)) {
                tags.add(name);
            }
        }
        
        // Extract musical works and venues
        const workPatterns = [
            /\b([A-Z][a-z]+ (?:Opera|Symphony|Concerto|Sonata|Quartet))\b/g,
            /\b(Don Giovanni|Ring Cycle|Turandot|La Bohème|Carmen)\b/gi,
            /\b([A-Z][a-z]+ (?:Hall|Center|Opera House|Theatre))\b/g
        ];
        
        workPatterns.forEach(pattern => {
            while ((match = pattern.exec(content)) !== null) {
                tags.add(match[1]);
            }
        });
        
        // Content-type specific extraction
        if (contentType === 'interview') {
            this.extractInterviewTags(content, tags);
        } else if (contentType === 'review') {
            this.extractReviewTags(content, tags);
        }
        
        return Array.from(tags).slice(0, 8); // Reasonable limit
    }

    isLikelyPersonName(name) {
        // Filter out common false positives
        const exclude = [
            'San Francisco', 'New York', 'Los Angeles', 'United States',
            'Don Giovanni', 'Ring Cycle', 'La Bohème'
        ];
        
        return !exclude.includes(name) && 
               name.split(' ').length <= 3 && // Not too many words
               !name.includes('Orchestra') &&
               !name.includes('Symphony');
    }

    extractInterviewTags(content, tags) {
        // Look for interview subject indicators
        const patterns = [
            /interviewed?\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi,
            /conversation with\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi
        ];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                tags.add(match[1]);
            }
        });
    }

    extractReviewTags(content, tags) {
        // Look for performance details
        const performanceIndicators = [
            /performed\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
            /featuring\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi
        ];
        
        performanceIndicators.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                tags.add(match[1]);
            }
        });
    }

    async applyChanges(filePath, content, improvements) {
        const { newTags } = improvements;
        
        // Build new frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            console.log('⚠️  No frontmatter found, skipping');
            return;
        }
        
        let frontmatter = frontmatterMatch[1];
        
        // Update subjects section
        const newSubjectsSection = newTags.length > 0 
            ? `subjects:\n${newTags.map(tag => `  - ${tag}`).join('\n')}`
            : 'subjects: []';
        
        // Replace or add subjects
        if (frontmatter.includes('subjects:')) {
            frontmatter = frontmatter.replace(
                /subjects:\s*(?:\[\]|\n(?:\s*-\s*.*\n)*)/,
                newSubjectsSection + '\n'
            );
        } else {
            frontmatter += '\n' + newSubjectsSection;
        }
        
        // Rebuild content
        const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        const newContent = `---\n${frontmatter}\n---\n${bodyContent}`;
        
        // Write file
        fs.writeFileSync(filePath, newContent, 'utf-8');
    }

    printSummary() {
        console.log('\n' + '═'.repeat(60));
        console.log('📊 IMPLEMENTATION SUMMARY');
        console.log('═'.repeat(60));
        console.log(`Files processed: ${this.stats.processed}`);
        console.log(`Files improved: ${this.stats.improved}`);
        console.log(`Files unchanged: ${this.stats.unchanged}`);
        console.log(`Errors: ${this.stats.errors}`);
        console.log(`Mode: ${this.dryRun ? 'DRY RUN' : 'CHANGES APPLIED'}`);
        
        if (this.dryRun) {
            console.log('\n💡 To apply changes, run:');
            console.log('node scripts/implement-tags.js --apply');
        }
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        dryRun: !args.includes('--apply')
    };
    
    new TagImplementer().run(options);
}

module.exports = TagImplementer;
