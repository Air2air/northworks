#!/usr/bin/env node

/**
 * Page-by-Page Tag Review Tool
 * Simple tool to review and improve tags one file at a time
 */

const fs = require('fs');
const path = require('path');

class PageTagReviewer {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
    }

    async run(filename) {
        if (!filename) {
            console.log('📋 USAGE: node scripts/page-tag-review.js [filename]');
            console.log('\nExample: node scripts/page-tag-review.js c-theorin.md');
            console.log('\nOr list all files: node scripts/page-tag-review.js --list');
            return;
        }

        if (filename === '--list') {
            this.listFiles();
            return;
        }

        await this.reviewFile(filename);
    }

    listFiles() {
        console.log('📁 AVAILABLE FILES:');
        console.log('═'.repeat(50));
        
        const files = fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .sort();
        
        files.forEach((file, index) => {
            console.log(`${(index + 1).toString().padStart(3)}. ${file}`);
        });
        
        console.log(`\nTotal: ${files.length} files`);
    }

    async reviewFile(filename) {
        const filePath = path.join(this.contentDir, filename);
        
        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${filename}`);
            return;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const analysis = this.analyzeFile(content, filename);
            
            console.log('📄 FILE REVIEW');
            console.log('═'.repeat(60));
            console.log(`File: ${filename}`);
            console.log(`Type: ${analysis.contentType}`);
            console.log(`Title: ${analysis.title || 'No title'}`);
            console.log(`Date: ${analysis.date || 'No date'}`);
            console.log('─'.repeat(60));
            
            console.log('\n🏷️  CURRENT TAGS:');
            if (analysis.currentTags.length === 0) {
                console.log('   (No tags)');
            } else {
                analysis.currentTags.forEach((tag, index) => {
                    console.log(`   ${(index + 1).toString().padStart(2)}. ${tag}`);
                });
            }
            
            console.log('\n✨ SUGGESTED TAGS:');
            const suggestions = this.generateSuggestions(analysis);
            if (suggestions.length === 0) {
                console.log('   (No suggestions)');
            } else {
                suggestions.forEach((tag, index) => {
                    const status = analysis.currentTags.includes(tag) ? '✓' : '+';
                    console.log(`   ${status} ${(index + 1).toString().padStart(2)}. ${tag}`);
                });
            }
            
            console.log('\n📝 CONTENT PREVIEW:');
            console.log(analysis.preview);
            
        } catch (error) {
            console.error(`❌ Error processing ${filename}:`, error.message);
        }
    }

    analyzeFile(content, filename) {
        // Parse frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let frontmatter = {};
        let bodyContent = content;
        
        if (frontmatterMatch) {
            const frontmatterText = frontmatterMatch[1];
            bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
            
            // Extract basic info
            const titleMatch = frontmatterText.match(/title:\s*(.+)/);
            const dateMatch = frontmatterText.match(/date:\s*(.+)/);
            const subjectsMatch = frontmatterText.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
            
            frontmatter.title = titleMatch ? titleMatch[1].trim() : null;
            frontmatter.date = dateMatch ? dateMatch[1].trim() : null;
            
            if (subjectsMatch) {
                frontmatter.subjects = subjectsMatch[1]
                    .split('\n')
                    .map(line => line.replace(/^\s*-\s*/, '').trim())
                    .filter(tag => tag.length > 0);
            } else {
                frontmatter.subjects = [];
            }
        }

        return {
            contentType: this.detectContentType(filename),
            title: frontmatter.title,
            date: frontmatter.date,
            currentTags: frontmatter.subjects || [],
            bodyContent,
            preview: bodyContent.substring(0, 200) + '...'
        };
    }

    detectContentType(filename) {
        if (filename.startsWith('c-interview')) return 'interview';
        if (filename.startsWith('c-reviews')) return 'review';
        if (filename.startsWith('c-art')) return 'article';
        if (filename.startsWith('c-')) return 'interview';
        if (filename.startsWith('w-')) return 'professional';
        return 'other';
    }

    generateSuggestions(analysis) {
        const { contentType, bodyContent, title } = analysis;
        const suggestions = new Set();
        
        // Extract proper names (potential people, venues, works)
        const properNames = this.extractProperNames(bodyContent);
        properNames.forEach(name => suggestions.add(name));
        
        // Extract musical terms
        const musicalTerms = this.extractMusicalTerms(bodyContent);
        musicalTerms.forEach(term => suggestions.add(term));
        
        // Content-type specific suggestions
        if (contentType === 'interview') {
            this.addInterviewSuggestions(bodyContent, suggestions);
        } else if (contentType === 'review') {
            this.addReviewSuggestions(bodyContent, suggestions);
        } else if (contentType === 'professional') {
            this.addProfessionalSuggestions(bodyContent, suggestions);
        }
        
        // Extract from title
        if (title) {
            this.extractFromTitle(title, suggestions);
        }
        
        return Array.from(suggestions).slice(0, 12); // Limit suggestions
    }

    extractProperNames(content) {
        const names = new Set();
        
        // Pattern for names (First Last, First Middle Last)
        const namePattern = /\b([A-Z][a-z]+ (?:[A-Z][a-z]+ )*[A-Z][a-z]+)\b/g;
        let match;
        
        while ((match = namePattern.exec(content)) !== null) {
            const name = match[1].trim();
            if (this.isLikelyPersonName(name)) {
                names.add(name);
            }
        }
        
        return Array.from(names).slice(0, 5);
    }

    extractMusicalTerms(content) {
        const terms = new Set();
        
        // Common musical terms and venues
        const patterns = [
            /\b(San Francisco (?:Opera|Symphony))\b/gi,
            /\b(Davies (?:Symphony )?Hall)\b/gi,
            /\b(Carnegie Hall)\b/gi,
            /\b(Metropolitan Opera)\b/gi,
            /\b(War Memorial Opera House)\b/gi,
            /\b([A-Z][a-z]+ (?:Concerto|Symphony|Sonata|Opera))\b/gi,
            /\b(Ring Cycle|Don Giovanni|La Traviata|Tosca|Carmen)\b/gi
        ];
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                terms.add(match[1]);
            }
        });
        
        return Array.from(terms);
    }

    addInterviewSuggestions(content, suggestions) {
        // Look for interview subjects
        const interviewPatterns = [
            /interview(?:ed)?\s+with\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi,
            /conversation\s+with\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi
        ];
        
        interviewPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                suggestions.add(match[1]);
            }
        });
        
        // Voice types
        const voiceTypes = ['Soprano', 'Mezzo-soprano', 'Tenor', 'Baritone', 'Bass'];
        voiceTypes.forEach(voice => {
            if (content.toLowerCase().includes(voice.toLowerCase())) {
                suggestions.add(voice);
            }
        });
    }

    addReviewSuggestions(content, suggestions) {
        // Look for performance details
        const performancePatterns = [
            /performed\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
            /featuring\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi,
            /conducted\s+by\s+([A-Z][a-z]+ [A-Z][a-z]+)/gi
        ];
        
        performancePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                suggestions.add(match[1]);
            }
        });
    }

    addProfessionalSuggestions(content, suggestions) {
        // Professional terms
        const professionalTerms = [
            'Decision Analysis', 'Risk Assessment', 'Stanford University',
            'Environmental Protection Agency', 'National Research Council',
            'Management Science', 'Policy Analysis'
        ];
        
        professionalTerms.forEach(term => {
            if (content.includes(term)) {
                suggestions.add(term);
            }
        });
    }

    extractFromTitle(title, suggestions) {
        // Extract names from title
        const namePattern = /\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g;
        let match;
        
        while ((match = namePattern.exec(title)) !== null) {
            suggestions.add(match[1]);
        }
    }

    isLikelyPersonName(name) {
        // Filter out common false positives
        const exclude = [
            'San Francisco', 'New York', 'Los Angeles', 'United States',
            'Bay Area', 'East Bay', 'West Coast', 'North America',
            'Davies Hall', 'Carnegie Hall', 'Opera House'
        ];
        
        return !exclude.includes(name) && 
               name.split(' ').length <= 3 && // Not too many words
               !name.includes('Symphony') &&
               !name.includes('Orchestra') &&
               !name.includes('Opera') &&
               !name.includes('Hall');
    }
}

// CLI execution
if (require.main === module) {
    const filename = process.argv[2];
    new PageTagReviewer().run(filename);
}

module.exports = PageTagReviewer;
