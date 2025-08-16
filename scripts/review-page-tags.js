#!/usr/bin/env node

/**
 * Page-by-Page Tag Review and Enhancement Tool
 * Reviews each page individually and provides tag improvement suggestions
 */

const fs = require('fs');
const path = require('path');

class PageTagReviewer {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
        this.stats = {
            pagesReviewed: 0,
            pagesUpdated: 0,
            totalTagsAdded: 0,
            totalTagsRemoved: 0,
            errors: 0
        };
    }

    async run(options = {}) {
        const { 
            dryRun = true, 
            interactive = false,
            specificFile = null 
        } = options;
        
        console.log('📋 PAGE-BY-PAGE TAG REVIEW');
        console.log(`Mode: ${dryRun ? 'PREVIEW' : 'UPDATE'}`);
        console.log(`Interactive: ${interactive ? 'YES' : 'NO'}`);
        console.log('═'.repeat(60));

        const files = this.getContentFiles(specificFile);
        
        for (const file of files) {
            await this.reviewPage(file, dryRun, interactive);
        }
        
        this.printSummary();
    }

    getContentFiles(specificFile) {
        if (specificFile) {
            const filePath = path.join(this.contentDir, specificFile);
            return fs.existsSync(filePath) ? [filePath] : [];
        }
        
        return fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.contentDir, file))
            .sort();
    }

    async reviewPage(filePath, dryRun, interactive) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);
            
            console.log(`\n📄 ${fileName}`);
            console.log('─'.repeat(40));
            
            const analysis = this.analyzePage(content, fileName);
            
            if (!analysis.frontmatter) {
                console.log('⚠️  No frontmatter found');
                return;
            }
            
            this.displayCurrentTags(analysis.currentTags);
            
            const suggestions = this.generateTagSuggestions(analysis);
            this.displaySuggestions(suggestions);
            
            if (suggestions.hasChanges) {
                if (interactive) {
                    // TODO: Add interactive prompts for tag selection
                    console.log('📝 Interactive mode not implemented yet');
                } else {
                    if (!dryRun) {
                        await this.applyChanges(filePath, content, suggestions);
                        this.stats.pagesUpdated++;
                        console.log('✅ Tags updated');
                    } else {
                        console.log('📋 Preview mode - no changes made');
                    }
                }
            } else {
                console.log('✅ No changes needed');
            }
            
            this.stats.pagesReviewed++;
            
        } catch (error) {
            console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
            this.stats.errors++;
        }
    }

    analyzePage(content, fileName) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        if (!frontmatterMatch) {
            return { frontmatter: null, currentTags: [], bodyContent, fileName };
        }

        const frontmatter = frontmatterMatch[1];
        
        // Extract current tags
        const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
        let currentTags = [];
        
        if (subjectsMatch) {
            currentTags = subjectsMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*-\s*/, '').trim())
                .filter(tag => tag.length > 0);
        }
        
        // Extract other metadata
        const titleMatch = frontmatter.match(/title:\s*(.+)/);
        const typeMatch = frontmatter.match(/type:\s*(.+)/);
        const idMatch = frontmatter.match(/id:\s*(.+)/);
        
        return {
            frontmatter,
            currentTags,
            bodyContent,
            fileName,
            title: titleMatch ? titleMatch[1].trim() : '',
            type: typeMatch ? typeMatch[1].trim() : '',
            id: idMatch ? idMatch[1].trim() : '',
            contentType: this.detectContentType(fileName, bodyContent)
        };
    }

    detectContentType(fileName, content) {
        if (fileName.startsWith('c-interview') || fileName.match(/^c-[a-z]+\.md$/)) return 'interview';
        if (fileName.startsWith('c-reviews')) return 'review';
        if (fileName.startsWith('c-art')) return 'article';
        if (fileName.startsWith('w-')) return 'professional';
        if (fileName === 'index.md') return 'homepage';
        
        // Content-based detection
        if (content.toLowerCase().includes('interview')) return 'interview';
        if (content.toLowerCase().includes('review')) return 'review';
        
        return 'article';
    }

    displayCurrentTags(currentTags) {
        console.log(`📌 Current Tags (${currentTags.length}):`);
        if (currentTags.length === 0) {
            console.log('   (No tags)');
        } else {
            currentTags.forEach((tag, index) => {
                console.log(`   ${index + 1}. ${tag}`);
            });
        }
    }

    generateTagSuggestions(analysis) {
        const { currentTags, bodyContent, contentType, fileName } = analysis;
        
        const suggestions = {
            keep: [...currentTags],
            add: [],
            remove: [],
            hasChanges: false
        };
        
        // Extract people names
        const peopleNames = this.extractPeopleNames(bodyContent);
        
        // Extract venues
        const venues = this.extractVenues(bodyContent);
        
        // Extract musical works
        const musicalWorks = this.extractMusicalWorks(bodyContent);
        
        // Extract instruments and voice types
        const instruments = this.extractInstruments(bodyContent);
        
        // Extract composers
        const composers = this.extractComposers(bodyContent);
        
        // Content-type specific suggestions
        let specificTags = [];
        
        switch (contentType) {
            case 'interview':
                specificTags = this.getInterviewTags(analysis, peopleNames, venues);
                break;
            case 'review':
                specificTags = this.getReviewTags(analysis, venues, musicalWorks);
                break;
            case 'article':
                specificTags = this.getArticleTags(analysis, composers, musicalWorks);
                break;
            case 'professional':
                specificTags = this.getProfessionalTags(analysis);
                break;
        }
        
        // Combine all suggestions
        const allSuggestions = [
            ...peopleNames,
            ...venues,
            ...musicalWorks,
            ...instruments,
            ...composers,
            ...specificTags
        ].filter(tag => tag && tag.length > 2);
        
        // Add new tags that aren't already present
        for (const tag of allSuggestions) {
            if (!currentTags.some(existing => 
                existing.toLowerCase() === tag.toLowerCase()
            )) {
                suggestions.add.push(tag);
            }
        }
        
        // Check for tags to remove (not in content)
        for (const tag of currentTags) {
            if (!bodyContent.toLowerCase().includes(tag.toLowerCase()) && 
                tag.length < 50) { // Don't remove long descriptive tags
                suggestions.remove.push(tag);
            }
        }
        
        suggestions.hasChanges = suggestions.add.length > 0 || suggestions.remove.length > 0;
        
        return suggestions;
    }

    extractPeopleNames(content) {
        const names = new Set();
        
        // Pattern for full names (First Last, First Middle Last)
        const namePattern = /\b([A-Z][a-z]+ (?:[A-Z][a-z]+ )?[A-Z][a-z]+)\b/g;
        let match;
        
        while ((match = namePattern.exec(content)) !== null) {
            const name = match[1].trim();
            if (this.isLikelyPersonName(name)) {
                names.add(name);
            }
        }
        
        return Array.from(names).slice(0, 8); // Limit results
    }

    extractVenues(content) {
        const venues = new Set();
        
        const venuePatterns = [
            /\b([A-Z][a-z]+ (?:Opera|Symphony|Hall|Center|Theatre|Theater|Conservatory))\b/g,
            /\b(Davies (?:Symphony )?Hall)\b/gi,
            /\b(War Memorial Opera House)\b/gi,
            /\b(Carnegie Hall)\b/gi,
            /\b(Metropolitan Opera)\b/gi,
            /\b(San Francisco (?:Opera|Symphony))\b/gi,
            /\b(Zellerbach Hall)\b/gi
        ];
        
        venuePatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                venues.add(match[1]);
            }
        });
        
        return Array.from(venues);
    }

    extractMusicalWorks(content) {
        const works = new Set();
        
        const workPatterns = [
            /\b([A-Z][a-z]+ (?:Concerto|Symphony|Sonata|Quartet|Quintet))\b/g,
            /\b((?:Don Giovanni|Ring Cycle|La Bohème|Turandot|Carmen|Tosca|Aida))\b/gi,
            /\*([^*]+)\*/g // Works in italics
        ];
        
        workPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const work = match[1].trim();
                if (work.length > 3 && work.length < 50) {
                    works.add(work);
                }
            }
        });
        
        return Array.from(works).slice(0, 6);
    }

    extractInstruments(content) {
        const instruments = [];
        const instrumentKeywords = [
            'Piano', 'Violin', 'Cello', 'Trumpet', 'Horn', 'Flute', 'Oboe',
            'Clarinet', 'Bassoon', 'Harp', 'Percussion', 'Organ',
            'Soprano', 'Mezzo-soprano', 'Alto', 'Tenor', 'Baritone', 'Bass'
        ];
        
        instrumentKeywords.forEach(instrument => {
            if (content.toLowerCase().includes(instrument.toLowerCase())) {
                instruments.push(instrument);
            }
        });
        
        return instruments;
    }

    extractComposers(content) {
        const composers = [];
        const composerNames = [
            'Mozart', 'Wolfgang Amadeus Mozart', 'Beethoven', 'Ludwig van Beethoven',
            'Bach', 'Johann Sebastian Bach', 'Brahms', 'Johannes Brahms',
            'Wagner', 'Richard Wagner', 'Verdi', 'Giuseppe Verdi',
            'Puccini', 'Giacomo Puccini', 'Mahler', 'Gustav Mahler',
            'Tchaikovsky', 'Pyotr Ilyich Tchaikovsky', 'Chopin', 'Frédéric Chopin',
            'Liszt', 'Franz Liszt', 'Schubert', 'Franz Schubert',
            'Debussy', 'Claude Debussy', 'Ravel', 'Maurice Ravel'
        ];
        
        // Prefer full names over short names
        const foundComposers = new Set();
        
        composerNames.forEach(composer => {
            if (content.includes(composer)) {
                foundComposers.add(composer);
            }
        });
        
        return Array.from(foundComposers);
    }

    getInterviewTags(analysis, peopleNames, venues) {
        const tags = [];
        
        // Add interview subject if not already in people names
        const fileName = analysis.fileName;
        if (fileName.startsWith('c-') && !fileName.startsWith('c-art') && !fileName.startsWith('c-review')) {
            const nameFromFile = this.extractNameFromFilename(fileName);
            if (nameFromFile && !peopleNames.includes(nameFromFile)) {
                tags.push(nameFromFile);
            }
        }
        
        // Add interview context
        if (analysis.bodyContent.toLowerCase().includes('debut')) {
            tags.push('Debut Performance');
        }
        
        return tags;
    }

    getReviewTags(analysis, venues, musicalWorks) {
        const tags = [];
        
        // Add review context
        if (analysis.bodyContent.toLowerCase().includes('opening')) {
            tags.push('Opening Night');
        }
        
        if (analysis.bodyContent.toLowerCase().includes('premiere')) {
            tags.push('Premiere');
        }
        
        return tags;
    }

    getArticleTags(analysis, composers, musicalWorks) {
        const tags = [];
        
        // Add article context
        if (analysis.bodyContent.toLowerCase().includes('festival')) {
            tags.push('Festival');
        }
        
        return tags;
    }

    getProfessionalTags(analysis) {
        const tags = ['D. Warner North'];
        
        const content = analysis.bodyContent.toLowerCase();
        
        if (content.includes('stanford')) {
            tags.push('Stanford University');
        }
        
        if (content.includes('risk assessment') || content.includes('risk analysis')) {
            tags.push('Risk Assessment');
        }
        
        if (content.includes('decision analysis')) {
            tags.push('Decision Analysis');
        }
        
        if (content.includes('management science')) {
            tags.push('Management Science');
        }
        
        return tags;
    }

    isLikelyPersonName(name) {
        // Filter out common false positives
        const exclude = [
            'San Francisco', 'New York', 'Los Angeles', 'United States',
            'Don Giovanni', 'Ring Cycle', 'La Bohème', 'War Memorial',
            'Opera House', 'Symphony Hall', 'Carnegie Hall'
        ];
        
        if (exclude.includes(name)) return false;
        
        const words = name.split(' ');
        if (words.length < 2 || words.length > 4) return false;
        
        // Check if it looks like an institution or place
        if (name.includes('Orchestra') || name.includes('Symphony') || 
            name.includes('Opera') || name.includes('University')) {
            return false;
        }
        
        return true;
    }

    extractNameFromFilename(fileName) {
        // Extract from c-lastname.md pattern
        const match = fileName.match(/^c[_-]([a-z-]+)\.md$/);
        if (!match) return null;
        
        const lastname = match[1].replace(/-/g, ' ');
        // This would need a database lookup for full names
        // For now, return null and rely on content extraction
        return null;
    }

    displaySuggestions(suggestions) {
        if (suggestions.add.length > 0) {
            console.log(`\n➕ Suggested Additions (${suggestions.add.length}):`);
            suggestions.add.forEach((tag, index) => {
                console.log(`   ${index + 1}. ${tag}`);
            });
        }
        
        if (suggestions.remove.length > 0) {
            console.log(`\n➖ Suggested Removals (${suggestions.remove.length}):`);
            suggestions.remove.forEach((tag, index) => {
                console.log(`   ${index + 1}. ${tag}`);
            });
        }
        
        if (!suggestions.hasChanges) {
            console.log('\n✅ No changes suggested');
        }
    }

    async applyChanges(filePath, content, suggestions) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;
        
        let frontmatter = frontmatterMatch[1];
        
        // Calculate final tags
        const finalTags = [
            ...suggestions.keep.filter(tag => !suggestions.remove.includes(tag)),
            ...suggestions.add
        ].filter((tag, index, arr) => arr.indexOf(tag) === index); // Remove duplicates
        
        // Update subjects section
        const newSubjectsSection = finalTags.length > 0 
            ? `subjects:\n${finalTags.map(tag => `  - ${tag}`).join('\n')}`
            : 'subjects: []';
        
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
        
        fs.writeFileSync(filePath, newContent, 'utf-8');
        
        this.stats.totalTagsAdded += suggestions.add.length;
        this.stats.totalTagsRemoved += suggestions.remove.length;
    }

    printSummary() {
        console.log('\n' + '═'.repeat(60));
        console.log('📊 TAG REVIEW SUMMARY');
        console.log('═'.repeat(60));
        console.log(`Pages reviewed: ${this.stats.pagesReviewed}`);
        console.log(`Pages updated: ${this.stats.pagesUpdated}`);
        console.log(`Total tags added: ${this.stats.totalTagsAdded}`);
        console.log(`Total tags removed: ${this.stats.totalTagsRemoved}`);
        console.log(`Errors: ${this.stats.errors}`);
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        dryRun: !args.includes('--apply'),
        interactive: args.includes('--interactive'),
        specificFile: args.find(arg => arg.endsWith('.md'))
    };
    
    new PageTagReviewer().run(options);
}

module.exports = PageTagReviewer;
