#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class AutoTagImprovement {
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

    extractSubjects(content) {
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) return [];
        
        const lines = match[1].split('\n');
        let inSubjects = false;
        const subjects = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('subjects:')) {
                inSubjects = true;
                continue;
            }
            
            if (inSubjects) {
                if (trimmedLine.startsWith('- ')) {
                    const subject = trimmedLine.substring(2).trim();
                    if (subject) {
                        subjects.push(subject);
                    }
                } else if (trimmedLine && !trimmedLine.startsWith(' ') && trimmedLine.includes(':')) {
                    // Hit another field, stop collecting subjects
                    break;
                }
            }
        }
        
        return subjects;
    }

    generateSmartTags(content, currentSubjects = []) {
        // Extract key entities and concepts from content
        const contentText = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        const lowerContent = contentText.toLowerCase();
        
        const suggestions = new Set();
        
        // Add existing subjects
        currentSubjects.forEach(subject => suggestions.add(subject));
        
        // Musical terms and concepts
        const musicalTerms = [
            'opera', 'symphony', 'concerto', 'sonata', 'quartet', 'quintet',
            'conducting', 'conductor', 'soprano', 'mezzo-soprano', 'alto', 
            'tenor', 'baritone', 'bass', 'piano', 'violin', 'cello', 'viola',
            'orchestra', 'chamber music', 'recital', 'performance', 'concert',
            'classical music', 'baroque', 'romantic', 'contemporary', 'modern',
            'composition', 'composer', 'musician', 'artist', 'singer', 'vocalist',
            'ensemble', 'soloist', 'maestro', 'premiere', 'debut', 'finale',
            'aria', 'duet', 'chorus', 'libretto', 'score', 'repertoire'
        ];
        
        // Venues and institutions
        const venues = [
            'san francisco opera', 'san francisco symphony', 'davies symphony hall',
            'war memorial opera house', 'metropolitan opera', 'carnegie hall',
            'lincoln center', 'berkeley opera', 'stanford', 'uc berkeley',
            'zellerbach hall', 'herbst theatre', 'stern grove', 'music center'
        ];
        
        // Composers and key figures (common names that appear)
        const composers = [
            'mozart', 'beethoven', 'bach', 'verdi', 'puccini', 'wagner', 'brahms',
            'tchaikovsky', 'chopin', 'debussy', 'ravel', 'mahler', 'strauss',
            'britten', 'bernstein', 'copland', 'gershwin', 'glass', 'adams'
        ];
        
        // Musical forms and genres
        const genres = [
            'italian opera', 'german opera', 'french opera', 'american opera',
            'symphony orchestra', 'chamber orchestra', 'string quartet',
            'piano recital', 'vocal recital', 'lieder', 'art song', 'oratorio'
        ];
        
        // Check for musical terms
        musicalTerms.forEach(term => {
            if (lowerContent.includes(term)) {
                suggestions.add(term.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '));
            }
        });
        
        // Check for venues
        venues.forEach(venue => {
            if (lowerContent.includes(venue)) {
                suggestions.add(venue.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '));
            }
        });
        
        // Check for composers
        composers.forEach(composer => {
            if (lowerContent.includes(composer)) {
                suggestions.add(composer.charAt(0).toUpperCase() + composer.slice(1));
            }
        });
        
        // Check for genres
        genres.forEach(genre => {
            if (lowerContent.includes(genre)) {
                suggestions.add(genre.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '));
            }
        });
        
        // Extract proper nouns (potential names and places)
        const properNouns = contentText.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
        properNouns.forEach(name => {
            if (name.length > 3 && 
                !name.includes('The ') && 
                !name.includes('And ') && 
                !name.includes('For ') &&
                !name.includes('With ') &&
                !name.includes('But ')) {
                suggestions.add(name.trim());
            }
        });
        
        // Add content-based contextual tags
        if (lowerContent.includes('review') || lowerContent.includes('performance')) {
            suggestions.add('Performance Review');
        }
        if (lowerContent.includes('interview')) {
            suggestions.add('Interview');
        }
        if (lowerContent.includes('festival')) {
            suggestions.add('Music Festival');
        }
        if (lowerContent.includes('recording')) {
            suggestions.add('Recording');
        }
        if (lowerContent.includes('season')) {
            suggestions.add('Concert Season');
        }
        
        return Array.from(suggestions).slice(0, 18); // Increased limit to 18 tags
    }

    async improveFileTags(filename) {
        try {
            const filePath = path.join(this.contentDir, filename);
            const content = await fs.readFile(filePath, 'utf-8');
            
            const currentSubjects = this.extractSubjects(content);
            const improvedTags = this.generateSmartTags(content, currentSubjects);
            
            // Only update if we have meaningful improvements
            if (improvedTags.length > currentSubjects.length + 1) {
                const frontmatterMatch = content.match(/^(---\n[\s\S]*?\n---)/);
                if (frontmatterMatch) {
                    let frontmatter = frontmatterMatch[1];
                    
                    // Replace or add subjects section
                    const subjectsSection = '\nsubjects:\n' + 
                        improvedTags.map(tag => `  - ${tag}`).join('\n');
                    
                    if (frontmatter.includes('subjects:')) {
                        // Replace existing subjects
                        frontmatter = frontmatter.replace(
                            /subjects:[\s\S]*?(?=\n[a-zA-Z]|\n---)/,
                            'subjects:' + improvedTags.map(tag => `\n  - ${tag}`).join('')
                        );
                    } else {
                        // Add subjects before the closing ---
                        frontmatter = frontmatter.replace(/\n---$/, subjectsSection + '\n---');
                    }
                    
                    const newContent = content.replace(/^---\n[\s\S]*?\n---/, frontmatter);
                    await fs.writeFile(filePath, newContent, 'utf-8');
                    
                    return {
                        filename,
                        before: currentSubjects.length,
                        after: improvedTags.length,
                        added: improvedTags.length - currentSubjects.length
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error(`Error processing ${filename}:`, error.message);
            return null;
        }
    }

    async analyzeAllFiles() {
        const files = await this.getMarkdownFiles();
        const stats = {
            total: files.length,
            withTags: 0,
            needImprovement: 0,
            tagCounts: []
        };
        
        console.log('🔍 Analyzing tag coverage...\n');
        
        for (const file of files) {
            try {
                const filePath = path.join(this.contentDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const subjects = this.extractSubjects(content);
                
                stats.tagCounts.push({
                    file,
                    count: subjects.length
                });
                
                if (subjects.length > 0) {
                    stats.withTags++;
                }
                
                if (subjects.length < 10) {
                    stats.needImprovement++;
                }
            } catch (error) {
                console.error(`Error analyzing ${file}:`, error.message);
            }
        }
        
        return stats;
    }

    async runAutoImprovement() {
        console.log('🚀 Starting automatic tag improvement...\n');
        
        const stats = await this.analyzeAllFiles();
        
        console.log('📊 CURRENT STATS:');
        console.log(`Total files: ${stats.total}`);
        console.log(`Files with tags: ${stats.withTags}`);
        console.log(`Files needing improvement: ${stats.needImprovement}\n`);
        
        // Find files with fewer than 10 tags for comprehensive improvement
        const filesToImprove = stats.tagCounts
            .filter(item => item.count < 10)
            .sort((a, b) => a.count - b.count);
        
        console.log(`🎯 Improving ${filesToImprove.length} files with fewer than 10 tags...\n`);
        
        const improvements = [];
        
        for (const item of filesToImprove) {
            const result = await this.improveFileTags(item.file);
            if (result) {
                improvements.push(result);
                console.log(`✅ ${result.filename}: ${result.before} → ${result.after} tags (+${result.added})`);
            } else {
                console.log(`⏭️  ${item.file}: No improvements needed`);
            }
        }
        
        console.log(`\n🎉 Completed! Improved ${improvements.length} files.`);
        
        if (improvements.length > 0) {
            console.log('\n📈 IMPROVEMENTS SUMMARY:');
            improvements.forEach(imp => {
                console.log(`   ${imp.filename}: +${imp.added} tags`);
            });
        }
    }
}

// Run if called directly
if (require.main === module) {
    const contentDir = path.join(__dirname, '..', 'public', 'content');
    const improver = new AutoTagImprovement(contentDir);
    improver.runAutoImprovement().catch(console.error);
}

module.exports = AutoTagImprovement;
