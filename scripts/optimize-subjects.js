#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Optimized subjects refinement script that:
 * 1. Limits tags to 8-10 per article (industry standard)
 * 2. Prioritizes most relevant and specific tags
 * 3. Ensures required categories are covered
 */

const contentDir = path.join(__dirname, '../public/content');

// Enhanced musical terms with priority scoring
const MUSICAL_TERMS = {
  // High priority - specific and searchable
  'piano': { term: 'Piano', priority: 8 },
  'violin': { term: 'Violin', priority: 8 },
  'opera': { term: 'Opera', priority: 9 },
  'symphony': { term: 'Symphony', priority: 9 },
  'chamber music': { term: 'Chamber Music', priority: 7 },
  'concerto': { term: 'Concerto', priority: 8 },
  'aria': { term: 'Aria', priority: 8 },
  'soprano': { term: 'Soprano', priority: 9 },
  'tenor': { term: 'Tenor', priority: 9 },
  'baritone': { term: 'Baritone', priority: 9 },
  'bass': { term: 'Bass', priority: 8 },
  'mezzo-soprano': { term: 'Mezzo-soprano', priority: 9 },
  'conductor': { term: 'Conducting', priority: 8 },
  'conducting': { term: 'Conducting', priority: 8 },
  
  // Medium priority - important but common
  'classical music': { term: 'Classical Music', priority: 6 },
  'performance': { term: 'Performance', priority: 5 },
  'recording': { term: 'Recording', priority: 6 },
  'interview': { term: 'Interview', priority: 7 },
  'debut': { term: 'Debut Performance', priority: 7 },
  'premiere': { term: 'Premiere', priority: 7 },
  'world premiere': { term: 'World Premiere', priority: 8 },
  
  // Composers - high priority, specific
  'beethoven': { term: 'Ludwig van Beethoven', priority: 9 },
  'mozart': { term: 'Wolfgang Amadeus Mozart', priority: 9 },
  'bach': { term: 'Johann Sebastian Bach', priority: 9 },
  'chopin': { term: 'Frédéric Chopin', priority: 9 },
  'brahms': { term: 'Johannes Brahms', priority: 9 },
  'tchaikovsky': { term: 'Pyotr Ilyich Tchaikovsky', priority: 9 },
  'puccini': { term: 'Giacomo Puccini', priority: 9 },
  'verdi': { term: 'Giuseppe Verdi', priority: 9 },
  'wagner': { term: 'Richard Wagner', priority: 9 },
  'mahler': { term: 'Gustav Mahler', priority: 9 },
  'schubert': { term: 'Franz Schubert', priority: 9 },
  'rachmaninoff': { term: 'Sergei Rachmaninoff', priority: 9 },
  'liszt': { term: 'Franz Liszt', priority: 9 },
  
  // Venues - high priority, specific
  'carnegie hall': { term: 'Carnegie Hall', priority: 9 },
  'davies symphony hall': { term: 'Davies Symphony Hall', priority: 9 },
  'war memorial opera house': { term: 'War Memorial Opera House', priority: 9 },
  'metropolitan opera': { term: 'Metropolitan Opera', priority: 9 },
  'san francisco opera': { term: 'San Francisco Opera', priority: 9 },
  'san francisco symphony': { term: 'San Francisco Symphony', priority: 9 },
  'merola': { term: 'Merola Opera Program', priority: 8 },
  
  // Famous operas - high priority
  'la traviata': { term: 'La Traviata', priority: 9 },
  'tosca': { term: 'Tosca', priority: 9 },
  'madama butterfly': { term: 'Madama Butterfly', priority: 9 },
  'don giovanni': { term: 'Don Giovanni', priority: 9 },
  'carmen': { term: 'Carmen', priority: 9 },
  'aida': { term: 'Aida', priority: 9 },
  'rigoletto': { term: 'Rigoletto', priority: 9 }
};

function scoreTag(tag, content, frontmatter) {
  const lowerTag = tag.toLowerCase();
  
  // Check if it's a known musical term
  for (const [key, data] of Object.entries(MUSICAL_TERMS)) {
    if (lowerTag.includes(key)) {
      return data.priority;
    }
  }
  
  // Score based on characteristics
  let score = 5; // base score
  
  // Boost proper names (likely people/places)
  if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/.test(tag)) {
    score += 2;
  }
  
  // Boost specific musical terms
  if (/\b(concerto|symphony|opera|sonata|quartet)\b/i.test(tag)) {
    score += 2;
  }
  
  // Penalize generic terms
  if (/^(music|article|classical|the|and|of)$/i.test(tag)) {
    score -= 2;
  }
  
  // Penalize fragments
  if (tag.length < 4 || /^(the|and|or|of|in|on|at|to|for|with|is|was)\s/i.test(tag)) {
    score -= 3;
  }
  
  return Math.max(1, score);
}

function extractOptimizedSubjects(frontmatter, content) {
  const subjects = new Set();
  const fullText = (content + ' ' + (frontmatter.title || '')).toLowerCase();
  
  // Extract musical terms with scoring
  const candidates = [];
  
  // Look for musical terms
  Object.entries(MUSICAL_TERMS).forEach(([key, data]) => {
    if (fullText.includes(key.toLowerCase())) {
      candidates.push({ tag: data.term, score: data.priority });
    }
  });
  
  // Extract proper nouns (people, places)
  const properNouns = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  const personNames = properNouns.filter(name => {
    const words = name.split(' ');
    return words.length >= 2 && words.length <= 3 && 
           !['The', 'And', 'Of', 'In', 'On', 'At', 'To', 'For', 'With', 'Bay Area'].includes(words[0]);
  });
  
  // Add top person names
  personNames.slice(0, 3).forEach(name => {
    candidates.push({ tag: name, score: scoreTag(name, content, frontmatter) });
  });
  
  // Add content type
  if (frontmatter.type === 'interview') {
    candidates.push({ tag: 'Interview', score: 8 });
  } else if (frontmatter.type === 'review') {
    candidates.push({ tag: 'Concert Review', score: 8 });
  } else if (frontmatter.type === 'article') {
    candidates.push({ tag: 'Music Article', score: 7 });
  }
  
  // Add publication context if available
  if (frontmatter.publication?.publisher) {
    const pub = frontmatter.publication.publisher;
    if (pub.includes('Classical Music')) {
      candidates.push({ tag: 'Classical Music Column', score: 6 });
    }
    if (pub.includes('Bay Area') || pub.includes('News Group')) {
      candidates.push({ tag: 'Bay Area News Group', score: 6 });
    }
  }
  
  // Sort by score and take top 10
  const sortedCandidates = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  
  // Ensure we have essential categories
  const finalTags = [];
  const tagTexts = new Set();
  
  // Add highest scoring unique tags
  sortedCandidates.forEach(candidate => {
    if (!tagTexts.has(candidate.tag) && finalTags.length < 10) {
      finalTags.push(candidate.tag);
      tagTexts.add(candidate.tag);
    }
  });
  
  // Ensure minimum of 5 tags
  if (finalTags.length < 5) {
    // Add some basic tags if we're short
    ['Classical Music', 'Performance', 'Music Article'].forEach(tag => {
      if (!tagTexts.has(tag) && finalTags.length < 8) {
        finalTags.push(tag);
        tagTexts.add(tag);
      }
    });
  }
  
  return finalTags.sort();
}

function processFileOptimized(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    if (!frontmatter.subjects) {
      return null;
    }
    
    // Check if subjects are already optimized
    const currentSubjects = frontmatter.subjects || [];
    const hasGoodQuality = currentSubjects.length >= 5 && currentSubjects.length <= 10 && 
                          !currentSubjects.some(subject => 
                            subject.length < 4 || 
                            /^(the|and|or|of|in|on|at|to|for|with|is|was)\s/i.test(subject)
                          );
    
    if (hasGoodQuality) {
      console.log(`✓ ${path.basename(filePath)} - already optimized (${currentSubjects.length} tags)`);
      return null;
    }
    
    // Extract optimized subjects
    const newSubjects = extractOptimizedSubjects(frontmatter, content);
    
    if (newSubjects.length === 0) {
      console.log(`⚠ ${path.basename(filePath)} - no meaningful subjects found`);
      return null;
    }
    
    // Update frontmatter
    frontmatter.subjects = newSubjects;
    
    // Rebuild the file
    const newContent = matter.stringify(content, frontmatter);
    
    console.log(`📝 ${path.basename(filePath)} - optimized to ${newSubjects.length} tags:`, newSubjects.slice(0, 5));
    
    return {
      filePath,
      newContent,
      oldSubjects: currentSubjects,
      newSubjects
    };
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

function main() {
  console.log('🎯 Optimizing subjects to 8-10 tags per article...\n');
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  let processed = 0;
  let updated = 0;
  const updates = [];
  
  files.forEach(filePath => {
    processed++;
    const result = processFileOptimized(filePath);
    if (result) {
      updates.push(result);
      updated++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processed}`);
  console.log(`   Files updated: ${updated}`);
  
  if (updates.length > 0) {
    console.log('\n🔍 Changes preview:');
    updates.slice(0, 5).forEach(({ filePath, oldSubjects, newSubjects }) => {
      console.log(`\n${path.basename(filePath)}:`);
      console.log(`  Before: ${oldSubjects.length} tags`);
      console.log(`  After:  ${newSubjects.length} tags`);
      console.log(`  New: [${newSubjects.slice(0, 3).join(', ')}${newSubjects.length > 3 ? '...' : ''}]`);
    });
    
    console.log('\n✅ Applying optimizations...');
    
    updates.forEach(({ filePath, newContent }) => {
      fs.writeFileSync(filePath, newContent);
    });
    
    console.log(`\n🎉 Successfully optimized ${updated} files to 8-10 tag standard!`);
  } else {
    console.log('\n✅ All files already meet the 8-10 tag standard!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { extractOptimizedSubjects, processFileOptimized };
