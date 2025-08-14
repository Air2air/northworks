#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Improved interview extraction with better role detection
 */
async function extractInterviewsImproved() {
  const inputFile = path.join(__dirname, '../public/content/c_interviews.md');
  const outputFile = path.join(__dirname, '../src/data/interviews-improved.json');
  
  try {
    console.log('🔍 Reading interviews file...');
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);
    
    console.log('📝 Extracting interview entries with improved role detection...');
    const interviews = [];
    
    // Split content into sections - each interview starts with a thumbnail image or name
    const sections = content.split(/\[\*\]/g).filter(section => section.trim());
    
    console.log(`Found ${sections.length} potential interview sections`);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      try {
        const interview = parseImprovedInterviewSection(section, i + 1);
        if (interview) {
          interviews.push(interview);
        }
      } catch (error) {
        console.warn(`⚠️  Error parsing section ${i + 1}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully extracted ${interviews.length} interviews with improved parsing`);
    
    // Create the final JSON structure
    const jsonData = {
      metadata: {
        id: "interviews_collection_improved",
        type: "index",
        category: "classical-music",
        subcategory: "interview-directory",
        status: "published",
        featured: true
      },
      content: {
        title: "Interviews (Improved)",
        summary: "A comprehensive collection of interviews with classical music artists, conductors, and composers with enhanced role detection",
        body: "Interviews conducted for various publications including ANG Newspapers, Bay Area News Group, Oakland Tribune, and San Francisco Examiner."
      },
      publication: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      legacy: {
        originalFile: "c_interviews.md",
        totalEntries: interviews.length,
        thumbnailImages: frontMatter.images?.length || 0,
        extractionVersion: "improved"
      },
      interviews: interviews
    };
    
    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`💾 Saved improved interviews data to: ${outputFile}`);
    
    // Generate detailed statistics
    generateDetailedInterviewStats(interviews);
    
  } catch (error) {
    console.error('❌ Error extracting interviews:', error);
    process.exit(1);
  }
}

/**
 * Parse individual interview section with improved role detection
 */
function parseImprovedInterviewSection(section, index) {
  const lines = section.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  let name = '';
  let title = '';
  let url = '';
  let thumbnail = '';
  let publication = '';
  let date = '';
  let description = '';
  let roleContext = '';
  
  // Extract data from the section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract thumbnail image
    if (line.includes('![](') && line.includes('.jpg')) {
      const match = line.match(/!\[.*?\]\((.*?)\)/);
      if (match && match[1]) {
        thumbnail = match[1];
      }
    }
    
    // Extract name and URL from markdown links
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch[2].includes('.htm')) {
      const fullName = linkMatch[1];
      url = linkMatch[2];
      
      // Parse name and context
      const nameData = parseNameAndRole(fullName);
      name = nameData.name;
      description = nameData.description;
      roleContext = nameData.roleContext;
      title = name;
    }
    
    // Extract publication info
    if (line.includes('Classical Music Column') || line.includes('ANG Newspapers') || line.includes('Bay Area News')) {
      publication = line.replace(/\*/g, '').trim();
    }
    
    // Extract dates
    const dateMatch = line.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{4}(?:,\s*\d{4})*/);
    if (dateMatch) {
      date = dateMatch[0];
    }
    
    // Simple date patterns
    const simpleDateMatch = line.match(/^\d{4}$/);
    if (simpleDateMatch && !date) {
      date = simpleDateMatch[0];
    }
  }
  
  // Generate ID from name
  const id = generateId(name, index);
  
  // Determine role with improved detection
  const role = determineImprovedRole(name, description, roleContext, url, section);
  
  // Generate enhanced subjects/tags
  const subjects = generateEnhancedSubjects(name, description, role, publication, roleContext);
  
  return {
    metadata: {
      id: id,
      type: "interview",
      category: "classical-music",
      subcategory: determineInterviewSubcategory(role),
      status: "published"
    },
    content: {
      title: title || name,
      summary: generateInterviewSummary(name, role, description),
      url: url
    },
    subject: {
      people: [{
        name: name,
        role: role,
        description: description || null
      }]
    },
    publication: {
      date: parseDate(date),
      publisher: extractPublisher(publication),
      publication: publication
    },
    media: {
      images: thumbnail ? [{
        url: thumbnail,
        type: "thumbnail",
        alt: `${name} portrait`
      }] : []
    },
    tags: subjects,
    legacy: {
      originalIndex: index,
      rawContent: section.substring(0, 200) + '...',
      extractionMethod: 'improved'
    }
  };
}

/**
 * Parse name and extract role context
 */
function parseNameAndRole(fullText) {
  let name = fullText;
  let description = '';
  let roleContext = '';
  
  // Handle comma-separated additional info
  if (fullText.includes(',')) {
    const parts = fullText.split(',');
    name = parts[0].trim();
    description = parts.slice(1).join(',').trim();
    roleContext = description.toLowerCase();
  }
  
  // Handle parenthetical info
  const parenMatch = fullText.match(/([^(]+)\(([^)]+)\)/);
  if (parenMatch) {
    name = parenMatch[1].trim();
    description = parenMatch[2].trim();
    roleContext = description.toLowerCase();
  }
  
  // Handle "on" phrases
  if (fullText.includes(' on ')) {
    const parts = fullText.split(' on ');
    name = parts[0].trim();
    description = `on ${parts.slice(1).join(' on ').trim()}`;
    roleContext = description.toLowerCase();
  }
  
  return { name, description, roleContext };
}

/**
 * Improved role determination with better detection
 */
function determineImprovedRole(name, description, roleContext, url, fullSection) {
  const allText = `${name} ${description} ${roleContext} ${url} ${fullSection}`.toLowerCase();
  
  // Enhanced role detection patterns
  const rolePatterns = {
    'pianist': [
      'piano', 'pianist', 'keyboard', 'pianoforte',
      /\bpiano\b/, /pianist/, /keyboard/
    ],
    'conductor': [
      'conductor', 'conducting', 'maestro', 'music director', 'artistic director',
      /conduct/i, /maestro/i, /director/i
    ],
    'soprano': [
      'soprano', /soprano/i
    ],
    'tenor': [
      'tenor', /tenor/i
    ],
    'baritone': [
      'baritone', /baritone/i
    ],
    'bass': [
      'bass singer', 'bass-baritone', /\bbass\b/i
    ],
    'mezzo-soprano': [
      'mezzo-soprano', 'mezzo', /mezzo/i
    ],
    'violinist': [
      'violin', 'violinist', 'concertmaster',
      /violin/i, /concertmaster/i
    ],
    'cellist': [
      'cello', 'cellist', /cello/i
    ],
    'composer': [
      'composer', 'composition', 'composing',
      /compos/i
    ],
    'opera singer': [
      'opera singer', 'opera', /opera.*singer/i
    ],
    'director': [
      'director', 'artistic director', 'general director',
      /director/i
    ],
    'jazz musician': [
      'jazz', 'marsalis', /jazz/i
    ],
    'author': [
      'author', 'writer', 'handler', 'snicket',
      /author/i, /writer/i
    ]
  };
  
  // Check URL patterns for additional context
  const urlPatterns = {
    'ax': 'pianist',
    'barantschik': 'violinist',
    'boulez': 'conductor',
    'cerny': 'director',
    'chang': 'violinist',
    'cleve': 'conductor',
    'conlon': 'conductor',
    'conte': 'composer',
    'dutoit': 'conductor',
    'gergiev': 'conductor',
    'masur': 'conductor',
    'mtt': 'conductor',
    'nagano': 'conductor',
    'runnicles': 'conductor'
  };
  
  // Check URL for specific musicians
  if (url) {
    for (const [urlPart, role] of Object.entries(urlPatterns)) {
      if (url.toLowerCase().includes(urlPart)) {
        return role;
      }
    }
  }
  
  // Check name-specific patterns
  const namePatterns = {
    'emanuel ax': 'pianist',
    'alexander barantschik': 'violinist',
    'pierre boulez': 'conductor',
    'james conlon': 'conductor',
    'charles dutoit': 'conductor',
    'valery gergiev': 'conductor',
    'kurt masur': 'conductor',
    'michael tilson thomas': 'conductor',
    'kent nagano': 'conductor',
    'donald runnicles': 'conductor',
    'sarah chang': 'violinist',
    'lang lang': 'pianist',
    'jean-yves thibaudet': 'pianist',
    'arcadi volodos': 'pianist',
    'dmitri hvorostovsky': 'baritone',
    'olga borodina': 'mezzo-soprano',
    'patricia racette': 'soprano',
    'samuel ramey': 'bass'
  };
  
  const nameLower = name.toLowerCase();
  if (namePatterns[nameLower]) {
    return namePatterns[nameLower];
  }
  
  // Pattern matching
  for (const [role, patterns] of Object.entries(rolePatterns)) {
    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        if (allText.includes(pattern)) {
          return role;
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(allText)) {
          return role;
        }
      }
    }
  }
  
  // Default fallback
  return 'classical musician';
}

/**
 * Determine interview subcategory based on role
 */
function determineInterviewSubcategory(role) {
  const categoryMap = {
    'conductor': 'conductor-interview',
    'pianist': 'pianist-interview',
    'violinist': 'instrumentalist-interview',
    'cellist': 'instrumentalist-interview',
    'soprano': 'singer-interview',
    'tenor': 'singer-interview',
    'baritone': 'singer-interview',
    'bass': 'singer-interview',
    'mezzo-soprano': 'singer-interview',
    'composer': 'composer-interview',
    'director': 'director-interview',
    'opera singer': 'singer-interview',
    'jazz musician': 'jazz-interview',
    'author': 'author-interview'
  };
  
  return categoryMap[role] || 'artist-interview';
}

/**
 * Generate interview summary
 */
function generateInterviewSummary(name, role, description) {
  const parts = [`Interview with ${name}`];
  
  if (role !== 'classical musician') {
    parts.push(role);
  }
  
  if (description) {
    parts.push(description);
  }
  
  return parts.join(', ');
}

/**
 * Generate enhanced subjects/tags
 */
function generateEnhancedSubjects(name, description, role, publication, roleContext) {
  const subjects = new Set();
  
  // Core tags
  subjects.add('Interview');
  subjects.add('Classical Music');
  
  // Role-based tags
  if (role && role !== 'classical musician') {
    const roleTag = role.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    subjects.add(roleTag);
  }
  
  // Instrument-specific tags
  const instrumentMap = {
    'pianist': 'Piano',
    'violinist': 'Violin',
    'cellist': 'Cello',
    'conductor': 'Conducting'
  };
  
  if (instrumentMap[role]) {
    subjects.add(instrumentMap[role]);
  }
  
  // Genre tags
  if (role.includes('opera') || roleContext.includes('opera')) {
    subjects.add('Opera');
  }
  
  if (role.includes('jazz') || roleContext.includes('jazz')) {
    subjects.add('Jazz');
  }
  
  // Publication tags
  if (publication) {
    if (publication.includes('ANG')) {
      subjects.add('ANG Newspapers');
    }
    if (publication.includes('Bay Area')) {
      subjects.add('Bay Area News Group');
    }
  }
  
  // Special context tags
  if (roleContext.includes('symphony')) {
    subjects.add('Symphony');
  }
  
  if (roleContext.includes('sf') || roleContext.includes('san francisco')) {
    subjects.add('San Francisco');
  }
  
  return Array.from(subjects).slice(0, 10);
}

/**
 * Generate ID from name
 */
function generateId(name, index) {
  if (!name) return `interview_${index}`;
  
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

/**
 * Parse date string to ISO format
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  try {
    if (dateStr.match(/^\d{4}$/)) {
      return `${dateStr}-01-01`;
    }
    
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  return dateStr;
}

/**
 * Extract publisher from publication string
 */
function extractPublisher(publication) {
  if (!publication) return null;
  
  if (publication.includes('ANG Newspapers')) return 'ANG Newspapers';
  if (publication.includes('Bay Area News Group')) return 'Bay Area News Group';
  if (publication.includes('Oakland Tribune')) return 'Oakland Tribune';
  if (publication.includes('San Francisco Examiner')) return 'San Francisco Examiner';
  
  return publication.split('Classical Music Column')[0].trim() || null;
}

/**
 * Generate detailed statistics
 */
function generateDetailedInterviewStats(interviews) {
  console.log('\n📊 Improved Interview Statistics:');
  console.log(`Total interviews: ${interviews.length}`);
  
  // Role distribution
  const roleCount = {};
  const subcategoryCount = {};
  
  interviews.forEach(interview => {
    const role = interview.subject.people[0]?.role || 'unknown';
    const subcategory = interview.metadata.subcategory || 'unknown';
    
    roleCount[role] = (roleCount[role] || 0) + 1;
    subcategoryCount[subcategory] = (subcategoryCount[subcategory] || 0) + 1;
  });
  
  console.log('\nRole distribution:');
  Object.entries(roleCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([role, count]) => {
      console.log(`  ${role}: ${count} (${Math.round(count/interviews.length*100)}%)`);
    });
  
  console.log('\nSubcategory distribution:');
  Object.entries(subcategoryCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([subcategory, count]) => {
      console.log(`  ${subcategory}: ${count} (${Math.round(count/interviews.length*100)}%)`);
    });
  
  // Sample of well-detected roles
  console.log('\nSample of improved role detection:');
  interviews
    .filter(i => i.subject.people[0]?.role !== 'classical musician')
    .slice(0, 5)
    .forEach((interview, i) => {
      console.log(`${i+1}. ${interview.subject.people[0].name} - ${interview.subject.people[0].role}`);
    });
}

// Run the improved extraction
if (require.main === module) {
  extractInterviewsImproved();
}

module.exports = { extractInterviewsImproved };
