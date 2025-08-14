#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Improved article extraction with better parsing
 */
async function extractArticlesToJsonImproved() {
  const inputFile = path.join(__dirname, '../public/content/c_articles.md');
  const outputFile = path.join(__dirname, '../src/data/articles-improved.json');
  
  try {
    console.log('🔍 Reading articles file...');
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);
    
    console.log('📝 Extracting article entries with improved parsing...');
    const articles = [];
    
    // Split by clear date patterns and clean up
    const lines = content.split('\n').filter(line => line.trim());
    let currentArticle = null;
    let currentSection = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip separators and empty lines
      if (line === '***' || line === '*' || line === '****' || !line) {
        continue;
      }
      
      // Detect date patterns (start of new article)
      const dateMatch = line.match(/^(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/) ||
                       line.match(/^\d{4}$/) ||
                       line.match(/^(?:June|July)\s+\d{1,2}\s+&\s+\d{1,2},\s+\d{4}$/);
      
      if (dateMatch) {
        // Process previous article if exists
        if (currentSection.length > 0) {
          const article = parseImprovedArticleSection(currentSection.join('\n'), articles.length + 1);
          if (article) {
            articles.push(article);
          }
        }
        
        // Start new article
        currentSection = [line];
      } else {
        currentSection.push(line);
      }
    }
    
    // Process last article
    if (currentSection.length > 0) {
      const article = parseImprovedArticleSection(currentSection.join('\n'), articles.length + 1);
      if (article) {
        articles.push(article);
      }
    }
    
    console.log(`✅ Successfully extracted ${articles.length} articles with improved parsing`);
    
    // Create the final JSON structure
    const jsonData = {
      metadata: {
        id: "articles_collection_improved",
        type: "index",
        category: "classical-music",
        subcategory: "article-directory",
        status: "published",
        featured: true
      },
      content: {
        title: "Articles (Improved)",
        summary: "A collection of classical music articles and feature pieces with enhanced data extraction",
        body: "Articles and feature pieces published in various publications including Bay Area News Group, ANG Newspapers, and OPERA NOW."
      },
      publication: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      legacy: {
        originalFile: "c_articles.md",
        totalEntries: articles.length,
        extractionVersion: "improved"
      },
      articles: articles
    };
    
    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`💾 Saved improved articles data to: ${outputFile}`);
    
    // Generate comparison statistics
    generateComparisonStats(articles);
    
  } catch (error) {
    console.error('❌ Error extracting articles:', error);
    process.exit(1);
  }
}

/**
 * Parse individual article section with improved logic
 */
function parseImprovedArticleSection(section, index) {
  const lines = section.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  let title = '';
  let url = '';
  let date = '';
  let publication = '';
  let headline = '';
  let publisher = '';
  let section_name = '';
  
  // Extract date from first line
  const firstLine = lines[0];
  const dateMatch = firstLine.match(/^(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/) ||
                   firstLine.match(/^\d{4}$/) ||
                   firstLine.match(/^(?:June|July)\s+\d{1,2}\s+&\s+\d{1,2},\s+\d{4}$/);
  
  if (dateMatch) {
    date = dateMatch[0];
  }
  
  // Look for markdown links containing article info
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Extract article link and title
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch[2].includes('.htm')) {
      title = linkMatch[1];
      url = linkMatch[2];
      
      // Clean up title
      title = title
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .trim();
    }
    
    // Extract external URL links
    const externalLinkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    if (externalLinkMatch) {
      if (!title) title = externalLinkMatch[1];
      if (!url) url = externalLinkMatch[2];
    }
    
    // Extract publication and headline info
    if (line.includes('Classical Music Column')) {
      publication = line.replace(/\*/g, '').trim();
      
      // Extract publisher
      if (line.includes('Bay Area News')) {
        publisher = 'Bay Area News Group';
      } else if (line.includes('ANG Newspapers')) {
        publisher = 'ANG Newspapers';
      }
      
      // Extract section
      if (line.includes('Preview Section')) {
        section_name = 'Preview Section';
      }
    }
    
    // Extract headline after "under headline,"
    if (line.includes('under headline,')) {
      const headlineParts = line.split('under headline,');
      if (headlineParts.length > 1) {
        headline = headlineParts[1]
          .replace(/^\*+/, '')
          .replace(/\*+$/, '')
          .trim();
      }
    }
    
    // Handle special publications
    if (line.includes('OPERA NOW')) {
      publication = 'Feature Article in OPERA NOW';
      publisher = 'OPERA NOW';
    }
    
    if (line.includes('Article in ANG Newspapers')) {
      publication = 'Article in ANG Newspapers';
      publisher = 'ANG Newspapers';
    }
  }
  
  // Generate ID from title or use fallback
  const id = generateImprovedId(title, date, index);
  
  // Determine article type and subjects with better logic
  const { articleType, subjects } = analyzeImprovedArticleContent(title, headline, section.toLowerCase());
  
  // Clean up fields
  title = cleanArticleField(title);
  headline = cleanArticleField(headline);
  
  // Generate better summary
  const summary = generateImprovedSummary(title, headline, publication, date);
  
  return {
    metadata: {
      id: id,
      type: "article",
      category: "classical-music",
      subcategory: articleType,
      status: "published"
    },
    content: {
      title: title || `Article from ${date || 'Unknown Date'}`,
      headline: headline && headline !== title ? headline : null,
      summary: summary,
      url: url || null
    },
    publication: {
      date: parseImprovedDate(date),
      publisher: publisher || null,
      publication: publication || null,
      section: section_name || null
    },
    tags: subjects,
    legacy: {
      originalIndex: index,
      rawContent: section.substring(0, 300) + '...',
      extractionMethod: 'improved'
    }
  };
}

/**
 * Generate improved ID with better fallbacks
 */
function generateImprovedId(title, date, index) {
  if (title && title.length > 3) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }
  
  if (date) {
    const cleanDate = date.replace(/[^a-z0-9]/gi, '_');
    return `article_${cleanDate}_${index}`;
  }
  
  return `article_improved_${index}`;
}

/**
 * Improved article content analysis
 */
function analyzeImprovedArticleContent(title, headline, fullText) {
  const text = `${title} ${headline} ${fullText}`.toLowerCase();
  
  let articleType = 'feature-article';
  const subjects = new Set(['Article', 'Classical Music']);
  
  // Better type detection
  if (text.includes('opera') && (text.includes('production') || text.includes('premiere'))) {
    articleType = 'opera-article';
    subjects.add('Opera');
  } else if (text.includes('symphony') || text.includes('orchestra')) {
    articleType = 'symphony-article';
    subjects.add('Symphony');
  } else if (text.includes('premiere') || text.includes('world premiere')) {
    articleType = 'premiere-article';
    subjects.add('World Premiere');
  } else if (text.includes('review') || text.includes('concert')) {
    articleType = 'review-article';
    subjects.add('Review');
  }
  
  // Enhanced subject detection
  const subjectMappings = {
    'beethoven': 'Ludwig van Beethoven',
    'wagner': 'Richard Wagner',
    'berg': 'Alban Berg',
    'wozzeck': 'Alban Berg',
    'heggie': 'Jake Heggie',
    'gergiev': 'Valery Gergiev',
    'san francisco opera': 'San Francisco Opera',
    'berkeley opera': 'Berkeley Opera',
    'merola': 'Merola Opera Program',
    'casablanca': 'Opera',
    'fremont opera': 'Opera',
    'national symphony': 'National Symphony Orchestra',
    'brain': 'Music Education',
    'high-tech': 'Technology',
    'coco': 'Technology'
  };
  
  Object.entries(subjectMappings).forEach(([keyword, subject]) => {
    if (text.includes(keyword)) {
      subjects.add(subject);
    }
  });
  
  return {
    articleType,
    subjects: Array.from(subjects).slice(0, 8)
  };
}

/**
 * Clean article field content
 */
function cleanArticleField(field) {
  if (!field) return '';
  
  return field
    .replace(/^\*+/, '')
    .replace(/\*+$/, '')
    .replace(/^,\s*/, '')
    .replace(/\s*,$/, '')
    .trim();
}

/**
 * Generate improved summary
 */
function generateImprovedSummary(title, headline, publication, date) {
  const parts = [];
  
  if (title) parts.push(title);
  if (headline && headline !== title) parts.push(headline);
  if (date) parts.push(`Published ${date}`);
  if (publication) parts.push(`in ${publication.replace(/Classical Music Column for /gi, '').trim()}`);
  
  return parts.join('. ') || 'Classical music article';
}

/**
 * Improved date parsing
 */
function parseImprovedDate(dateStr) {
  if (!dateStr) return null;
  
  try {
    // Handle year only
    if (dateStr.match(/^\d{4}$/)) {
      return `${dateStr}-01-01`;
    }
    
    // Handle date ranges like "June 14 & 15, 1999"
    if (dateStr.includes('&')) {
      const yearMatch = dateStr.match(/\d{4}/);
      if (yearMatch) {
        return `${yearMatch[0]}-01-01`;
      }
    }
    
    // Standard date parsing
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
 * Generate comparison statistics
 */
function generateComparisonStats(articles) {
  console.log('\n📊 Improved Extraction Statistics:');
  console.log(`Total articles: ${articles.length}`);
  
  const withTitles = articles.filter(a => a.content.title && a.content.title !== 'Article from Unknown Date' && !a.content.title.startsWith('Article from')).length;
  const withUrls = articles.filter(a => a.content.url).length;
  const withDates = articles.filter(a => a.publication.date).length;
  const withPublishers = articles.filter(a => a.publication.publisher).length;
  const withMeaningfulTags = articles.filter(a => a.tags.length > 2).length;
  
  console.log(`With meaningful titles: ${withTitles}/${articles.length} (${Math.round(withTitles/articles.length*100)}%)`);
  console.log(`With URLs: ${withUrls}/${articles.length} (${Math.round(withUrls/articles.length*100)}%)`);
  console.log(`With dates: ${withDates}/${articles.length} (${Math.round(withDates/articles.length*100)}%)`);
  console.log(`With publishers: ${withPublishers}/${articles.length} (${Math.round(withPublishers/articles.length*100)}%)`);
  console.log(`With meaningful tags: ${withMeaningfulTags}/${articles.length} (${Math.round(withMeaningfulTags/articles.length*100)}%)`);
  
  // Show first few articles for verification
  console.log('\nFirst 3 articles:');
  articles.slice(0, 3).forEach((article, i) => {
    console.log(`${i+1}. "${article.content.title}"`);
    console.log(`   URL: ${article.content.url || 'None'}`);
    console.log(`   Date: ${article.publication.date || 'None'}`);
    console.log(`   Publisher: ${article.publication.publisher || 'None'}`);
    console.log(`   Type: ${article.metadata.subcategory}`);
    console.log(`   Tags: ${article.tags.length}`);
    console.log('');
  });
}

// Run the improved extraction
if (require.main === module) {
  extractArticlesToJsonImproved();
}

module.exports = { extractArticlesToJsonImproved };
