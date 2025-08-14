#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * SPECIALIZED CLASSICAL MUSIC ARTICLES EXTRACTOR
 * Focused extraction for c_art_* files
 */
async function extractArticlesSpecialized() {
  console.log('📰 SPECIALIZED ARTICLES EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    const contentDir = path.join(__dirname, '../public/content');
    const articleFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('c_art_') && file.endsWith('.md'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${articleFiles.length} article files`);
    
    const articles = {
      metadata: {
        id: "classical_articles_specialized",
        type: "article_collection",
        category: "classical_music",
        subcategory: "feature_articles",
        extractionVersion: "specialized_v1",
        extractionDate: new Date().toISOString()
      },
      articles: [],
      analytics: {
        topics: {},
        themes: {},
        subjects: {},
        organizations: {},
        timeRange: {},
        total: 0
      }
    };
    
    for (const filePath of articleFiles) {
      const fileName = path.basename(filePath);
      console.log(`📝 Processing article: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const article = extractArticleData(fileName, frontMatter, content);
        if (article) {
          articles.articles.push(article);
        }
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate analytics
    generateArticleAnalytics(articles);
    
    console.log('\n📊 Article Extraction Results:');
    console.log(`Total articles: ${articles.articles.length}`);
    console.log(`Topics covered: ${Object.keys(articles.analytics.topics).length}`);
    console.log(`Themes identified: ${Object.keys(articles.analytics.themes).length}`);
    console.log(`Organizations featured: ${Object.keys(articles.analytics.organizations).length}`);
    
    // Save specialized data
    const outputPath = path.join(__dirname, '../src/data/articles-specialized.json');
    fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));
    console.log(`\n💾 Saved specialized articles to: ${outputPath}`);
    
    return articles;
    
  } catch (error) {
    console.error('❌ Error in specialized articles extraction:', error);
    process.exit(1);
  }
}

function extractArticleData(fileName, frontMatter, content) {
  const topicAnalysis = analyzeArticleTopic(fileName, frontMatter, content);
  const thematicElements = extractThematicElements(content);
  
  const article = {
    id: frontMatter.id || fileName.replace('.md', ''),
    metadata: {
      type: 'feature_article',
      category: 'classical_music',
      status: 'published',
      source_file: fileName
    },
    content: {
      title: frontMatter.title || topicAnalysis.title,
      headline: extractHeadline(frontMatter, content),
      subtitle: frontMatter.subtitle || extractSubtitle(content),
      summary: extractArticleSummary(content),
      excerpt: extractArticleExcerpt(content),
      full_content: content,
      word_count: content.split(/\s+/).length
    },
    topic: {
      primary_topic: topicAnalysis.primary,
      secondary_topics: topicAnalysis.secondary,
      themes: thematicElements.themes,
      focus_areas: thematicElements.focus_areas,
      article_type: classifyArticleType(fileName, content)
    },
    subjects: {
      people: extractPeopleSubjects(content),
      organizations: extractOrganizations(content),
      venues: extractVenues(content),
      works: extractMusicalWorks(content),
      events: extractEvents(content)
    },
    musical_context: {
      genres: extractGenres(content),
      periods: extractMusicalPeriods(content),
      instruments: extractInstruments(content),
      techniques: extractTechniques(content),
      industry_aspects: extractIndustryAspects(content)
    },
    publication: {
      date: frontMatter.publication?.date || extractPublicationDate(fileName, content),
      author: frontMatter.publication?.author || 'Cheryl North',
      publisher: frontMatter.publication?.publisher || 'ANG Newspapers Classical Music',
      section: 'Classical Music Features'
    },
    media: {
      images: frontMatter.images || [],
      thumbnail: extractThumbnail(frontMatter.images),
      multimedia: extractMultimediaReferences(content)
    },
    analysis: {
      tone: analyzeArticleTone(content),
      depth: analyzeArticleDepth(content),
      perspective: analyzeArticlePerspective(content),
      target_audience: determineTargetAudience(content),
      educational_value: assessEducationalValue(content)
    },
    context: {
      cultural_significance: extractCulturalSignificance(content),
      historical_context: extractHistoricalContext(content),
      contemporary_relevance: extractContemporaryRelevance(content),
      industry_impact: extractIndustryImpact(content)
    },
    tags: [
      ...(frontMatter.tags || []),
      ...generateArticleTags(content, topicAnalysis)
    ]
  };
  
  return article;
}

function analyzeArticleTopic(fileName, frontMatter, content) {
  const fileBaseName = fileName.replace(/^c_art_/, '').replace(/\.md$/, '');
  
  const topicMap = {
    'brain': { primary: 'neuroscience', secondary: ['cognition', 'music_therapy', 'research'] },
    'casablanca': { primary: 'film_music', secondary: ['classical_in_media', 'cultural_impact'] },
    'coco': { primary: 'technology', secondary: ['concert_innovation', 'audience_experience'] },
    'fremontoperagasser': { primary: 'opera_production', secondary: ['staging', 'direction'] },
    'gergiev9': { primary: 'conductor_profile', secondary: ['interpretation', 'career'] },
    'heggie': { primary: 'composer_profile', secondary: ['contemporary_opera', 'american_music'] },
    'national_anthem': { primary: 'patriotic_music', secondary: ['performance_tradition', 'controversy'] },
    'natlsymph': { primary: 'orchestra_profile', secondary: ['national_identity', 'classical_institutions'] },
    'Ring_Legend': { primary: 'opera_analysis', secondary: ['wagner', 'mythology', 'interpretation'] },
    'wozzeck': { primary: 'opera_analysis', secondary: ['berg', 'modern_opera', 'psychological_drama'] }
  };
  
  const mapped = topicMap[fileBaseName];
  if (mapped) {
    return {
      title: generateTitleFromTopic(mapped.primary, fileBaseName),
      primary: mapped.primary,
      secondary: mapped.secondary
    };
  }
  
  // Fallback analysis based on content
  return analyzeContentTopic(content, fileBaseName);
}

function analyzeContentTopic(content, fileBaseName) {
  const contentLower = content.toLowerCase();
  
  // Technology focus
  if (contentLower.includes('technology') || contentLower.includes('digital') || contentLower.includes('innovation')) {
    return {
      title: 'Technology in Classical Music',
      primary: 'technology',
      secondary: ['innovation', 'digital_experience']
    };
  }
  
  // Opera focus
  if (contentLower.includes('opera') || contentLower.includes('staging') || contentLower.includes('libretto')) {
    return {
      title: 'Opera Production and Performance',
      primary: 'opera',
      secondary: ['production', 'performance', 'staging']
    };
  }
  
  // Orchestra/Symphony focus
  if (contentLower.includes('symphony') || contentLower.includes('orchestra') || contentLower.includes('conductor')) {
    return {
      title: 'Orchestral Music and Performance',
      primary: 'orchestral_music',
      secondary: ['conducting', 'performance', 'repertoire']
    };
  }
  
  // Default
  return {
    title: fileBaseName.charAt(0).toUpperCase() + fileBaseName.slice(1).replace(/_/g, ' '),
    primary: 'classical_music',
    secondary: ['general_interest']
  };
}

function generateTitleFromTopic(primaryTopic, fileBaseName) {
  const titleMap = {
    'neuroscience': 'Music and the Brain: Neuroscience Insights',
    'film_music': 'Classical Music in Cinema',
    'technology': 'Innovation in Concert Technology',
    'opera_production': 'Behind the Scenes of Opera Production',
    'conductor_profile': 'Maestro Profile: Conducting Excellence',
    'composer_profile': 'Contemporary Composer Spotlight',
    'patriotic_music': 'The Role of Music in National Identity',
    'orchestra_profile': 'Symphony Orchestra in Focus',
    'opera_analysis': 'Opera Masterwork Analysis'
  };
  
  return titleMap[primaryTopic] || fileBaseName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function extractThematicElements(content) {
  const themes = [];
  const focusAreas = [];
  
  const themeKeywords = {
    'innovation': ['innovation', 'new', 'revolutionary', 'breakthrough'],
    'tradition': ['tradition', 'classical', 'heritage', 'legacy'],
    'education': ['education', 'learning', 'teaching', 'students'],
    'performance': ['performance', 'concert', 'recital', 'presentation'],
    'creativity': ['creativity', 'artistic', 'inspiration', 'imagination'],
    'community': ['community', 'audience', 'public', 'society'],
    'excellence': ['excellence', 'mastery', 'perfection', 'quality'],
    'evolution': ['evolution', 'change', 'development', 'progress']
  };
  
  const contentLower = content.toLowerCase();
  
  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      themes.push(theme);
    }
  });
  
  // Focus areas
  const focusKeywords = {
    'technical': ['technique', 'technical', 'skill', 'method'],
    'artistic': ['artistic', 'interpretation', 'expression', 'creativity'],
    'historical': ['history', 'historical', 'tradition', 'past'],
    'contemporary': ['contemporary', 'modern', 'current', 'today'],
    'cultural': ['culture', 'cultural', 'society', 'social'],
    'educational': ['education', 'teaching', 'learning', 'academic']
  };
  
  Object.entries(focusKeywords).forEach(([focus, keywords]) => {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      focusAreas.push(focus);
    }
  });
  
  return { themes, focus_areas: focusAreas };
}

function classifyArticleType(fileName, content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('interview') || contentLower.includes('conversation')) return 'interview_feature';
  if (contentLower.includes('profile') || contentLower.includes('biography')) return 'profile';
  if (contentLower.includes('analysis') || contentLower.includes('examination')) return 'analysis';
  if (contentLower.includes('review') || contentLower.includes('critique')) return 'review_feature';
  if (contentLower.includes('technology') || contentLower.includes('innovation')) return 'technology_feature';
  if (contentLower.includes('history') || contentLower.includes('historical')) return 'historical_feature';
  if (contentLower.includes('education') || contentLower.includes('learning')) return 'educational_feature';
  
  return 'general_feature';
}

function extractPeopleSubjects(content) {
  const people = [];
  const namePatterns = [
    /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:,?\s+(?:conductor|composer|pianist|violinist|soprano|tenor|baritone|bass))/g,
    /(?:Maestro|Mr\.|Ms\.|Dr\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
  ];
  
  namePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const name = match.replace(/^(?:Maestro|Mr\.|Ms\.|Dr\.)\s+/i, '').replace(/,?\s+(?:conductor|composer|pianist|violinist|soprano|tenor|baritone|bass)$/i, '');
        if (name && !people.includes(name)) {
          people.push(name);
        }
      });
    }
  });
  
  return people.slice(0, 10);
}

function extractOrganizations(content) {
  const organizations = [];
  const orgPatterns = [
    /(San Francisco Symphony|San Francisco Opera|New York Philharmonic|Metropolitan Opera|Boston Symphony)/gi,
    /([A-Z][a-z]+\s+(?:Symphony|Opera|Orchestra|Conservatory|University|College))/g
  ];
  
  orgPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      organizations.push(...matches);
    }
  });
  
  return [...new Set(organizations)];
}

function extractVenues(content) {
  const venues = [];
  const venuePatterns = [
    /(Davies Symphony Hall|Carnegie Hall|Lincoln Center|Kennedy Center|War Memorial Opera House)/gi,
    /([A-Z][a-z]+\s+(?:Hall|Theatre|Theater|Center|Opera House))/g
  ];
  
  venuePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      venues.push(...matches);
    }
  });
  
  return [...new Set(venues)];
}

function extractMusicalWorks(content) {
  const works = [];
  const workPatterns = [
    /([A-Z][a-z]+(?:'s)?\s+(?:Symphony|Concerto|Sonata|Opera|Quartet)(?:\s+(?:No\.|in)\s*[A-Za-z0-9-]+)?)/g,
    /"([^"]+)"/g
  ];
  
  workPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      works.push(...matches.map(m => m.replace(/^"|"$/g, '')));
    }
  });
  
  return [...new Set(works)].slice(0, 8);
}

function extractEvents(content) {
  const events = [];
  const eventPatterns = [
    /(opening night|gala|festival|competition|masterclass)/gi,
    /([A-Z][a-z]+\s+(?:Festival|Competition|Series|Season))/g
  ];
  
  eventPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      events.push(...matches);
    }
  });
  
  return [...new Set(events)];
}

function extractGenres(content) {
  const genres = [];
  const genreKeywords = [
    'symphony', 'opera', 'chamber music', 'concerto', 'sonata', 'quartet',
    'orchestral', 'vocal', 'instrumental', 'choral', 'ballet'
  ];
  
  const contentLower = content.toLowerCase();
  genreKeywords.forEach(genre => {
    if (contentLower.includes(genre)) {
      genres.push(genre);
    }
  });
  
  return [...new Set(genres)];
}

function extractMusicalPeriods(content) {
  const periods = [];
  const periodKeywords = [
    'baroque', 'classical', 'romantic', 'modern', 'contemporary',
    'renaissance', 'impressionist', 'atonal', 'minimalist'
  ];
  
  const contentLower = content.toLowerCase();
  periodKeywords.forEach(period => {
    if (contentLower.includes(period)) {
      periods.push(period);
    }
  });
  
  return [...new Set(periods)];
}

function extractInstruments(content) {
  const instruments = [];
  const instrumentKeywords = [
    'piano', 'violin', 'viola', 'cello', 'double bass', 'flute', 'oboe',
    'clarinet', 'bassoon', 'horn', 'trumpet', 'trombone', 'tuba', 'harp',
    'percussion', 'organ', 'harpsichord'
  ];
  
  const contentLower = content.toLowerCase();
  instrumentKeywords.forEach(instrument => {
    if (contentLower.includes(instrument)) {
      instruments.push(instrument);
    }
  });
  
  return [...new Set(instruments)];
}

function extractTechniques(content) {
  const techniques = [];
  const techniqueKeywords = [
    'technique', 'method', 'approach', 'interpretation', 'phrasing',
    'dynamics', 'tempo', 'rhythm', 'harmony', 'counterpoint'
  ];
  
  const contentLower = content.toLowerCase();
  techniqueKeywords.forEach(technique => {
    if (contentLower.includes(technique)) {
      techniques.push(technique);
    }
  });
  
  return [...new Set(techniques)];
}

function extractIndustryAspects(content) {
  const aspects = [];
  const aspectKeywords = [
    'recording', 'publishing', 'performance rights', 'touring', 'education',
    'funding', 'audience development', 'marketing', 'technology', 'streaming'
  ];
  
  const contentLower = content.toLowerCase();
  aspectKeywords.forEach(aspect => {
    if (contentLower.includes(aspect.replace(/\s+/g, '\\s+'))) {
      aspects.push(aspect);
    }
  });
  
  return [...new Set(aspects)];
}

function analyzeArticleTone(content) {
  const contentLower = content.toLowerCase();
  
  const toneIndicators = {
    'informative': ['explains', 'describes', 'outlines', 'details'],
    'analytical': ['analysis', 'examines', 'explores', 'investigates'],
    'enthusiastic': ['exciting', 'wonderful', 'amazing', 'brilliant'],
    'critical': ['however', 'but', 'unfortunately', 'disappointing'],
    'educational': ['learn', 'understand', 'discover', 'knowledge'],
    'contemplative': ['reflects', 'considers', 'ponders', 'contemplates']
  };
  
  let maxCount = 0;
  let dominantTone = 'neutral';
  
  Object.entries(toneIndicators).forEach(([tone, indicators]) => {
    const count = indicators.filter(indicator => contentLower.includes(indicator)).length;
    if (count > maxCount) {
      maxCount = count;
      dominantTone = tone;
    }
  });
  
  return dominantTone;
}

function analyzeArticleDepth(content) {
  const wordCount = content.split(/\s+/).length;
  const paragraphCount = content.split('\n\n').filter(p => p.trim().length > 0).length;
  
  if (wordCount > 2000 && paragraphCount > 10) return 'comprehensive';
  if (wordCount > 1000 && paragraphCount > 6) return 'detailed';
  if (wordCount > 500 && paragraphCount > 3) return 'moderate';
  return 'brief';
}

function analyzeArticlePerspective(content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('i think') || contentLower.includes('in my opinion')) return 'personal';
  if (contentLower.includes('experts say') || contentLower.includes('according to')) return 'expert_sourced';
  if (contentLower.includes('research shows') || contentLower.includes('studies indicate')) return 'research_based';
  if (contentLower.includes('history shows') || contentLower.includes('traditionally')) return 'historical';
  
  return 'objective';
}

function determineTargetAudience(content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('beginner') || contentLower.includes('introduction')) return 'beginners';
  if (contentLower.includes('advanced') || contentLower.includes('sophisticated')) return 'advanced';
  if (contentLower.includes('professional') || contentLower.includes('industry')) return 'professionals';
  if (contentLower.includes('student') || contentLower.includes('learning')) return 'students';
  
  return 'general_public';
}

function assessEducationalValue(content) {
  const contentLower = content.toLowerCase();
  let score = 0;
  
  const educationalIndicators = [
    'explains', 'teaches', 'demonstrates', 'illustrates', 'background',
    'history', 'technique', 'method', 'theory', 'analysis'
  ];
  
  educationalIndicators.forEach(indicator => {
    if (contentLower.includes(indicator)) score++;
  });
  
  if (score >= 6) return 'high';
  if (score >= 3) return 'moderate';
  return 'low';
}

function extractCulturalSignificance(content) {
  const significance = [];
  const significanceKeywords = [
    'cultural impact', 'tradition', 'heritage', 'legacy', 'influence',
    'cultural bridge', 'artistic expression', 'social significance'
  ];
  
  const contentLower = content.toLowerCase();
  significanceKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.replace(/\s+/g, '\\s+'))) {
      significance.push(keyword);
    }
  });
  
  return significance;
}

function extractHistoricalContext(content) {
  const context = [];
  const historyKeywords = [
    'historically', 'tradition', 'originally', 'centuries', 'evolution',
    'development', 'origins', 'founded', 'established'
  ];
  
  const contentLower = content.toLowerCase();
  historyKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      context.push(keyword);
    }
  });
  
  return context;
}

function extractContemporaryRelevance(content) {
  const relevance = [];
  const modernKeywords = [
    'today', 'currently', 'modern', 'contemporary', 'now', 'recent',
    'current trends', 'digital age', 'social media', 'streaming'
  ];
  
  const contentLower = content.toLowerCase();
  modernKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.replace(/\s+/g, '\\s+'))) {
      relevance.push(keyword);
    }
  });
  
  return relevance;
}

function extractIndustryImpact(content) {
  const impact = [];
  const impactKeywords = [
    'industry change', 'market impact', 'business model', 'revenue',
    'audience development', 'technology adoption', 'industry trends'
  ];
  
  const contentLower = content.toLowerCase();
  impactKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.replace(/\s+/g, '\\s+'))) {
      impact.push(keyword);
    }
  });
  
  return impact;
}

function extractHeadline(frontMatter, content) {
  if (frontMatter.headline) return frontMatter.headline;
  
  // Extract first strong statement
  const sentences = content.split(/[.!?]/);
  return sentences[0]?.trim() + '.' || '';
}

function extractSubtitle(content) {
  // Look for second sentence or first subheading
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const secondLine = lines[1];
  
  if (secondLine && secondLine.length < 100) {
    return secondLine.trim();
  }
  
  return null;
}

function extractArticleSummary(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  return paragraphs[0]?.substring(0, 300) + '...' || '';
}

function extractArticleExcerpt(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const midIndex = Math.floor(paragraphs.length / 2);
  return paragraphs[midIndex]?.substring(0, 250) + '...' || '';
}

function extractPublicationDate(fileName, content) {
  const dateMatch = fileName.match(/(\d{4}[-_]\d{1,2}[-_]\d{1,2})/);
  if (dateMatch) {
    return dateMatch[1].replace(/[-_]/g, '/');
  }
  
  const datePattern = /published\s+(\w+\s+\d{1,2},?\s+\d{4})/i;
  const match = content.match(datePattern);
  if (match) {
    return match[1];
  }
  
  return null;
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

function extractMultimediaReferences(content) {
  const multimedia = [];
  const mediaPatterns = [
    /video|recording|audio|podcast/gi,
    /youtube|vimeo|soundcloud/gi,
    /listen|watch|view/gi
  ];
  
  mediaPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      multimedia.push(...matches);
    }
  });
  
  return [...new Set(multimedia)];
}

function generateArticleTags(content, topicAnalysis) {
  const tags = [];
  
  // Add primary topic as tag
  tags.push(topicAnalysis.primary);
  
  // Add secondary topics
  tags.push(...topicAnalysis.secondary);
  
  // Add content-based tags
  const contentLower = content.toLowerCase();
  const tagKeywords = ['innovation', 'education', 'performance', 'technology', 'tradition'];
  
  tagKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return [...new Set(tags)];
}

function generateArticleAnalytics(articles) {
  const analytics = articles.analytics;
  
  articles.articles.forEach(article => {
    // Topic analysis
    analytics.topics[article.topic.primary_topic] = (analytics.topics[article.topic.primary_topic] || 0) + 1;
    
    // Theme analysis
    article.topic.themes.forEach(theme => {
      analytics.themes[theme] = (analytics.themes[theme] || 0) + 1;
    });
    
    // Subject analysis
    article.subjects.people.forEach(person => {
      analytics.subjects[person] = (analytics.subjects[person] || 0) + 1;
    });
    
    // Organization analysis
    article.subjects.organizations.forEach(org => {
      analytics.organizations[org] = (analytics.organizations[org] || 0) + 1;
    });
  });
  
  analytics.total = articles.articles.length;
  
  // Time range analysis
  const dates = articles.articles
    .map(a => a.publication.date)
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
  extractArticlesSpecialized();
}

module.exports = { extractArticlesSpecialized };
