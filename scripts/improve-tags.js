#!/usr/bin/env node

/**
 * Intelligent Tag Generation and Update Script
 * 
 * This script analyzes content files and generates improved tags using AI-powered analysis.
 * It can either analyze current tags or actually update the files with new tags.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class TagImprover {
  
  static analyzeContent(content, title, type) {
    const text = content.toLowerCase();
    const tags = new Set();
    
    // Extract proper names (people, places, works)
    const properNouns = this.extractProperNouns(content, title);
    properNouns.forEach(noun => tags.add(noun));
    
    // Musical entities based on content type
    if (type === 'interview' || type === 'article' || type === 'review') {
      // Composers
      const composers = [
        'Wolfgang Amadeus Mozart', 'Ludwig van Beethoven', 'Richard Wagner',
        'Giacomo Puccini', 'Giuseppe Verdi', 'Johannes Brahms', 'Gustav Mahler',
        'Benjamin Britten', 'Richard Strauss', 'Alban Berg', 'Franz Schubert',
        'Johann Sebastian Bach', 'George Frideric Handel', 'Claude Debussy',
        'Maurice Ravel', 'Igor Stravinsky', 'Sergei Rachmaninoff'
      ];
      
      composers.forEach(composer => {
        const lastName = composer.split(' ').pop();
        if (text.includes(lastName.toLowerCase()) || text.includes(composer.toLowerCase())) {
          tags.add(composer);
        }
      });
      
      // Venues and institutions
      const venues = [
        'San Francisco Opera', 'San Francisco Symphony', 'Carnegie Hall',
        'Davies Symphony Hall', 'War Memorial Opera House', 'Metropolitan Opera',
        'Lincoln Center', 'Royal Opera House', 'Vienna State Opera',
        'Berkeley Opera', 'Oakland East Bay Symphony', 'Mariinsky Theatre'
      ];
      
      venues.forEach(venue => {
        if (text.includes(venue.toLowerCase())) {
          tags.add(venue);
        }
      });
      
      // Musical works
      const works = [
        'Don Giovanni', 'The Magic Flute', 'The Marriage of Figaro', 'Così fan tutte',
        'Ring Cycle', 'Das Rheingold', 'Die Walküre', 'Siegfried', 'Götterdämmerung',
        'Tristan and Isolde', 'Parsifal', 'The Flying Dutchman', 'Tannhäuser',
        'La Bohème', 'Tosca', 'Turandot', 'Madama Butterfly', 'La Traviata',
        'Il Trovatore', 'Rigoletto', 'Aida', 'Otello', 'Falstaff',
        'War Requiem', 'Ninth Symphony', 'Eroica Symphony', 'Emperor Concerto'
      ];
      
      works.forEach(work => {
        if (text.includes(work.toLowerCase())) {
          tags.add(work);
        }
      });
      
      // Voice types and instruments
      const voicesInstruments = [
        'Soprano', 'Mezzo-soprano', 'Alto', 'Tenor', 'Baritone', 'Bass',
        'Piano', 'Violin', 'Viola', 'Cello', 'Double Bass', 'Flute',
        'Oboe', 'Clarinet', 'Bassoon', 'French Horn', 'Trumpet', 'Trombone', 'Tuba'
      ];
      
      voicesInstruments.forEach(voice => {
        if (text.includes(voice.toLowerCase())) {
          tags.add(voice);
        }
      });
      
      // Performance contexts
      if (text.includes('opera')) tags.add('Opera');
      if (text.includes('symphony')) tags.add('Symphony');
      if (text.includes('concert')) tags.add('Concert Performance');
      if (text.includes('recital')) tags.add('Recital');
      if (text.includes('chamber music')) tags.add('Chamber Music');
      if (text.includes('art song')) tags.add('Art Songs');
      if (text.includes('lieder')) tags.add('Lieder');
    }
    
    // Professional/Warner content
    if (type === 'professional' || type === 'publication' || type === 'background') {
      const professionalTerms = [
        'Risk Assessment', 'Decision Analysis', 'Environmental Policy',
        'Nuclear Safety', 'Energy Policy', 'Cost-Benefit Analysis',
        'Monte Carlo Simulation', 'Uncertainty Analysis', 'Fault Tree Analysis',
        'Event Tree Analysis', 'Probabilistic Risk Assessment',
        'Environmental Protection Agency', 'Nuclear Regulatory Commission',
        'Electric Power Research Institute', 'Stanford University'
      ];
      
      professionalTerms.forEach(term => {
        if (text.includes(term.toLowerCase())) {
          tags.add(term);
        }
      });
      
      // Government agencies (shorter forms)
      if (text.includes('epa')) tags.add('EPA');
      if (text.includes('nrc')) tags.add('NRC');
      if (text.includes('epri')) tags.add('EPRI');
    }
    
    return Array.from(tags).sort();
  }
  
  static extractProperNouns(content, title) {
    const properNouns = new Set();
    
    // Extract from title
    const titleWords = title.split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 2 && /^[A-Z][a-z]/.test(word)) {
        properNouns.add(word);
      }
    });
    
    // Extract capitalized words from content (simple heuristic)
    const words = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    words.forEach(word => {
      if (word.length > 2 && !['The', 'And', 'But', 'For', 'Or', 'So', 'Yet'].includes(word)) {
        properNouns.add(word);
      }
    });
    
    return Array.from(properNouns);
  }
  
  static scoreTagQuality(currentTags, suggestedTags, content) {
    let score = 0;
    const issues = [];
    
    // Current tag issues
    currentTags.forEach(tag => {
      if (tag.length < 3) {
        issues.push(`Tag too short: "${tag}"`);
        score -= 2;
      }
      if (tag.toLowerCase() === tag) {
        issues.push(`No capitalization: "${tag}"`);
        score -= 1;
      }
      if (!content.toLowerCase().includes(tag.toLowerCase())) {
        issues.push(`Tag not found in content: "${tag}"`);
        score -= 3;
      }
    });
    
    // Suggested tag benefits
    suggestedTags.forEach(tag => {
      if (content.toLowerCase().includes(tag.toLowerCase())) {
        score += 2;
      }
      if (tag.length > 2 && /^[A-Z]/.test(tag)) {
        score += 1;
      }
    });
    
    return { score, issues };
  }
}

function analyzeFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const currentTags = frontmatter.subjects || [];
  const suggestedTags = TagImprover.analyzeContent(
    content, 
    frontmatter.title || '', 
    frontmatter.type || 'unknown'
  );
  
  const quality = TagImprover.scoreTagQuality(currentTags, suggestedTags, content);
  
  return {
    slug: path.basename(filePath, '.md'),
    title: frontmatter.title,
    type: frontmatter.type,
    currentTags,
    suggestedTags,
    quality,
    wordCount: content.split(/\s+/).length
  };
}

function generateReport() {
  const contentDir = path.join(process.cwd(), 'public', 'content');
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  console.log('🔍 INTELLIGENT TAG ANALYSIS REPORT');
  console.log('=' * 60);
  console.log(`Analyzing ${files.length} content files...\n`);
  
  const analyses = files.map(analyzeFile);
  
  // Summary stats
  const totalFiles = analyses.length;
  const filesWithTags = analyses.filter(a => a.currentTags.length > 0).length;
  const avgCurrentTags = analyses.reduce((sum, a) => sum + a.currentTags.length, 0) / totalFiles;
  const avgSuggestedTags = analyses.reduce((sum, a) => sum + a.suggestedTags.length, 0) / totalFiles;
  const avgQualityScore = analyses.reduce((sum, a) => sum + a.quality.score, 0) / totalFiles;
  
  console.log('📊 SUMMARY STATISTICS:');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Files with existing tags: ${filesWithTags} (${(filesWithTags/totalFiles*100).toFixed(1)}%)`);
  console.log(`Average current tags per file: ${avgCurrentTags.toFixed(1)}`);
  console.log(`Average suggested tags per file: ${avgSuggestedTags.toFixed(1)}`);
  console.log(`Average quality score: ${avgQualityScore.toFixed(1)}`);
  
  // Content type breakdown
  const typeStats = {};
  analyses.forEach(a => {
    typeStats[a.type] = (typeStats[a.type] || 0) + 1;
  });
  
  console.log('\n📚 CONTENT TYPE BREAKDOWN:');
  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} files`);
  });
  
  // Worst quality files (need the most improvement)
  const worstFiles = analyses
    .filter(a => a.quality.score < 0)
    .sort((a, b) => a.quality.score - b.quality.score)
    .slice(0, 10);
  
  console.log('\n⚠️  FILES NEEDING MOST IMPROVEMENT:');
  worstFiles.forEach(file => {
    console.log(`\n${file.slug} (${file.type}) - Score: ${file.quality.score}`);
    console.log(`  Current: [${file.currentTags.join(', ')}]`);
    console.log(`  Suggested: [${file.suggestedTags.join(', ')}]`);
    if (file.quality.issues.length > 0) {
      console.log(`  Issues: ${file.quality.issues.join('; ')}`);
    }
  });
  
  // Best improvements (most new tags suggested)
  const bestImprovements = analyses
    .map(a => ({
      ...a,
      improvement: a.suggestedTags.length - a.currentTags.length
    }))
    .filter(a => a.improvement > 0)
    .sort((a, b) => b.improvement - a.improvement)
    .slice(0, 5);
  
  console.log('\n🎯 BIGGEST IMPROVEMENT OPPORTUNITIES:');
  bestImprovements.forEach(file => {
    console.log(`\n${file.slug} (${file.type}) - +${file.improvement} tags`);
    console.log(`  Current: [${file.currentTags.join(', ')}]`);
    console.log(`  Suggested: [${file.suggestedTags.join(', ')}]`);
  });
  
  // Tag frequency analysis
  const allCurrentTags = analyses.flatMap(a => a.currentTags);
  const allSuggestedTags = analyses.flatMap(a => a.suggestedTags);
  
  const currentFreq = {};
  const suggestedFreq = {};
  
  allCurrentTags.forEach(tag => currentFreq[tag] = (currentFreq[tag] || 0) + 1);
  allSuggestedTags.forEach(tag => suggestedFreq[tag] = (suggestedFreq[tag] || 0) + 1);
  
  const topCurrentTags = Object.entries(currentFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  const topSuggestedTags = Object.entries(suggestedFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  console.log('\n🏷️  MOST COMMON CURRENT TAGS:');
  topCurrentTags.forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count} files`);
  });
  
  console.log('\n🎯 MOST COMMON SUGGESTED TAGS:');
  topSuggestedTags.forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count} files`);
  });
  
  console.log('\n\n💡 RECOMMENDATIONS:');
  console.log('1. Focus on files with negative quality scores first');
  console.log('2. Standardize composer names (full names: "Wolfgang Amadeus Mozart")');
  console.log('3. Use specific venue names ("San Francisco Opera" vs "Opera")');
  console.log('4. Include specific musical work titles where mentioned');
  console.log('5. For interviews, include the interviewee name as primary tag');
  console.log('6. For professional content, focus on methodologies and expertise areas');
  console.log('\n🚀 Next steps: Run with --update flag to apply suggested tags');
  
  return analyses;
}

function updateFiles(analyses) {
  console.log('\n🔄 UPDATING FILES WITH IMPROVED TAGS...\n');
  
  let updatedCount = 0;
  
  analyses.forEach(analysis => {
    if (analysis.quality.score < 0 || analysis.suggestedTags.length > analysis.currentTags.length) {
      const filePath = path.join(process.cwd(), 'public', 'content', `${analysis.slug}.md`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(fileContent);
        
        // Update subjects with suggested tags
        frontmatter.subjects = analysis.suggestedTags;
        
        // Reconstruct the file
        const updatedFile = matter.stringify(content, frontmatter);
        
        fs.writeFileSync(filePath, updatedFile, 'utf8');
        
        console.log(`✅ Updated ${analysis.slug}: ${analysis.currentTags.length} → ${analysis.suggestedTags.length} tags`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Error updating ${analysis.slug}:`, error.message);
      }
    }
  });
  
  console.log(`\n🎉 Successfully updated ${updatedCount} files!`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const shouldUpdate = args.includes('--update') || args.includes('-u');
  
  if (shouldUpdate) {
    console.log('⚠️  UPDATE MODE: Files will be modified with new tags');
    console.log('Make sure you have committed your current changes first!\n');
  }
  
  const analyses = generateReport();
  
  if (shouldUpdate) {
    updateFiles(analyses);
  }
}

// Export for use as module or run directly
if (require.main === module) {
  main();
}

module.exports = { TagImprover, analyzeFile, generateReport, updateFiles };
