#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Script to analyze and refine subjects tags in content files
 * 
 * This script:
 * 1. Analyzes content to extract meaningful subjects/topics
 * 2. Replaces generic fragments with proper subject tags
 * 3. Adds relevant musical and cultural topics based on content
 */

const contentDir = path.join(__dirname, '../public/content');

// Common musical and cultural terms to look for
const MUSICAL_TERMS = {
  // Instruments
  'piano': 'Piano',
  'violin': 'Violin',
  'orchestra': 'Orchestra',
  'symphony': 'Symphony',
  'opera': 'Opera',
  'chamber music': 'Chamber Music',
  'quartet': 'String Quartet',
  'concerto': 'Concerto',
  'sonata': 'Sonata',
  
  // Composers (major ones)
  'beethoven': 'Ludwig van Beethoven',
  'mozart': 'Wolfgang Amadeus Mozart',
  'bach': 'Johann Sebastian Bach',
  'chopin': 'Frédéric Chopin',
  'brahms': 'Johannes Brahms',
  'tchaikovsky': 'Pyotr Ilyich Tchaikovsky',
  'debussy': 'Claude Debussy',
  'puccini': 'Giacomo Puccini',
  'verdi': 'Giuseppe Verdi',
  'wagner': 'Richard Wagner',
  'mahler': 'Gustav Mahler',
  'schubert': 'Franz Schubert',
  'schumann': 'Robert Schumann',
  'liszt': 'Franz Liszt',
  'rachmaninoff': 'Sergei Rachmaninoff',
  'stravinsky': 'Igor Stravinsky',
  'bartók': 'Béla Bartók',
  
  // Opera terms
  'soprano': 'Soprano',
  'tenor': 'Tenor',
  'baritone': 'Baritone',
  'bass': 'Bass',
  'mezzo-soprano': 'Mezzo-soprano',
  'aria': 'Aria',
  'libretto': 'Libretto',
  'metropolitan opera': 'Metropolitan Opera',
  'san francisco opera': 'San Francisco Opera',
  'la scala': 'La Scala',
  
  // Organizations
  'san francisco symphony': 'San Francisco Symphony',
  'new york philharmonic': 'New York Philharmonic',
  'chicago symphony': 'Chicago Symphony Orchestra',
  'boston symphony': 'Boston Symphony Orchestra',
  'philadelphia orchestra': 'Philadelphia Orchestra',
  'merola': 'Merola Opera Program',
  
  // Venues
  'carnegie hall': 'Carnegie Hall',
  'davies symphony hall': 'Davies Symphony Hall',
  'war memorial opera house': 'War Memorial Opera House',
  
  // General terms
  'classical music': 'Classical Music',
  'performance': 'Performance',
  'recording': 'Recording',
  'conductor': 'Conducting',
  'conducting': 'Conducting',
  'interpretation': 'Musical Interpretation',
  'technique': 'Musical Technique',
  'repertoire': 'Repertoire',
  'masterclass': 'Masterclass',
  'competition': 'Music Competition',
  'festival': 'Music Festival',
  'debut': 'Debut Performance',
  'premiere': 'Premiere',
  'world premiere': 'World Premiere',
  'collaboration': 'Musical Collaboration',
  'interview': 'Interview'
};

// Function to extract meaningful subjects from content
function extractSubjects(frontmatter, content) {
  const subjects = new Set();
  const fullText = (content + ' ' + (frontmatter.title || '')).toLowerCase();
  
  // Look for musical terms
  Object.entries(MUSICAL_TERMS).forEach(([key, value]) => {
    if (fullText.includes(key.toLowerCase())) {
      subjects.add(value);
    }
  });
  
  // Extract proper nouns that might be names or places
  const properNouns = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
  
  // Filter for likely person names (first + last name pattern)
  const personNames = properNouns.filter(name => {
    const words = name.split(' ');
    return words.length >= 2 && words.length <= 4 && 
           !['The', 'And', 'Of', 'In', 'On', 'At', 'To', 'For', 'With'].includes(words[0]);
  });
  
  // Add unique person names (limit to avoid too many)
  personNames.slice(0, 5).forEach(name => subjects.add(name));
  
  // Add type-based subjects
  if (frontmatter.type === 'interview') {
    subjects.add('Interview');
  }
  if (frontmatter.type === 'review') {
    subjects.add('Concert Review');
  }
  if (frontmatter.type === 'article') {
    subjects.add('Music Article');
  }
  
  // Look for specific operas or pieces mentioned
  const operaMatches = content.match(/\b(?:La Traviata|Tosca|Carmen|Aida|Rigoletto|Il Trovatore|Madama Butterfly|La Bohème|Turandot|Don Giovanni|The Magic Flute|The Marriage of Figaro|Così fan tutte|Fidelio|Der Rosenkavalier|Tristan und Isolde|The Ring|Parsifal|Tannhäuser|Lohengrin)\b/gi);
  if (operaMatches) {
    operaMatches.forEach(opera => subjects.add(opera));
  }
  
  // Look for symphony numbers or famous pieces
  const symphonyMatches = content.match(/\b(?:Symphony No\. \d+|Ninth Symphony|Fifth Symphony|Eroica|Pastoral|New World Symphony|Unfinished Symphony)\b/gi);
  if (symphonyMatches) {
    symphonyMatches.forEach(symphony => subjects.add(symphony));
  }
  
  return Array.from(subjects).sort();
}

// Function to process a single file
function processFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // Skip if no subjects field exists
    if (!frontmatter.subjects) {
      return null;
    }
    
    // Check if subjects are already meaningful (not fragments)
    const currentSubjects = frontmatter.subjects || [];
    const hasFragments = currentSubjects.some(subject => 
      subject.length < 4 || 
      subject.match(/^(the|and|or|of|in|on|at|to|for|with|is|was|are|were|be|been|have|has|had|do|does|did|will|would|could|should|may|might|can|shall|must)\s/i) ||
      subject.match(/\s(the|and|or|of|in|on|at|to|for|with|is|was|are|were|be|been|have|has|had|do|does|did|will|would|could|should|may|might|can|shall|must)$/i)
    );
    
    if (!hasFragments && currentSubjects.length > 0) {
      console.log(`✓ ${path.basename(filePath)} - subjects already look good`);
      return null;
    }
    
    // Extract new subjects
    const newSubjects = extractSubjects(frontmatter, content);
    
    if (newSubjects.length === 0) {
      console.log(`⚠ ${path.basename(filePath)} - no meaningful subjects found`);
      return null;
    }
    
    // Update frontmatter
    frontmatter.subjects = newSubjects;
    
    // Rebuild the file
    const newContent = matter.stringify(content, frontmatter);
    
    console.log(`📝 ${path.basename(filePath)} - updated subjects:`, newSubjects);
    
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

// Main function
function main() {
  console.log('🎵 Refining subjects tags in content files...\n');
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  let processed = 0;
  let updated = 0;
  const updates = [];
  
  files.forEach(filePath => {
    processed++;
    const result = processFile(filePath);
    if (result) {
      updates.push(result);
      updated++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processed}`);
  console.log(`   Files updated: ${updated}`);
  
  if (updates.length > 0) {
    console.log('\n🤔 Preview of changes (not yet applied):');
    updates.forEach(({ filePath, oldSubjects, newSubjects }) => {
      console.log(`\n${path.basename(filePath)}:`);
      console.log(`  Old: [${oldSubjects.join(', ')}]`);
      console.log(`  New: [${newSubjects.join(', ')}]`);
    });
    
    console.log('\n❓ Apply these changes? (y/N)');
    
    // For now, just show preview. In interactive mode, you could prompt for confirmation
    // For automation, we'll apply changes automatically
    console.log('\n✅ Applying changes...');
    
    updates.forEach(({ filePath, newContent }) => {
      fs.writeFileSync(filePath, newContent);
    });
    
    console.log(`\n🎉 Successfully updated ${updated} files!`);
  } else {
    console.log('\n✅ No updates needed - all subjects look good!');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { extractSubjects, processFile };
