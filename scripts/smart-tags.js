#!/usr/bin/env node

/**
 * SMART TAG GENERATION SYSTEM
 * 
 * This refined script generates high-quality, meaningful tags using:
 * 1. Named Entity Recognition (people, places, works)
 * 2. Context-aware analysis for different content types
 * 3. Quality filtering to avoid generic terms
 * 4. Semantic relevance scoring
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

class SmartTagGenerator {
  
  static analyzeContent(content, title, type) {
    const tags = new Set();
    
    // Extract high-quality tags based on content type
    if (type === 'interview') {
      this.analyzeInterviewContent(content, title, tags);
    } else if (type === 'review') {
      this.analyzeReviewContent(content, title, tags);
    } else if (type === 'article') {
      this.analyzeArticleContent(content, title, tags);
    } else if (['professional', 'publication', 'background'].includes(type)) {
      this.analyzeProfessionalContent(content, title, tags);
    }
    
    // Filter out generic/low-quality tags
    const filteredTags = Array.from(tags).filter(tag => this.isHighQualityTag(tag, content));
    
    return filteredTags.sort();
  }
  
  static analyzeInterviewContent(content, title, tags) {
    const text = content.toLowerCase();
    
    // Extract interviewee name from title
    const intervieweePatterns = [
      /interviews?\s+(.+?)(?:\s*[-–—]\s*|$)/i,
      /.*interviews?\s+(.+?)(?:\s|$)/i
    ];
    
    for (const pattern of intervieweePatterns) {
      const match = title.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim().replace(/[.,;:]$/, '');
        if (name.length > 2 && name.length < 50) {
          tags.add(name);
        }
        break;
      }
    }
    
    // Musical entities with high specificity
    this.extractMusicalEntities(content, tags);
    
    // Interview-specific contexts
    if (text.includes('debut') || text.includes('first time')) tags.add('Debut Performance');
    if (text.includes('farewell') || text.includes('final performance')) tags.add('Farewell Performance');
    if (text.includes('master class') || text.includes('masterclass')) tags.add('Master Class');
    if (text.includes('young artist')) tags.add('Young Artists Program');
  }
  
  static analyzeReviewContent(content, title, tags) {
    const text = content.toLowerCase();
    
    // Extract performance details from title
    const performanceMatch = title.match(/(.+?)\s+(?:at|in)\s+(.+?)(?:\s|$)/i);
    if (performanceMatch) {
      const work = performanceMatch[1].trim();
      const venue = performanceMatch[2].trim();
      if (work.length > 2 && work.length < 50) tags.add(work);
      if (venue.length > 2 && venue.length < 50) tags.add(venue);
    }
    
    this.extractMusicalEntities(content, tags);
    
    // Review-specific contexts
    if (text.includes('opening night') || text.includes('premiere')) tags.add('Opening Night');
    if (text.includes('matinee')) tags.add('Matinee Performance');
    if (text.includes('gala')) tags.add('Gala Performance');
    if (text.includes('special guest') || text.includes('guest artist')) tags.add('Guest Artist');
  }
  
  static analyzeArticleContent(content, title, tags) {
    this.extractMusicalEntities(content, tags);
    
    // Article-specific themes
    const text = content.toLowerCase();
    if (text.includes('festival')) {
      // Extract festival names
      const festivalMatches = content.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Festival/g);
      if (festivalMatches) {
        festivalMatches.forEach(match => {
          const festivalName = match.trim();
          if (festivalName.length < 50) tags.add(festivalName);
        });
      }
    }
    
    if (text.includes('anniversary')) tags.add('Anniversary');
    if (text.includes('memorial') || text.includes('tribute')) tags.add('Memorial Concert');
  }
  
  static analyzeProfessionalContent(content, title, tags) {
    const text = content.toLowerCase();
    
    // Professional expertise areas (specific, not generic)
    const expertiseTerms = [
      'Probabilistic Risk Assessment', 'Monte Carlo Simulation', 'Decision Analysis',
      'Cost-Benefit Analysis', 'Environmental Risk Assessment', 'Nuclear Safety',
      'Fault Tree Analysis', 'Event Tree Analysis', 'Uncertainty Quantification',
      'Bayesian Analysis', 'Expert Elicitation', 'Multi-Criteria Decision Analysis'
    ];
    
    expertiseTerms.forEach(term => {
      if (text.includes(term.toLowerCase())) {
        tags.add(term);
      }
    });
    
    // Government agencies and organizations (full names preferred)
    const organizations = [
      { short: 'epa', full: 'Environmental Protection Agency' },
      { short: 'nrc', full: 'Nuclear Regulatory Commission' },
      { short: 'epri', full: 'Electric Power Research Institute' },
      { short: 'stanford university', full: 'Stanford University' },
      { short: 'lawrence livermore', full: 'Lawrence Livermore National Laboratory' }
    ];
    
    organizations.forEach(org => {
      if (text.includes(org.short) || text.includes(org.full.toLowerCase())) {
        tags.add(org.full);
      }
    });
    
    // Technical areas
    if (text.includes('nuclear waste') || text.includes('radioactive waste')) {
      tags.add('Nuclear Waste Management');
    }
    if (text.includes('climate') && text.includes('change')) {
      tags.add('Climate Change Policy');
    }
  }
  
  static extractMusicalEntities(content, tags) {
    // Composers (prefer full names)
    const composers = [
      { pattern: /wolfgang amadeus mozart|mozart/i, name: 'Wolfgang Amadeus Mozart' },
      { pattern: /ludwig van beethoven|beethoven/i, name: 'Ludwig van Beethoven' },
      { pattern: /richard wagner|wagner/i, name: 'Richard Wagner' },
      { pattern: /giacomo puccini|puccini/i, name: 'Giacomo Puccini' },
      { pattern: /giuseppe verdi|verdi/i, name: 'Giuseppe Verdi' },
      { pattern: /johannes brahms|brahms/i, name: 'Johannes Brahms' },
      { pattern: /gustav mahler|mahler/i, name: 'Gustav Mahler' },
      { pattern: /benjamin britten|britten/i, name: 'Benjamin Britten' },
      { pattern: /richard strauss/i, name: 'Richard Strauss' },
      { pattern: /franz schubert|schubert/i, name: 'Franz Schubert' },
      { pattern: /johann sebastian bach|j\.?s\.? bach|bach/i, name: 'Johann Sebastian Bach' }
    ];
    
    composers.forEach(composer => {
      if (composer.pattern.test(content)) {
        tags.add(composer.name);
      }
    });
    
    // Venues (specific institutions)
    const venues = [
      'San Francisco Opera', 'San Francisco Symphony', 'Carnegie Hall',
      'Davies Symphony Hall', 'War Memorial Opera House', 'Metropolitan Opera',
      'Lincoln Center', 'Royal Opera House', 'Vienna State Opera',
      'Berkeley Opera', 'Oakland East Bay Symphony'
    ];
    
    venues.forEach(venue => {
      if (content.toLowerCase().includes(venue.toLowerCase())) {
        tags.add(venue);
      }
    });
    
    // Musical works (famous operas and symphonies)
    const works = [
      'Don Giovanni', 'The Magic Flute', 'The Marriage of Figaro', 'Così fan tutte',
      'Ring Cycle', 'Das Rheingold', 'Die Walküre', 'Siegfried', 'Götterdämmerung',
      'Tristan and Isolde', 'Parsifal', 'The Flying Dutchman', 'Tannhäuser',
      'La Bohème', 'Tosca', 'Turandot', 'Madama Butterfly',
      'La Traviata', 'Il Trovatore', 'Rigoletto', 'Aida', 'Otello', 'Falstaff',
      'War Requiem', 'Ninth Symphony', 'Eroica Symphony', 'Pastoral Symphony'
    ];
    
    works.forEach(work => {
      if (content.toLowerCase().includes(work.toLowerCase())) {
        tags.add(work);
      }
    });
    
    // Voice types and instruments (only if clearly mentioned)
    const voicesInstruments = [
      'Soprano', 'Mezzo-soprano', 'Alto', 'Tenor', 'Baritone', 'Bass',
      'Piano', 'Violin', 'Viola', 'Cello', 'Flute', 'Trumpet', 'French Horn'
    ];
    
    voicesInstruments.forEach(voice => {
      // Only include if mentioned with sufficient context
      const regex = new RegExp(`\\b${voice.toLowerCase()}\\b`, 'i');
      if (regex.test(content)) {
        tags.add(voice);
      }
    });
  }
  
  static isHighQualityTag(tag, content) {
    // Filter out generic/low-quality tags
    const genericWords = [
      'his', 'her', 'the', 'and', 'but', 'for', 'when', 'where', 'what', 'who',
      'this', 'that', 'these', 'those', 'one', 'two', 'three', 'first', 'second',
      'during', 'after', 'before', 'while', 'here', 'there', 'now', 'then',
      'some', 'many', 'few', 'all', 'most', 'other', 'another', 'such', 'much',
      'more', 'less', 'very', 'quite', 'rather', 'too', 'so', 'just', 'only',
      'also', 'even', 'still', 'yet', 'already', 'again', 'once', 'twice',
      'both', 'either', 'neither', 'each', 'every', 'any', 'no', 'none'
    ];
    
    if (genericWords.includes(tag.toLowerCase())) return false;
    
    // Must be at least 3 characters
    if (tag.length < 3) return false;
    
    // Must start with capital letter (proper nouns)
    if (!/^[A-Z]/.test(tag)) return false;
    
    // Must not be mostly punctuation
    if (tag.replace(/[a-zA-Z\s]/g, '').length > tag.length / 2) return false;
    
    // Must appear in content (case insensitive)
    if (!content.toLowerCase().includes(tag.toLowerCase())) return false;
    
    // Should be reasonable length
    if (tag.length > 60) return false;
    
    return true;
  }
  
  static scoreTagQuality(currentTags, suggestedTags, content, type) {
    let score = 0;
    const issues = [];
    const improvements = [];
    
    // Analyze current tags
    currentTags.forEach(tag => {
      if (tag.length < 3) {
        issues.push(`Too short: "${tag}"`);
        score -= 2;
      }
      if (!this.isHighQualityTag(tag, content)) {
        issues.push(`Low quality: "${tag}"`);
        score -= 1;
      }
      if (!content.toLowerCase().includes(tag.toLowerCase())) {
        issues.push(`Not in content: "${tag}"`);
        score -= 3;
      } else {
        score += 1; // Present in content
      }
    });
    
    // Analyze suggested improvements
    const newTags = suggestedTags.filter(tag => !currentTags.includes(tag));
    newTags.forEach(tag => {
      improvements.push(`Add: "${tag}"`);
      score += 2;
    });
    
    return { 
      score, 
      issues, 
      improvements,
      quality: score > 0 ? 'Good' : score > -5 ? 'Fair' : 'Poor'
    };
  }
}

function analyzeFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);
  
  const currentTags = frontmatter.subjects || [];
  const suggestedTags = SmartTagGenerator.analyzeContent(
    content, 
    frontmatter.title || '', 
    frontmatter.type || 'unknown'
  );
  
  const analysis = SmartTagGenerator.scoreTagQuality(
    currentTags, 
    suggestedTags, 
    content, 
    frontmatter.type
  );
  
  return {
    slug: path.basename(filePath, '.md'),
    title: frontmatter.title,
    type: frontmatter.type,
    currentTags,
    suggestedTags,
    analysis,
    wordCount: content.split(/\s+/).length
  };
}

function generateReport() {
  const contentDir = path.join(process.cwd(), 'public', 'content');
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  console.log('🎯 SMART TAG ANALYSIS REPORT');
  console.log('=' * 50);
  console.log(`Analyzing ${files.length} content files...\n`);
  
  const analyses = files.map(analyzeFile);
  
  // Summary statistics
  const totalFiles = analyses.length;
  const filesWithTags = analyses.filter(a => a.currentTags.length > 0).length;
  const avgCurrentTags = analyses.reduce((sum, a) => sum + a.currentTags.length, 0) / totalFiles;
  const avgSuggestedTags = analyses.reduce((sum, a) => sum + a.suggestedTags.length, 0) / totalFiles;
  const avgQualityScore = analyses.reduce((sum, a) => sum + a.analysis.score, 0) / totalFiles;
  
  console.log('📊 SUMMARY STATISTICS:');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Files with existing tags: ${filesWithTags} (${(filesWithTags/totalFiles*100).toFixed(1)}%)`);
  console.log(`Average current tags per file: ${avgCurrentTags.toFixed(1)}`);
  console.log(`Average suggested tags per file: ${avgSuggestedTags.toFixed(1)}`);
  console.log(`Average quality score: ${avgQualityScore.toFixed(1)}`);
  
  // Quality distribution
  const qualityDist = analyses.reduce((acc, a) => {
    acc[a.analysis.quality] = (acc[a.analysis.quality] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📈 QUALITY DISTRIBUTION:');
  Object.entries(qualityDist).forEach(([quality, count]) => {
    console.log(`  ${quality}: ${count} files (${(count/totalFiles*100).toFixed(1)}%)`);
  });
  
  // Files needing most improvement
  const poorQuality = analyses
    .filter(a => a.analysis.quality === 'Poor')
    .sort((a, b) => a.analysis.score - b.analysis.score)
    .slice(0, 8);
  
  console.log('\n⚠️  FILES NEEDING IMPROVEMENT (Poor Quality):');
  poorQuality.forEach(file => {
    console.log(`\n📄 ${file.slug} (${file.type}) - Score: ${file.analysis.score}`);
    console.log(`   Title: ${file.title}`);
    console.log(`   Current: [${file.currentTags.join(', ')}]`);
    console.log(`   Suggested: [${file.suggestedTags.join(', ')}]`);
    if (file.analysis.issues.length > 0) {
      console.log(`   Issues: ${file.analysis.issues.slice(0, 3).join('; ')}`);
    }
  });
  
  // Sample good improvements
  const goodImprovements = analyses
    .filter(a => a.suggestedTags.length > a.currentTags.length && a.suggestedTags.length <= 10)
    .sort((a, b) => (b.suggestedTags.length - b.currentTags.length) - (a.suggestedTags.length - a.currentTags.length))
    .slice(0, 5);
  
  console.log('\n✨ SAMPLE IMPROVEMENTS (Reasonable additions):');
  goodImprovements.forEach(file => {
    const newTags = file.suggestedTags.filter(tag => !file.currentTags.includes(tag));
    console.log(`\n📄 ${file.slug} (${file.type})`);
    console.log(`   Title: ${file.title}`);
    console.log(`   Add: [${newTags.join(', ')}]`);
  });
  
  // Tag frequency analysis
  const allSuggestedTags = analyses.flatMap(a => a.suggestedTags);
  const tagFreq = {};
  allSuggestedTags.forEach(tag => tagFreq[tag] = (tagFreq[tag] || 0) + 1);
  
  const topTags = Object.entries(tagFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15);
  
  console.log('\n🏷️  MOST VALUABLE TAGS:');
  topTags.forEach(([tag, count]) => {
    console.log(`  ${tag}: ${count} files`);
  });
  
  console.log('\n\n💡 KEY RECOMMENDATIONS:');
  console.log('1. 📍 Focus on specific names (people, venues, works) rather than generic terms');
  console.log('2. 🎭 Use full composer names ("Wolfgang Amadeus Mozart" not "Mozart")');
  console.log('3. 🏛️  Include specific venue names ("San Francisco Opera" not just "Opera")');
  console.log('4. 🎼 Add musical work titles when mentioned in content');
  console.log('5. 👤 For interviews, always include interviewee name as primary tag');
  console.log('6. 🔬 For professional content, focus on specific methodologies');
  console.log('7. 🚫 Avoid generic words like "his", "the", "during", etc.');
  
  console.log('\n🚀 To apply improvements: node scripts/improve-tags.js --update');
  
  return analyses;
}

function updateFiles(analyses) {
  console.log('\n🔄 UPDATING FILES WITH SMART TAGS...\n');
  
  let updatedCount = 0;
  
  // Only update files that really need it
  const filesToUpdate = analyses.filter(a => 
    a.analysis.quality === 'Poor' || 
    (a.suggestedTags.length > a.currentTags.length && a.suggestedTags.length <= 12)
  );
  
  filesToUpdate.forEach(analysis => {
    const filePath = path.join(process.cwd(), 'public', 'content', `${analysis.slug}.md`);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      // Update subjects with smart tags
      frontmatter.subjects = analysis.suggestedTags;
      
      // Reconstruct file
      const updatedFile = matter.stringify(content, frontmatter);
      fs.writeFileSync(filePath, updatedFile, 'utf8');
      
      console.log(`✅ ${analysis.slug}: ${analysis.currentTags.length} → ${analysis.suggestedTags.length} tags`);
      updatedCount++;
      
    } catch (error) {
      console.error(`❌ Error updating ${analysis.slug}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Successfully updated ${updatedCount} files!`);
  console.log(`📝 Consider manually reviewing the changes before committing.`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const shouldUpdate = args.includes('--update') || args.includes('-u');
  
  if (shouldUpdate) {
    console.log('⚠️  UPDATE MODE: Files will be modified with new tags');
    console.log('🔒 Make sure you have committed your current changes first!\n');
  }
  
  const analyses = generateReport();
  
  if (shouldUpdate) {
    updateFiles(analyses);
  }
}

if (require.main === module) {
  main();
}

module.exports = { SmartTagGenerator, analyzeFile, generateReport, updateFiles };
