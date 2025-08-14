#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * SPECIALIZED CLASSICAL MUSIC INTERVIEWS EXTRACTOR
 * Focused extraction for c_* interview files
 */
async function extractInterviewsSpecialized() {
  console.log('🎤 SPECIALIZED INTERVIEWS EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    const contentDir = path.join(__dirname, '../public/content');
    const interviewFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('c_') && 
              !file.includes('review') && 
              !file.includes('art_') &&
              !file.includes('main') &&
              !file.includes('interviews') &&
              file.endsWith('.md'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${interviewFiles.length} interview files`);
    
    const interviews = {
      metadata: {
        id: "classical_interviews_specialized",
        type: "interview_collection",
        category: "classical_music",
        subcategory: "interviews",
        extractionVersion: "specialized_v1",
        extractionDate: new Date().toISOString()
      },
      interviews: [],
      analytics: {
        subjects: {},
        venues: {},
        instruments: {},
        timeRange: {},
        total: 0
      }
    };
    
    for (const filePath of interviewFiles) {
      const fileName = path.basename(filePath);
      console.log(`🎭 Processing interview: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const interview = extractInterviewData(fileName, frontMatter, content);
        if (interview) {
          interviews.interviews.push(interview);
        }
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate analytics
    generateInterviewAnalytics(interviews);
    
    console.log('\n📊 Interview Extraction Results:');
    console.log(`Total interviews: ${interviews.interviews.length}`);
    console.log(`Musicians covered: ${Object.keys(interviews.analytics.subjects).length}`);
    console.log(`Venues mentioned: ${Object.keys(interviews.analytics.venues).length}`);
    console.log(`Instruments featured: ${Object.keys(interviews.analytics.instruments).length}`);
    
    // Save specialized data
    const outputPath = path.join(__dirname, '../src/data/interviews-specialized.json');
    fs.writeFileSync(outputPath, JSON.stringify(interviews, null, 2));
    console.log(`\n💾 Saved specialized interviews to: ${outputPath}`);
    
    return interviews;
    
  } catch (error) {
    console.error('❌ Error in specialized interviews extraction:', error);
    process.exit(1);
  }
}

function extractInterviewData(fileName, frontMatter, content) {
  const artistName = extractArtistName(fileName, frontMatter, content);
  const interviewType = classifyInterviewType(frontMatter, content);
  
  const interview = {
    id: frontMatter.id || fileName.replace('.md', ''),
    metadata: {
      type: 'interview',
      category: 'classical_music',
      status: 'published',
      source_file: fileName
    },
    content: {
      title: frontMatter.title || `Interview with ${artistName}`,
      artist: artistName,
      summary: extractInterviewSummary(content),
      excerpt: extractInterviewExcerpt(content),
      full_content: content,
      word_count: content.split(/\s+/).length
    },
    subject: {
      people: [{
        name: artistName,
        role: extractArtistRole(frontMatter, content),
        instruments: extractInstruments(frontMatter, content),
        specializations: extractSpecializations(frontMatter, content)
      }]
    },
    publication: {
      date: frontMatter.publication?.date || null,
      publisher: frontMatter.publication?.publisher || 'ANG Newspapers Classical Music',
      author: frontMatter.publication?.author || 'Cheryl North'
    },
    media: {
      images: frontMatter.images || [],
      thumbnail: extractThumbnail(frontMatter.images)
    },
    musical_context: {
      venues: extractVenues(frontMatter, content),
      performances: extractPerformances(content),
      repertoire: extractRepertoire(content),
      collaborators: extractCollaborators(content)
    },
    tags: [
      ...(frontMatter.subjects || []),
      ...generateMusicalTags(content, artistName)
    ],
    interview_specifics: {
      type: interviewType,
      setting: extractInterviewSetting(content),
      key_topics: extractKeyTopics(content),
      notable_quotes: extractNotableQuotes(content)
    }
  };
  
  return interview;
}

function extractArtistName(fileName, frontMatter, content) {
  // Extract from filename (c_masur.md -> Masur)
  const fileBaseName = fileName.replace(/^c_/, '').replace(/\.md$/, '');
  
  // Check for full name in content
  const namePatterns = [
    /(?:Maestro|Mr\.|Ms\.|Dr\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s+(?:conductor|pianist|violinist|cellist|soprano|tenor|baritone|bass)/i,
    /Interview with\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // Fallback to capitalized filename
  return fileBaseName.charAt(0).toUpperCase() + fileBaseName.slice(1);
}

function extractArtistRole(frontMatter, content) {
  const roleKeywords = {
    'conductor': ['conductor', 'conducting', 'maestro', 'music director'],
    'pianist': ['pianist', 'piano'],
    'violinist': ['violinist', 'violin'],
    'cellist': ['cellist', 'cello'],
    'soprano': ['soprano'],
    'tenor': ['tenor'],
    'baritone': ['baritone'],
    'bass': ['bass'],
    'composer': ['composer', 'composition'],
    'opera_singer': ['opera singer', 'opera'],
    'instrumentalist': ['instrumentalist', 'musician']
  };
  
  const contentLower = content.toLowerCase();
  
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      return role;
    }
  }
  
  return 'musician';
}

function extractInstruments(frontMatter, content) {
  const instruments = [];
  const instrumentKeywords = [
    'piano', 'violin', 'viola', 'cello', 'double bass', 'flute', 'oboe', 
    'clarinet', 'bassoon', 'horn', 'trumpet', 'trombone', 'tuba', 'harp',
    'percussion', 'drums', 'timpani', 'organ'
  ];
  
  const contentLower = content.toLowerCase();
  instrumentKeywords.forEach(instrument => {
    if (contentLower.includes(instrument)) {
      instruments.push(instrument);
    }
  });
  
  return [...new Set(instruments)];
}

function extractSpecializations(frontMatter, content) {
  const specializations = [];
  const specKeywords = [
    'chamber music', 'symphony', 'opera', 'recital', 'concerto',
    'contemporary music', 'baroque', 'classical', 'romantic', 'modern'
  ];
  
  const contentLower = content.toLowerCase();
  specKeywords.forEach(spec => {
    if (contentLower.includes(spec)) {
      specializations.push(spec);
    }
  });
  
  return [...new Set(specializations)];
}

function extractVenues(frontMatter, content) {
  const venues = [];
  const venuePatterns = [
    /(?:at|in)\s+(Davies Symphony Hall|Carnegie Hall|Lincoln Center|Kennedy Center|Herbst Theatre|Zellerbach Hall)/gi,
    /(San Francisco Symphony|New York Philharmonic|Boston Symphony|Metropolitan Opera)/gi,
    /([A-Z][a-z]+\s+(?:Hall|Theatre|Theater|Center|Opera|Symphony))/g
  ];
  
  venuePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      venues.push(...matches.map(m => m.replace(/^(?:at|in)\s+/i, '')));
    }
  });
  
  return [...new Set(venues)];
}

function extractPerformances(content) {
  const performances = [];
  const perfPatterns = [
    /performance of\s+([^.]+)/gi,
    /performing\s+([^.]+)/gi,
    /concert featuring\s+([^.]+)/gi
  ];
  
  perfPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      performances.push(...matches.map(m => m.replace(pattern.source.replace(/gi?$/, ''), '$1').trim()));
    }
  });
  
  return performances.slice(0, 5); // Limit to 5 most relevant
}

function extractRepertoire(content) {
  const repertoire = [];
  const repPatterns = [
    /([A-Z][a-z]+(?:'s)?\s+(?:Symphony|Concerto|Sonata|Opera|Quartet|Quintet)(?:\s+(?:No\.|in|#)\s*[A-Za-z0-9-]+)?)/g,
    /"([^"]+)"/g // Quoted work titles
  ];
  
  repPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      repertoire.push(...matches.map(m => m.replace(/^"|"$/g, '')));
    }
  });
  
  return [...new Set(repertoire)].slice(0, 10);
}

function extractCollaborators(content) {
  const collaborators = [];
  const collabPatterns = [
    /(?:with|alongside|featuring)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    /conductor\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g
  ];
  
  collabPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      collaborators.push(...matches.map(m => m.replace(/^(?:with|alongside|featuring|conductor)\s+/i, '')));
    }
  });
  
  return [...new Set(collaborators)].slice(0, 5);
}

function classifyInterviewType(frontMatter, content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('backstage') || contentLower.includes('dressing room')) return 'backstage';
  if (contentLower.includes('phone') || contentLower.includes('telephone')) return 'phone';
  if (contentLower.includes('email') || contentLower.includes('correspondence')) return 'email';
  if (contentLower.includes('press conference')) return 'press_conference';
  if (contentLower.includes('master class') || contentLower.includes('masterclass')) return 'masterclass';
  
  return 'in_person';
}

function extractInterviewSetting(content) {
  const settingPatterns = [
    /(?:at|in)\s+(his|her)\s+(home|studio|dressing room)/i,
    /(?:at|in)\s+(the|a)\s+(restaurant|cafe|hotel|theatre|theater)/i,
    /during\s+(rehearsal|intermission|break)/i
  ];
  
  for (const pattern of settingPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return 'unspecified';
}

function extractKeyTopics(content) {
  const topics = [];
  const topicKeywords = [
    'career', 'technique', 'interpretation', 'inspiration', 'repertoire',
    'performance', 'teaching', 'collaboration', 'experience', 'future plans',
    'recording', 'touring', 'family', 'education', 'influences'
  ];
  
  const contentLower = content.toLowerCase();
  topicKeywords.forEach(topic => {
    if (contentLower.includes(topic)) {
      topics.push(topic);
    }
  });
  
  return topics.slice(0, 8);
}

function extractNotableQuotes(content) {
  const quotes = [];
  const quotePattern = /"([^"]{50,200})"/g;
  let match;
  
  while ((match = quotePattern.exec(content)) !== null) {
    quotes.push(match[1]);
    if (quotes.length >= 3) break; // Limit to 3 notable quotes
  }
  
  return quotes;
}

function extractInterviewSummary(content) {
  // Extract first paragraph as summary
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  return paragraphs[0]?.substring(0, 300) + '...' || '';
}

function extractInterviewExcerpt(content) {
  // Extract a compelling excerpt from the middle of the interview
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const midIndex = Math.floor(paragraphs.length / 2);
  return paragraphs[midIndex]?.substring(0, 250) + '...' || '';
}

function extractThumbnail(images) {
  if (!images || !Array.isArray(images)) return null;
  
  // Look for thumbnail images
  const thumbnail = images.find(img => 
    img.src?.includes('thm-') || 
    img.width <= 100 || 
    img.height <= 100
  );
  
  return thumbnail ? thumbnail.src : (images[0]?.src || null);
}

function generateMusicalTags(content, artistName) {
  const tags = [];
  const contentLower = content.toLowerCase();
  
  // Musical periods
  const periods = ['baroque', 'classical', 'romantic', 'modern', 'contemporary'];
  periods.forEach(period => {
    if (contentLower.includes(period)) tags.push(period);
  });
  
  // Performance contexts
  const contexts = ['symphony', 'opera', 'chamber music', 'recital', 'concerto'];
  contexts.forEach(context => {
    if (contentLower.includes(context)) tags.push(context);
  });
  
  return tags;
}

function generateInterviewAnalytics(interviews) {
  const analytics = interviews.analytics;
  
  // Subject analysis
  interviews.interviews.forEach(interview => {
    const artist = interview.content.artist;
    analytics.subjects[artist] = (analytics.subjects[artist] || 0) + 1;
    
    // Venue analysis
    interview.musical_context.venues.forEach(venue => {
      analytics.venues[venue] = (analytics.venues[venue] || 0) + 1;
    });
    
    // Instrument analysis
    interview.subject.people[0]?.instruments?.forEach(instrument => {
      analytics.instruments[instrument] = (analytics.instruments[instrument] || 0) + 1;
    });
  });
  
  analytics.total = interviews.interviews.length;
  
  // Time range analysis
  const dates = interviews.interviews
    .map(i => i.publication.date)
    .filter(Boolean)
    .map(d => new Date(d).getFullYear())
    .filter(y => !isNaN(y));
  
  if (dates.length > 0) {
    analytics.timeRange = {
      earliest: Math.min(...dates),
      latest: Math.max(...dates),
      span: Math.max(...dates) - Math.min(...dates)
    };
  }
}

// Run the specialized extraction
if (require.main === module) {
  extractInterviewsSpecialized();
}

module.exports = { extractInterviewsSpecialized };
