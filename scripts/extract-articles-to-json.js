#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Extract article data from c_articles.md and convert to structured JSON
 */
async function extractArticlesToJson() {
  const inputFile = path.join(__dirname, '../public/content/c_articles.md');
  const outputFile = path.join(__dirname, '../src/data/articles.json');
  
  try {
    console.log('🔍 Reading articles file...');
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);
    
    console.log('📝 Extracting article entries...');
    const articles = [];
    
    // Split content by date patterns and article separators
    const sections = content.split(/(?=\w+ \d{1,2}, \d{4}|\d{4})/g).filter(section => section.trim());
    
    console.log(`Found ${sections.length} potential article sections`);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section || section.length < 20) continue; // Skip very short sections
      
      try {
        const article = parseArticleSection(section, i + 1);
        if (article) {
          articles.push(article);
        }
      } catch (error) {
        console.warn(`⚠️  Error parsing section ${i + 1}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully extracted ${articles.length} articles`);
    
    // Create the final JSON structure
    const jsonData = {
      metadata: {
        id: "articles_collection",
        type: "index",
        category: "classical-music",
        subcategory: "article-directory",
        status: "published",
        featured: true
      },
      content: {
        title: "Articles",
        summary: "A collection of classical music articles and feature pieces",
        body: "Articles and feature pieces published in various publications including Bay Area News Group, ANG Newspapers, and OPERA NOW."
      },
      publication: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      legacy: {
        originalFile: "c_articles.md",
        totalEntries: articles.length
      },
      articles: articles
    };
    
    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`💾 Saved articles data to: ${outputFile}`);
    
    // Generate summary statistics
    generateArticleStats(articles);
    
  } catch (error) {
    console.error('❌ Error extracting articles:', error);
    process.exit(1);
  }
}

/**
 * Parse individual article section
 */
function parseArticleSection(section, index) {
  const lines = section.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  let title = '';
  let url = '';
  let date = '';
  let publication = '';
  let headline = '';
  let description = '';
  let publisher = '';
  
  // Extract data from the section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract date from first line if it matches date pattern
    if (i === 0) {
      const dateMatch = line.match(/^(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}|\d{4}$/);
      if (dateMatch) {
        date = dateMatch[0];
        continue;
      }
    }
    
    // Extract title and URL from markdown links
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch[2].includes('.htm')) {
      title = linkMatch[1];
      url = linkMatch[2];
    }
    
    // Extract headline from text after "under headline,"
    if (line.includes('under headline,')) {
      const headlineMatch = line.split('under headline,')[1];
      if (headlineMatch) {
        headline = headlineMatch.trim().replace(/^\*/, '').replace(/\*$/, '').trim();
      }
    }
    
    // Extract publication info
    if (line.includes('Classical Music Column')) {
      publication = line.replace(/\*/g, '').trim();
      
      // Extract publisher
      if (line.includes('Bay Area News')) {
        publisher = 'Bay Area News Group';
      } else if (line.includes('ANG Newspapers')) {
        publisher = 'ANG Newspapers';
      }
    }
    
    // Handle special publications
    if (line.includes('OPERA NOW')) {
      publication = 'Feature Article in OPERA NOW';
      publisher = 'OPERA NOW';
    }
    
    if (line.includes('ANG Newspapers') && !publisher) {
      publisher = 'ANG Newspapers';
    }
  }
  
  // Generate ID from title or date
  const id = generateId(title, date, index);
  
  // Determine article type and subjects
  const { articleType, subjects } = analyzeArticleContent(title, headline, description);
  
  // Clean up title - remove extra markup
  title = cleanTitle(title);
  headline = cleanTitle(headline);
  
  return {
    metadata: {
      id: id,
      type: "article",
      category: "classical-music",
      subcategory: articleType,
      status: "published"
    },
    content: {
      title: title,
      headline: headline || title,
      summary: description || extractSummary(title, headline),
      url: url
    },
    publication: {
      date: parseDate(date),
      publisher: publisher,
      publication: publication,
      section: extractSection(publication)
    },
    tags: subjects,
    legacy: {
      originalIndex: index,
      rawContent: section.substring(0, 200) + '...'
    }
  };
}

/**
 * Generate unique ID from title or date
 */
function generateId(title, date, index) {
  if (title && title.length > 3) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }
  
  if (date) {
    return `article_${date.replace(/\s+/g, '_').replace(/,/g, '')}_${index}`;
  }
  
  return `article_${index}`;
}

/**
 * Analyze article content to determine type and subjects
 */
function analyzeArticleContent(title, headline, description) {
  const text = `${title} ${headline} ${description}`.toLowerCase();
  
  let articleType = 'feature-article';
  const subjects = new Set(['Article', 'Classical Music']);
  
  // Determine article type
  if (text.includes('opera')) {
    articleType = 'opera-article';
    subjects.add('Opera');
  } else if (text.includes('symphony')) {
    articleType = 'symphony-article';
    subjects.add('Symphony');
  } else if (text.includes('premiere') || text.includes('world premiere')) {
    articleType = 'premiere-article';
    subjects.add('World Premiere');
  } else if (text.includes('review')) {
    articleType = 'review-article';
    subjects.add('Review');
  }
  
  // Add specific subjects based on content
  if (text.includes('beethoven')) subjects.add('Ludwig van Beethoven');
  if (text.includes('wagner')) subjects.add('Richard Wagner');
  if (text.includes('berg') || text.includes('wozzeck')) subjects.add('Alban Berg');
  if (text.includes('heggie')) subjects.add('Jake Heggie');
  if (text.includes('gergiev')) subjects.add('Valery Gergiev');
  if (text.includes('san francisco opera')) subjects.add('San Francisco Opera');
  if (text.includes('berkeley opera')) subjects.add('Berkeley Opera');
  if (text.includes('merola')) subjects.add('Merola Opera Program');
  
  return {
    articleType,
    subjects: Array.from(subjects).slice(0, 8)
  };
}

/**
 * Clean title by removing markdown and extra formatting
 */
function cleanTitle(title) {
  if (!title) return '';
  
  return title
    .replace(/\*/g, '')
    .replace(/^\s*\*+\s*/, '')
    .replace(/\s*\*+\s*$/, '')
    .trim();
}

/**
 * Extract summary from title and headline
 */
function extractSummary(title, headline) {
  if (headline && headline !== title) {
    return `${title}. ${headline}`;
  }
  return title;
}

/**
 * Extract section from publication string
 */
function extractSection(publication) {
  if (!publication) return null;
  
  if (publication.includes('Preview Section')) return 'Preview Section';
  if (publication.includes('Arts')) return 'Arts';
  
  return null;
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
 * Generate summary statistics
 */
function generateArticleStats(articles) {
  console.log('\n📊 Article Statistics:');
  console.log(`Total articles: ${articles.length}`);
  
  // Count by type
  const typeCount = {};
  articles.forEach(article => {
    const type = article.metadata.subcategory || 'unknown';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  console.log('\nBy type:');
  Object.entries(typeCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  
  // Count by publisher
  const publisherCount = {};
  articles.forEach(article => {
    const publisher = article.publication.publisher || 'unknown';
    publisherCount[publisher] = (publisherCount[publisher] || 0) + 1;
  });
  
  console.log('\nBy publisher:');
  Object.entries(publisherCount)
    .sort(([,a], [,b]) => b - a)
    .forEach(([publisher, count]) => {
      console.log(`  ${publisher}: ${count}`);
    });
  
  // Count by year
  const yearCount = {};
  articles.forEach(article => {
    const date = article.publication.date;
    if (date) {
      const year = date.substring(0, 4);
      yearCount[year] = (yearCount[year] || 0) + 1;
    }
  });
  
  console.log('\nBy year:');
  Object.entries(yearCount)
    .sort(([a], [b]) => b.localeCompare(a))
    .forEach(([year, count]) => {
      console.log(`  ${year}: ${count}`);
    });
}

// Run the extraction
if (require.main === module) {
  extractArticlesToJson();
}

module.exports = { extractArticlesToJson };
