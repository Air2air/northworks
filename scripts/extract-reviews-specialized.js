#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * SPECIALIZED CLASSICAL MUSIC REVIEWS EXTRACTOR
 * Focused extraction for c_reviews_* files
 */
async function extractReviewsSpecialized() {
  console.log('🎭 SPECIALIZED REVIEWS EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    const contentDir = path.join(__dirname, '../public/content');
    const reviewFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('c_reviews') && file.endsWith('.md'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${reviewFiles.length} review files`);
    
    const reviews = {
      metadata: {
        id: "classical_reviews_specialized",
        type: "review_collection",
        category: "classical_music",
        subcategory: "performance_reviews",
        extractionVersion: "specialized_v1",
        extractionDate: new Date().toISOString()
      },
      reviews: [],
      analytics: {
        venues: {},
        performers: {},
        works: {},
        ratings: {},
        timeRange: {},
        total: 0
      }
    };
    
    for (const filePath of reviewFiles) {
      const fileName = path.basename(filePath);
      console.log(`🎼 Processing review: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const review = extractReviewData(fileName, frontMatter, content);
        if (review) {
          reviews.reviews.push(review);
        }
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate analytics
    generateReviewAnalytics(reviews);
    
    console.log('\n📊 Review Extraction Results:');
    console.log(`Total reviews: ${reviews.reviews.length}`);
    console.log(`Venues covered: ${Object.keys(reviews.analytics.venues).length}`);
    console.log(`Performers featured: ${Object.keys(reviews.analytics.performers).length}`);
    console.log(`Works reviewed: ${Object.keys(reviews.analytics.works).length}`);
    
    // Save specialized data
    const outputPath = path.join(__dirname, '../src/data/reviews-specialized.json');
    fs.writeFileSync(outputPath, JSON.stringify(reviews, null, 2));
    console.log(`\n💾 Saved specialized reviews to: ${outputPath}`);
    
    return reviews;
    
  } catch (error) {
    console.error('❌ Error in specialized reviews extraction:', error);
    process.exit(1);
  }
}

function extractReviewData(fileName, frontMatter, content) {
  const performanceInfo = extractPerformanceInfo(fileName, frontMatter, content);
  const criticalAssessment = extractCriticalAssessment(content);
  
  const review = {
    id: frontMatter.id || fileName.replace('.md', ''),
    metadata: {
      type: 'performance_review',
      category: 'classical_music',
      status: 'published',
      source_file: fileName
    },
    content: {
      title: frontMatter.title || performanceInfo.title,
      headline: extractHeadline(frontMatter, content),
      summary: extractReviewSummary(content),
      excerpt: extractReviewExcerpt(content),
      full_content: content,
      word_count: content.split(/\s+/).length
    },
    performance: {
      title: performanceInfo.title,
      date: performanceInfo.date,
      venue: performanceInfo.venue,
      organization: performanceInfo.organization,
      conductor: performanceInfo.conductor,
      soloists: performanceInfo.soloists,
      ensemble: performanceInfo.ensemble
    },
    musical_works: {
      primary_works: extractPrimaryWorks(content),
      composers: extractComposers(content),
      musical_periods: extractMusicalPeriods(content),
      genres: extractGenres(content)
    },
    review_analysis: {
      overall_assessment: criticalAssessment.overall,
      performance_quality: criticalAssessment.performance,
      interpretation_notes: criticalAssessment.interpretation,
      technical_comments: criticalAssessment.technical,
      audience_response: criticalAssessment.audience,
      rating_indicators: extractRatingIndicators(content)
    },
    publication: {
      date: frontMatter.publication?.date || extractPublicationDate(fileName, content),
      author: frontMatter.publication?.author || 'Cheryl North',
      publisher: frontMatter.publication?.publisher || 'ANG Newspapers Classical Music',
      section: 'Classical Music Reviews'
    },
    media: {
      images: frontMatter.images || [],
      thumbnail: extractThumbnail(frontMatter.images)
    },
    context: {
      venue_context: extractVenueContext(content),
      seasonal_context: extractSeasonalContext(content),
      programming_notes: extractProgrammingNotes(content),
      historical_significance: extractHistoricalSignificance(content)
    },
    tags: [
      ...(frontMatter.tags || []),
      ...generateReviewTags(content, performanceInfo)
    ]
  };
  
  return review;
}

function extractPerformanceInfo(fileName, frontMatter, content) {
  const info = {
    title: frontMatter.title || extractTitleFromFilename(fileName),
    date: null,
    venue: null,
    organization: null,
    conductor: null,
    soloists: [],
    ensemble: null
  };
  
  // Extract venue
  const venuePatterns = [
    /(?:at|in)\s+(Davies Symphony Hall|Carnegie Hall|Lincoln Center|Kennedy Center|Herbst Theatre|Zellerbach Hall|War Memorial Opera House)/i,
    /([A-Z][a-z]+\s+(?:Hall|Theatre|Theater|Center|Opera House))/
  ];
  
  for (const pattern of venuePatterns) {
    const match = content.match(pattern);
    if (match) {
      info.venue = match[1] || match[0].replace(/^(?:at|in)\s+/i, '');
      break;
    }
  }
  
  // Extract organization/ensemble
  const orgPatterns = [
    /(San Francisco Symphony|San Francisco Opera|Cal Symphony|Berkeley Symphony|Marin Symphony)/i,
    /([A-Z][a-z]+\s+(?:Symphony|Opera|Orchestra|Ensemble|Quartet))/
  ];
  
  for (const pattern of orgPatterns) {
    const match = content.match(pattern);
    if (match) {
      info.organization = match[1] || match[0];
      info.ensemble = match[1] || match[0];
      break;
    }
  }
  
  // Extract conductor
  const conductorPatterns = [
    /(?:conducted by|conductor)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /(?:Maestro|Mr\.|Ms\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  ];
  
  for (const pattern of conductorPatterns) {
    const match = content.match(pattern);
    if (match) {
      info.conductor = match[1];
      break;
    }
  }
  
  // Extract soloists
  const soloistPatterns = [
    /(?:soloist|featuring|with)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    /([A-Z][a-z]+\s+[A-Z][a-z]+),?\s+(?:piano|violin|cello|soprano|tenor|baritone|bass)/gi
  ];
  
  soloistPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const name = match.replace(/^(?:soloist|featuring|with)\s+/i, '').replace(/,?\s+(?:piano|violin|cello|soprano|tenor|baritone|bass)$/i, '');
        if (name && !info.soloists.includes(name)) {
          info.soloists.push(name);
        }
      });
    }
  });
  
  // Extract date from filename or content
  const dateFromFilename = fileName.match(/(\d{1,2}[-_]\d{1,2}[-_]\d{2,4})/);
  if (dateFromFilename) {
    info.date = dateFromFilename[1].replace(/[-_]/g, '/');
  }
  
  return info;
}

function extractTitleFromFilename(fileName) {
  // Convert filename to readable title
  return fileName
    .replace(/^c_reviews?_/, '')
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function extractPrimaryWorks(content) {
  const works = [];
  const workPatterns = [
    /([A-Z][a-z]+(?:'s)?\s+(?:Symphony|Concerto|Sonata|Opera|Quartet|Quintet|Overture)(?:\s+(?:No\.|in|#)\s*[A-Za-z0-9-]+)?)/g,
    /"([^"]+)"(?:\s+by\s+[A-Z][a-z]+)?/g
  ];
  
  workPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      works.push(...matches.map(m => m.replace(/^"|"$/g, '')));
    }
  });
  
  return [...new Set(works)].slice(0, 8);
}

function extractComposers(content) {
  const composers = [];
  const composerPatterns = [
    /(?:by|composer)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /(Bach|Mozart|Beethoven|Brahms|Tchaikovsky|Mahler|Stravinsky|Debussy|Ravel|Chopin|Liszt)/gi
  ];
  
  composerPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      composers.push(...matches.map(m => m.replace(/^(?:by|composer)\s+/i, '')));
    }
  });
  
  return [...new Set(composers)];
}

function extractMusicalPeriods(content) {
  const periods = [];
  const periodKeywords = [
    'baroque', 'classical', 'romantic', 'modern', 'contemporary',
    'renaissance', 'impressionist', 'atonal', 'serial'
  ];
  
  const contentLower = content.toLowerCase();
  periodKeywords.forEach(period => {
    if (contentLower.includes(period)) {
      periods.push(period);
    }
  });
  
  return [...new Set(periods)];
}

function extractGenres(content) {
  const genres = [];
  const genreKeywords = [
    'symphony', 'concerto', 'sonata', 'quartet', 'opera', 'oratorio',
    'chamber music', 'orchestral', 'vocal', 'instrumental', 'choral'
  ];
  
  const contentLower = content.toLowerCase();
  genreKeywords.forEach(genre => {
    if (contentLower.includes(genre)) {
      genres.push(genre);
    }
  });
  
  return [...new Set(genres)];
}

function extractCriticalAssessment(content) {
  const assessment = {
    overall: null,
    performance: null,
    interpretation: null,
    technical: null,
    audience: null
  };
  
  // Look for evaluative language
  const positiveWords = ['excellent', 'outstanding', 'brilliant', 'masterful', 'superb', 'magnificent'];
  const negativeWords = ['disappointing', 'lackluster', 'weak', 'poor', 'uninspired'];
  
  const contentLower = content.toLowerCase();
  
  // Overall assessment
  const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
  
  if (positiveCount > negativeCount) {
    assessment.overall = 'positive';
  } else if (negativeCount > positiveCount) {
    assessment.overall = 'negative';
  } else {
    assessment.overall = 'mixed';
  }
  
  // Performance quality indicators
  if (contentLower.includes('flawless') || contentLower.includes('perfect')) {
    assessment.performance = 'exceptional';
  } else if (contentLower.includes('excellent') || contentLower.includes('outstanding')) {
    assessment.performance = 'high';
  } else if (contentLower.includes('good') || contentLower.includes('solid')) {
    assessment.performance = 'satisfactory';
  }
  
  // Interpretation notes
  const interpretationKeywords = ['interpretation', 'reading', 'approach', 'vision'];
  interpretationKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      assessment.interpretation = 'noted';
    }
  });
  
  // Technical comments
  const technicalKeywords = ['technique', 'technical', 'execution', 'precision'];
  technicalKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      assessment.technical = 'addressed';
    }
  });
  
  // Audience response
  const audienceKeywords = ['applause', 'ovation', 'standing ovation', 'audience'];
  audienceKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      assessment.audience = 'positive';
    }
  });
  
  return assessment;
}

function extractRatingIndicators(content) {
  const indicators = [];
  const contentLower = content.toLowerCase();
  
  // Star ratings or explicit ratings
  const ratingPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:stars?|out of \d+)/i,
    /(highly recommended|recommended|not recommended)/i
  ];
  
  ratingPatterns.forEach(pattern => {
    const match = content.match(pattern);
    if (match) {
      indicators.push(match[1]);
    }
  });
  
  // Implicit rating indicators
  if (contentLower.includes('must see') || contentLower.includes('don\'t miss')) {
    indicators.push('must_see');
  }
  if (contentLower.includes('disappointing') || contentLower.includes('skip')) {
    indicators.push('disappointing');
  }
  
  return indicators;
}

function extractHeadline(frontMatter, content) {
  if (frontMatter.headline) return frontMatter.headline;
  
  // Extract first sentence as headline
  const sentences = content.split(/[.!?]/);
  return sentences[0]?.trim() + '.' || '';
}

function extractReviewSummary(content) {
  // Extract first paragraph
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  return paragraphs[0]?.substring(0, 300) + '...' || '';
}

function extractReviewExcerpt(content) {
  // Extract key critical assessment paragraph
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  
  // Look for paragraph with evaluative language
  const criticalPara = paragraphs.find(p => 
    /excellent|outstanding|brilliant|disappointing|masterful/i.test(p)
  );
  
  return (criticalPara || paragraphs[1])?.substring(0, 250) + '...' || '';
}

function extractPublicationDate(fileName, content) {
  // Extract date from filename
  const dateMatch = fileName.match(/(\d{1,2}[-_]\d{1,2}[-_]\d{2,4})/);
  if (dateMatch) {
    return dateMatch[1].replace(/[-_]/g, '/');
  }
  
  // Look for date in content
  const datePattern = /(?:on|date)\s+(\w+\s+\d{1,2},?\s+\d{4})/i;
  const match = content.match(datePattern);
  if (match) {
    return match[1];
  }
  
  return null;
}

function extractVenueContext(content) {
  const contextKeywords = ['acoustics', 'atmosphere', 'setting', 'hall', 'intimate', 'grand'];
  const contentLower = content.toLowerCase();
  
  return contextKeywords.filter(keyword => contentLower.includes(keyword));
}

function extractSeasonalContext(content) {
  const seasons = ['opening night', 'season opener', 'season finale', 'gala', 'special event'];
  const contentLower = content.toLowerCase();
  
  return seasons.filter(season => contentLower.includes(season));
}

function extractProgrammingNotes(content) {
  const notes = [];
  const programmingKeywords = ['program', 'repertoire', 'selection', 'choice'];
  
  const contentLower = content.toLowerCase();
  programmingKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      notes.push(keyword);
    }
  });
  
  return notes;
}

function extractHistoricalSignificance(content) {
  const significance = [];
  const historyKeywords = ['debut', 'premiere', 'first time', 'anniversary', 'milestone'];
  
  const contentLower = content.toLowerCase();
  historyKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      significance.push(keyword);
    }
  });
  
  return significance;
}

function extractThumbnail(images) {
  if (!images || !Array.isArray(images)) return null;
  
  const thumbnail = images.find(img => 
    img.src?.includes('thm-') || 
    img.width <= 100 || 
    img.height <= 100
  );
  
  return thumbnail ? thumbnail.src : (images[0]?.src || null);
}

function generateReviewTags(content, performanceInfo) {
  const tags = [];
  
  // Add venue-based tags
  if (performanceInfo.venue) {
    tags.push(performanceInfo.venue.toLowerCase().replace(/\s+/g, '_'));
  }
  
  // Add organization tags
  if (performanceInfo.organization) {
    tags.push(performanceInfo.organization.toLowerCase().replace(/\s+/g, '_'));
  }
  
  // Add performance type tags
  const contentLower = content.toLowerCase();
  const performanceTypes = ['gala', 'opening', 'debut', 'premiere', 'festival'];
  performanceTypes.forEach(type => {
    if (contentLower.includes(type)) {
      tags.push(type);
    }
  });
  
  return tags;
}

function generateReviewAnalytics(reviews) {
  const analytics = reviews.analytics;
  
  reviews.reviews.forEach(review => {
    // Venue analysis
    if (review.performance.venue) {
      analytics.venues[review.performance.venue] = (analytics.venues[review.performance.venue] || 0) + 1;
    }
    
    // Performer analysis
    if (review.performance.conductor) {
      analytics.performers[review.performance.conductor] = (analytics.performers[review.performance.conductor] || 0) + 1;
    }
    review.performance.soloists.forEach(soloist => {
      analytics.performers[soloist] = (analytics.performers[soloist] || 0) + 1;
    });
    
    // Works analysis
    review.musical_works.primary_works.forEach(work => {
      analytics.works[work] = (analytics.works[work] || 0) + 1;
    });
    
    // Rating analysis
    const assessment = review.review_analysis.overall_assessment;
    if (assessment) {
      analytics.ratings[assessment] = (analytics.ratings[assessment] || 0) + 1;
    }
  });
  
  analytics.total = reviews.reviews.length;
  
  // Time range analysis
  const dates = reviews.reviews
    .map(r => r.publication.date)
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
  extractReviewsSpecialized();
}

module.exports = { extractReviewsSpecialized };
