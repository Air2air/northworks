#!/usr/bin/env node

/**
 * Focus on Priority Tag Improvements
 * Handles the most problematic files first with careful validation
 */

const fs = require('fs');
const path = require('path');

class PriorityTagFixer {
    constructor() {
        this.contentDir = path.join(__dirname, '../public/content');
        this.stats = {
            processed: 0,
            improved: 0,
            errors: 0,
            skipped: 0
        };
    }

    async run(options = {}) {
        const { dryRun = true, priority = 'critical' } = options;
        
        console.log('🎯 Priority Tag Improvement');
        console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY CHANGES'}`);
        console.log(`Priority: ${priority}`);
        console.log('═'.repeat(60));

        const files = this.getContentFiles();
        const priorityFiles = this.filterByPriority(files, priority);
        
        console.log(`Found ${priorityFiles.length} ${priority} priority files`);
        
        for (const file of priorityFiles) {
            await this.processFile(file, dryRun);
        }
        
        this.printSummary();
    }

    getContentFiles() {
        return fs.readdirSync(this.contentDir)
            .filter(file => file.endsWith('.md'))
            .map(file => path.join(this.contentDir, file));
    }

    filterByPriority(files, priority) {
        const analyses = files.map(file => {
            const content = fs.readFileSync(file, 'utf-8');
            const fileName = path.basename(file);
            const analysis = this.quickAnalysis(content, fileName);
            return { file, analysis };
        });

        switch (priority) {
            case 'critical':
                // Files with no tags or very poor quality
                return analyses
                    .filter(({ analysis }) => 
                        analysis.currentTags.length === 0 || 
                        analysis.quality === 'Poor' ||
                        analysis.score < -2
                    )
                    .map(({ file }) => file);
                    
            case 'high':
                // Files missing key entities (names, venues)
                return analyses
                    .filter(({ analysis }) => this.isMissingKeyEntities(analysis))
                    .map(({ file }) => file);
                    
            case 'medium':
                // Files with generic tags that could be more specific
                return analyses
                    .filter(({ analysis }) => this.hasGenericTags(analysis))
                    .map(({ file }) => file);
                    
            default:
                return files;
        }
    }

    quickAnalysis(content, fileName) {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            return {
                currentTags: [],
                quality: 'No frontmatter',
                score: -10,
                contentType: this.detectContentType(fileName)
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

        const contentType = this.detectContentType(fileName);
        const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        // Quick quality assessment
        let score = 0;
        for (const tag of currentTags) {
            if (bodyContent.toLowerCase().includes(tag.toLowerCase())) score += 1;
            else score -= 2;
            
            if (this.isSpecificEntity(tag)) score += 1;
            if (this.isGenericTerm(tag)) score -= 1;
        }
        
        const avgScore = currentTags.length > 0 ? score / currentTags.length : 0;
        const quality = avgScore > 0 ? 'Good' : avgScore > -1 ? 'Fair' : 'Poor';
        
        return {
            currentTags,
            quality,
            score: avgScore,
            contentType,
            bodyContent
        };
    }

    detectContentType(fileName) {
        if (fileName.startsWith('c_interview')) return 'interview';
        if (fileName.startsWith('c_reviews')) return 'review';
        if (fileName.startsWith('c_art')) return 'article';
        if (fileName.startsWith('w-')) return 'professional';
        return 'article';
    }

    isMissingKeyEntities(analysis) {
        const { contentType, currentTags, bodyContent } = analysis;
        
        if (contentType === 'interview') {
            // Should have interviewee name
            const hasPersonName = currentTags.some(tag => 
                this.isPersonName(tag) && bodyContent.includes(tag)
            );
            return !hasPersonName;
        }
        
        if (contentType === 'professional') {
            // Should have person name and organization
            const hasPersonName = currentTags.some(tag => tag.includes('Warner') || tag.includes('North'));
            return !hasPersonName;
        }
        
        return false;
    }

    hasGenericTags(analysis) {
        const { currentTags } = analysis;
        const genericCount = currentTags.filter(tag => this.isGenericTerm(tag)).length;
        return genericCount > currentTags.length * 0.3; // More than 30% generic
    }

    isPersonName(tag) {
        return /^[A-Z][a-z]+ [A-Z][a-z]+/.test(tag);
    }

    isSpecificEntity(tag) {
        const patterns = [
            /^[A-Z][a-z]+ [A-Z][a-z]+/, // "First Last"
            /Opera$|Symphony$|Hall$|Center$/, // Venues
            /Concerto|Sonata|Symphony No|Op\./i // Works
        ];
        return patterns.some(pattern => pattern.test(tag));
    }

    isGenericTerm(tag) {
        const generic = [
            'Opera', 'Symphony', 'Classical', 'Music', 'Performance',
            'Aria', 'Concert', 'Orchestra', 'Piano', 'Interview',
            'Music Article', 'Concert Review'
        ];
        return generic.includes(tag);
    }

    async processFile(filePath, dryRun) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);
            const analysis = this.quickAnalysis(content, fileName);
            
            const improvements = this.generateTargetedImprovements(analysis, fileName);
            
            if (improvements.shouldUpdate) {
                this.stats.improved++;
                console.log(`\n🔧 ${fileName}`);
                console.log(`Issue: ${improvements.primaryIssue}`);
                console.log(`Current: [${analysis.currentTags.slice(0, 3).join(', ')}...]`);
                console.log(`Adding: [${improvements.criticalAdds.join(', ')}]`);
                
                if (!dryRun) {
                    await this.applyTargetedChanges(filePath, content, improvements);
                    console.log('✅ Applied critical fixes');
                }
            } else {
                this.stats.skipped++;
            }
            
            this.stats.processed++;
            
        } catch (error) {
            this.stats.errors++;
            console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
        }
    }

    generateTargetedImprovements(analysis, fileName) {
        const { currentTags, contentType, bodyContent } = analysis;
        
        let primaryIssue = '';
        let criticalAdds = [];
        let shouldUpdate = false;
        
        // Handle critical missing entities
        if (contentType === 'interview' && !this.hasIntervieweeName(currentTags, bodyContent)) {
            const interviewee = this.extractIntervieweeName(fileName, bodyContent);
            if (interviewee) {
                criticalAdds.push(interviewee);
                primaryIssue = 'Missing interviewee name';
                shouldUpdate = true;
            }
        }
        
        if (contentType === 'professional' && !this.hasWarnerNorth(currentTags)) {
            criticalAdds.push('D. Warner North');
            primaryIssue = 'Missing subject name';
            shouldUpdate = true;
        }
        
        // Remove obviously bad tags
        const badTags = currentTags.filter(tag => 
            !bodyContent.toLowerCase().includes(tag.toLowerCase()) ||
            tag.length < 3 ||
            tag.includes('then the') ||
            tag.includes('he has')
        );
        
        if (badTags.length > 0) {
            primaryIssue = primaryIssue || 'Contains invalid tags';
            shouldUpdate = true;
        }
        
        // Add venue if missing (for reviews/interviews)
        if ((contentType === 'review' || contentType === 'interview') && 
            !this.hasVenue(currentTags, bodyContent)) {
            const venue = this.extractVenue(bodyContent);
            if (venue) {
                criticalAdds.push(venue);
                primaryIssue = primaryIssue || 'Missing venue information';
                shouldUpdate = true;
            }
        }
        
        return {
            shouldUpdate,
            primaryIssue,
            criticalAdds: criticalAdds.slice(0, 3), // Limit additions
            badTags
        };
    }

    hasIntervieweeName(tags, content) {
        return tags.some(tag => 
            this.isPersonName(tag) && 
            content.includes(tag) &&
            !tag.includes('Warner') // Exclude the interviewer
        );
    }

    hasWarnerNorth(tags) {
        return tags.some(tag => 
            tag.includes('Warner') || 
            tag.includes('North') ||
            tag.includes('D. Warner')
        );
    }

    hasVenue(tags, content) {
        const venueKeywords = ['Hall', 'Opera', 'Symphony', 'Center', 'Theatre'];
        return tags.some(tag => 
            venueKeywords.some(keyword => tag.includes(keyword)) &&
            content.includes(tag)
        );
    }

    extractIntervieweeName(fileName, content) {
        // Extract from filename pattern (c-lastname.md)
        const fileMatch = fileName.match(/^c[_-]([a-z]+)\.md$/);
        if (fileMatch) {
            const lastname = fileMatch[1];
            
            // Look for full name in content
            const namePattern = new RegExp(`([A-Z][a-z]+ )+${lastname}`, 'i');
            const match = content.match(namePattern);
            if (match) {
                return match[0].replace(/\s+/g, ' ').trim();
            }
        }
        
        // Fallback: look for prominent names in content
        const nameMatches = content.match(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g);
        if (nameMatches) {
            // Return the most mentioned name (simple heuristic)
            const nameCounts = {};
            nameMatches.forEach(name => {
                nameCounts[name] = (nameCounts[name] || 0) + 1;
            });
            
            const topName = Object.entries(nameCounts)
                .sort(([,a], [,b]) => b - a)[0];
            
            if (topName && topName[1] >= 2) { // Mentioned at least twice
                return topName[0];
            }
        }
        
        return null;
    }

    extractVenue(content) {
        const venuePatterns = [
            /\b([A-Z][a-z]+ (?:Opera|Symphony|Hall|Center|Theatre))\b/g,
            /\b(Davies (?:Symphony )?Hall)\b/gi,
            /\b(War Memorial Opera House)\b/gi,
            /\b(Paramount Theatre)\b/gi
        ];
        
        for (const pattern of venuePatterns) {
            const match = content.match(pattern);
            if (match) {
                return match[0];
            }
        }
        
        return null;
    }

    async applyTargetedChanges(filePath, content, improvements) {
        const { criticalAdds, badTags } = improvements;
        
        // Get current tags
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) return;
        
        let frontmatter = frontmatterMatch[1];
        const subjectsMatch = frontmatter.match(/subjects:\s*\n((?:\s*-\s*.*\n)*)/);
        
        let currentTags = [];
        if (subjectsMatch) {
            currentTags = subjectsMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*-\s*/, '').trim())
                .filter(tag => tag.length > 0);
        }
        
        // Remove bad tags
        const cleanTags = currentTags.filter(tag => !badTags.includes(tag));
        
        // Add critical tags
        const finalTags = [...cleanTags, ...criticalAdds]
            .filter((tag, index, arr) => arr.indexOf(tag) === index) // Dedupe
            .slice(0, 10); // Reasonable limit
        
        // Update frontmatter
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
    }

    printSummary() {
        console.log('\n' + '═'.repeat(60));
        console.log('📊 PRIORITY FIX SUMMARY');
        console.log('═'.repeat(60));
        console.log(`Files processed: ${this.stats.processed}`);
        console.log(`Files improved: ${this.stats.improved}`);
        console.log(`Files skipped: ${this.stats.skipped}`);
        console.log(`Errors: ${this.stats.errors}`);
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        dryRun: !args.includes('--apply'),
        priority: args.find(arg => ['critical', 'high', 'medium'].includes(arg)) || 'critical'
    };
    
    new PriorityTagFixer().run(options);
}

module.exports = PriorityTagFixer;
