#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Extract interview data from c_interviews.md and convert to structured JSON
 */
async function extractInterviewsToJson() {
  const inputFile = path.join(__dirname, '../public/content/c_interviews.md');
  const outputFile = path.join(__dirname, '../src/data/interviews.json');
  
  try {
    console.log('🔍 Reading interviews file...');
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);
    
    console.log('📝 Extracting interview entries...');
    const interviews = [];
    
    // Split content into sections - each interview starts with a thumbnail image or name
    const sections = content.split(/\[\*\]/g).filter(section => section.trim());
    
    console.log(`Found ${sections.length} potential interview sections`);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;
      
      try {
        const interview = parseInterviewSection(section, i + 1);
        if (interview) {
          interviews.push(interview);
        }
      } catch (error) {
        console.warn(`⚠️  Error parsing section ${i + 1}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully extracted ${interviews.length} interviews`);
    
    // Create the final JSON structure
    const jsonData = {
      metadata: {
        id: "interviews_collection",
        type: "index",
        category: "classical-music",
        subcategory: "interview-directory",
        status: "published",
        featured: true
      },
      content: {
        title: "Interviews",
        summary: "A comprehensive collection of interviews with classical music artists, conductors, and composers",
        body: "Interviews conducted for various publications including ANG Newspapers, Bay Area News Group, Oakland Tribune, and San Francisco Examiner."
      },
      publication: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      legacy: {
        originalFile: "c_interviews.md",
        totalEntries: interviews.length,
        thumbnailImages: frontMatter.images?.length || 0
      },
      interviews: interviews
    };
    
    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`💾 Saved interviews data to: ${outputFile}`);
    
    // Generate summary statistics
    generateInterviewStats(interviews);
    
  } catch (error) {
    console.error('❌ Error extracting interviews:', error);
    process.exit(1);
  }
}

/**
 * Parse individual interview section
 */
function parseInterviewSection(section, index) {
  const lines = section.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  let name = '';
  let title = '';
  let url = '';
  let thumbnail = '';
  let publication = '';
  let date = '';
  let description = '';
  
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
      name = linkMatch[1];
      url = linkMatch[2];
      title = name; // Use name as title initially
      
      // Check if there's additional info in the name
      if (name.includes(',')) {
        const parts = name.split(',');
        name = parts[0].trim();
        description = parts.slice(1).join(',').trim();
      }
    }
    
    // Extract publication info
    if (line.includes('Classical Music Column') || line.includes('ANG Newspapers') || line.includes('Bay Area News')) {
      publication = line.replace(/\*/g, '').trim();
    }
    
    // Extract dates (look for patterns like "February 18, 2005" or "2001,2002")
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
  
  // Determine role/instrument from name or description
  const role = determineRole(name, description, title);
  
  // Generate subjects/tags
  const subjects = generateSubjects(name, description, role, publication);
  
  return {
    metadata: {
      id: id,
      type: "interview",
      category: "classical-music",
      subcategory: "artist-interview",
      status: "published"
    },
    content: {
      title: title || name,
      summary: description || `Interview with ${name}`,
      url: url
    },
    subject: {
      people: [{
        name: name,
        role: role
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
      rawContent: section.substring(0, 200) + '...'
    }
  };
}

/**
 * Generate unique ID from name
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
 * Determine role/instrument from context
 */
function determineRole(name, description, title) {
  const text = `${name} ${description} ${title}`.toLowerCase();
  
  // Common roles in classical music
  const roles = {
    'pianist': ['piano', 'pianist'],
    'conductor': ['conductor', 'conducting'],
    'soprano': ['soprano'],
    'tenor': ['tenor'],
    'baritone': ['baritone'],
    'bass': ['bass'],
    'mezzo-soprano': ['mezzo'],
    'violinist': ['violin', 'violinist'],
    'cellist': ['cello', 'cellist'],
    'composer': ['composer', 'composition'],
    'opera singer': ['opera'],
    'director': ['director']
  };
  
  for (const [role, keywords] of Object.entries(roles)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return role;
    }
  }
  
  return 'classical musician';
}

/**
 * Generate subjects/tags
 */
function generateSubjects(name, description, role, publication) {
  const subjects = new Set();
  
  // Add role-based tags
  subjects.add('Interview');
  if (role && role !== 'classical musician') {
    subjects.add(role.charAt(0).toUpperCase() + role.slice(1));
  }
  
  // Add music-related tags
  subjects.add('Classical Music');
  
  // Add publication-related tags
  if (publication && publication.includes('ANG')) {
    subjects.add('ANG Newspapers');
  }
  if (publication && publication.includes('Bay Area')) {
    subjects.add('Bay Area News Group');
  }
  
  return Array.from(subjects).slice(0, 8); // Limit to 8 tags
}

/**
 * Parse date string to ISO format
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  try {
    // Handle various date formats
    if (dateStr.match(/^\d{4}$/)) {
      return `${dateStr}-01-01`; // Default to January 1st
    }
    
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  return dateStr; // Return original if parsing fails
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
 * Generate summary statistics
 */
function generateInterviewStats(interviews) {
  console.log('\n📊 Interview Statistics:');
  console.log(`Total interviews: ${interviews.length}`);
  
  // Count by role
  const roleCount = {};
  interviews.forEach(interview => {
    const role = interview.subject.people[0]?.role || 'unknown';
    roleCount[role] = (roleCount[role] || 0) + 1;
  });
  
  console.log('\nBy role:');
  Object.entries(roleCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([role, count]) => {
      console.log(`  ${role}: ${count}`);
    });
  
  // Count by publisher
  const publisherCount = {};
  interviews.forEach(interview => {
    const publisher = interview.publication.publisher || 'unknown';
    publisherCount[publisher] = (publisherCount[publisher] || 0) + 1;
  });
  
  console.log('\nBy publisher:');
  Object.entries(publisherCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([publisher, count]) => {
      console.log(`  ${publisher}: ${count}`);
    });
  
  // Count with thumbnails
  const withThumbnails = interviews.filter(i => i.media.images.length > 0).length;
  console.log(`\nWith thumbnails: ${withThumbnails}/${interviews.length} (${Math.round(withThumbnails/interviews.length*100)}%)`);
}

// Run the extraction
if (require.main === module) {
  extractInterviewsToJson();
}

module.exports = { extractInterviewsToJson };
