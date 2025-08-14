#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * SPECIALIZED INDEX PAGES EXTRACTOR
 * Focused extraction for index/navigation files like c_interviews.md, c_main.md
 */
async function extractIndexPagesSpecialized() {
  console.log('📑 SPECIALIZED INDEX PAGES EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    const contentDir = path.join(__dirname, '../public/content');
    const indexFiles = fs.readdirSync(contentDir)
      .filter(file => 
        (file.startsWith('c_') && 
         (file.includes('main') || file.includes('interviews') || file.includes('articles')) &&
         !file.includes('review') &&
         file.endsWith('.md'))
      )
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${indexFiles.length} index page files`);
    
    const indexPages = {
      metadata: {
        id: "classical_index_pages_specialized",
        type: "index_collection",
        category: "classical_music",
        subcategory: "navigation_indices",
        extractionVersion: "specialized_v1",
        extractionDate: new Date().toISOString()
      },
      index_pages: [],
      analytics: {
        page_types: {},
        content_categories: {},
        navigation_patterns: {},
        total: 0
      }
    };
    
    for (const filePath of indexFiles) {
      const fileName = path.basename(filePath);
      console.log(`📋 Processing index page: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const indexPage = extractIndexPageData(fileName, frontMatter, content);
        if (indexPage) {
          indexPages.index_pages.push(indexPage);
        }
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate analytics
    generateIndexAnalytics(indexPages);
    
    console.log('\n📊 Index Pages Extraction Results:');
    console.log(`Total index pages: ${indexPages.index_pages.length}`);
    console.log(`Page types: ${Object.keys(indexPages.analytics.page_types).length}`);
    console.log(`Content categories: ${Object.keys(indexPages.analytics.content_categories).length}`);
    
    // Save specialized data
    const outputPath = path.join(__dirname, '../src/data/index-pages-specialized.json');
    fs.writeFileSync(outputPath, JSON.stringify(indexPages, null, 2));
    console.log(`\n💾 Saved specialized index pages to: ${outputPath}`);
    
    return indexPages;
    
  } catch (error) {
    console.error('❌ Error in specialized index pages extraction:', error);
    process.exit(1);
  }
}

function extractIndexPageData(fileName, frontMatter, content) {
  const pageType = classifyIndexPageType(fileName, content);
  const navigationElements = extractNavigationElements(content);
  
  const indexPage = {
    id: frontMatter.id || fileName.replace('.md', ''),
    metadata: {
      type: 'index_page',
      category: 'classical_music',
      status: 'published',
      source_file: fileName
    },
    content: {
      title: frontMatter.title || generateIndexTitle(fileName),
      description: frontMatter.description || extractPageDescription(content),
      summary: extractIndexSummary(content),
      full_content: content,
      word_count: content.split(/\s+/).length
    },
    page_structure: {
      type: pageType,
      sections: extractPageSections(content),
      navigation_style: determineNavigationStyle(content),
      layout_pattern: determineLayoutPattern(content)
    },
    navigation: {
      links: navigationElements.links,
      thumbnails: navigationElements.thumbnails,
      categories: navigationElements.categories,
      featured_items: navigationElements.featured,
      breadcrumbs: extractBreadcrumbs(content)
    },
    content_organization: {
      total_items: navigationElements.total_items,
      grouping_method: determineGroupingMethod(content),
      sorting_order: determineSortingOrder(content),
      filtering_options: extractFilteringOptions(content)
    },
    visual_elements: {
      images: extractImageElements(content),
      thumbnails: navigationElements.thumbnails,
      layout_grids: extractLayoutGrids(content),
      visual_hierarchy: analyzeVisualHierarchy(content)
    },
    publication: {
      date: frontMatter.publication?.date || null,
      author: frontMatter.publication?.author || 'ANG Newspapers',
      publisher: frontMatter.publication?.publisher || 'ANG Newspapers Classical Music',
      last_updated: frontMatter.last_updated || null
    },
    seo_elements: {
      meta_description: frontMatter.meta_description || null,
      keywords: frontMatter.keywords || extractImplicitKeywords(content),
      page_title: frontMatter.page_title || frontMatter.title
    },
    user_experience: {
      accessibility_features: extractAccessibilityFeatures(content),
      mobile_optimization: assessMobileOptimization(content),
      load_performance: assessLoadPerformance(content),
      user_engagement: analyzeUserEngagement(content)
    },
    tags: [
      ...(frontMatter.tags || []),
      ...generateIndexTags(content, pageType)
    ]
  };
  
  return indexPage;
}

function classifyIndexPageType(fileName, content) {
  const fileBaseName = fileName.toLowerCase();
  const contentLower = content.toLowerCase();
  
  if (fileBaseName.includes('main')) return 'main_index';
  if (fileBaseName.includes('interviews')) return 'interview_index';
  if (fileBaseName.includes('articles')) return 'article_index';
  if (fileBaseName.includes('reviews')) return 'review_index';
  
  // Content-based classification
  if (contentLower.includes('thumbnail') && contentLower.includes('grid')) return 'thumbnail_grid';
  if (contentLower.includes('category') && contentLower.includes('section')) return 'categorized_index';
  if (contentLower.includes('alphabetical') || contentLower.includes('a-z')) return 'alphabetical_index';
  if (contentLower.includes('chronological') || contentLower.includes('date')) return 'chronological_index';
  
  return 'general_index';
}

function extractNavigationElements(content) {
  const elements = {
    links: [],
    thumbnails: [],
    categories: [],
    featured: [],
    total_items: 0
  };
  
  // Extract links
  const linkPatterns = [
    /\[([^\]]+)\]\(([^)]+)\)/g,  // Markdown links
    /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g,  // HTML links
    /href="([^"]*)"[^>]*>([^<]*)</g  // Simplified HTML
  ];
  
  linkPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      elements.links.push({
        text: match[1] || match[2],
        url: match[2] || match[1],
        type: 'navigation_link'
      });
    }
  });
  
  // Extract thumbnail references
  const thumbnailPatterns = [
    /thm-[^"'\s]+/g,
    /thumbnail[^"'\s]*/gi,
    /thumb[^"'\s]*/gi
  ];
  
  thumbnailPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      elements.thumbnails.push(...matches);
    }
  });
  
  // Extract categories/sections
  const categoryPatterns = [
    /(?:category|section|type):\s*([^\n]+)/gi,
    /##\s*([^\n]+)/g,  // H2 headers as categories
    /###\s*([^\n]+)/g  // H3 headers as subcategories
  ];
  
  categoryPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      elements.categories.push(...matches.map(m => m.replace(/^(?:category|section|type):\s*/i, '').replace(/^#{2,3}\s*/, '')));
    }
  });
  
  // Extract featured items
  const featuredPatterns = [
    /(?:featured|highlight|spotlight):\s*([^\n]+)/gi,
    /\*\*([^*]+)\*\*/g  // Bold text as featured
  ];
  
  featuredPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      elements.featured.push(...matches.map(m => m.replace(/^(?:featured|highlight|spotlight):\s*/i, '').replace(/\*\*/g, '')));
    }
  });
  
  elements.total_items = elements.links.length + elements.thumbnails.length;
  
  return elements;
}

function extractPageSections(content) {
  const sections = [];
  
  // Extract sections based on headers
  const sectionPattern = /^#{1,6}\s*(.+)$/gm;
  let match;
  
  while ((match = sectionPattern.exec(content)) !== null) {
    const level = match[0].match(/^#+/)[0].length;
    sections.push({
      title: match[1].trim(),
      level: level,
      type: level === 1 ? 'main_section' : level === 2 ? 'subsection' : 'detail_section'
    });
  }
  
  return sections;
}

function determineNavigationStyle(content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('grid') && contentLower.includes('thumbnail')) return 'thumbnail_grid';
  if (contentLower.includes('list') && contentLower.includes('bullet')) return 'bulleted_list';
  if (contentLower.includes('table') || contentLower.includes('|')) return 'tabular';
  if (contentLower.includes('card') || contentLower.includes('panel')) return 'card_layout';
  if (contentLower.includes('accordion') || contentLower.includes('collapse')) return 'accordion';
  
  return 'simple_list';
}

function determineLayoutPattern(content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('column') && contentLower.includes('multi')) return 'multi_column';
  if (contentLower.includes('sidebar') || contentLower.includes('aside')) return 'sidebar_layout';
  if (contentLower.includes('header') && contentLower.includes('footer')) return 'header_footer';
  if (contentLower.includes('responsive') || contentLower.includes('mobile')) return 'responsive';
  
  return 'single_column';
}

function determineGroupingMethod(content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('alphabetical') || contentLower.includes('a-z')) return 'alphabetical';
  if (contentLower.includes('chronological') || contentLower.includes('date')) return 'chronological';
  if (contentLower.includes('category') || contentLower.includes('type')) return 'categorical';
  if (contentLower.includes('topic') || contentLower.includes('subject')) return 'topical';
  if (contentLower.includes('popularity') || contentLower.includes('featured')) return 'by_popularity';
  
  return 'ungrouped';
}

function determineSortingOrder(content) {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('ascending') || contentLower.includes('a-z')) return 'ascending';
  if (contentLower.includes('descending') || contentLower.includes('z-a')) return 'descending';
  if (contentLower.includes('newest') || contentLower.includes('latest')) return 'newest_first';
  if (contentLower.includes('oldest') || contentLower.includes('earliest')) return 'oldest_first';
  if (contentLower.includes('popular') || contentLower.includes('featured')) return 'by_popularity';
  
  return 'default';
}

function extractFilteringOptions(content) {
  const options = [];
  const filterKeywords = [
    'filter', 'search', 'category', 'type', 'date', 'author', 'topic', 'tag'
  ];
  
  const contentLower = content.toLowerCase();
  filterKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      options.push(keyword);
    }
  });
  
  return options;
}

function extractImageElements(content) {
  const images = [];
  const imagePatterns = [
    /!\[([^\]]*)\]\(([^)]+)\)/g,  // Markdown images
    /<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g,  // HTML images
    /src="([^"]*\.(jpg|jpeg|png|gif|webp))"/gi  // Image sources
  ];
  
  imagePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      images.push({
        src: match[2] || match[1],
        alt: match[1] || match[2] || '',
        type: 'content_image'
      });
    }
  });
  
  return images;
}

function extractLayoutGrids(content) {
  const grids = [];
  const gridPatterns = [
    /grid[^"'\s]*/gi,
    /col-\d+/gi,
    /row[^"'\s]*/gi,
    /flex[^"'\s]*/gi
  ];
  
  gridPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      grids.push(...matches);
    }
  });
  
  return [...new Set(grids)];
}

function analyzeVisualHierarchy(content) {
  const hierarchy = {
    headers: 0,
    subheaders: 0,
    emphasis: 0,
    structure_score: 0
  };
  
  // Count headers
  const h1Count = (content.match(/^#\s/gm) || []).length;
  const h2Count = (content.match(/^##\s/gm) || []).length;
  const h3Count = (content.match(/^###\s/gm) || []).length;
  
  hierarchy.headers = h1Count + h2Count + h3Count;
  hierarchy.subheaders = h2Count + h3Count;
  
  // Count emphasis elements
  const boldCount = (content.match(/\*\*[^*]+\*\*/g) || []).length;
  const italicCount = (content.match(/\*[^*]+\*/g) || []).length;
  
  hierarchy.emphasis = boldCount + italicCount;
  
  // Calculate structure score
  hierarchy.structure_score = hierarchy.headers * 2 + hierarchy.emphasis;
  
  return hierarchy;
}

function extractBreadcrumbs(content) {
  const breadcrumbs = [];
  const breadcrumbPatterns = [
    /(?:home|main)\s*>\s*([^>\n]+)(?:\s*>\s*([^>\n]+))?/gi,
    /breadcrumb[^"'\n]*([^"'\n]+)/gi
  ];
  
  breadcrumbPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      breadcrumbs.push(...matches);
    }
  });
  
  return breadcrumbs;
}

function generateIndexTitle(fileName) {
  const baseName = fileName.replace(/^c_/, '').replace(/\.md$/, '');
  
  const titleMap = {
    'main': 'Classical Music Main Index',
    'interviews': 'Classical Music Interviews Index',
    'articles': 'Classical Music Articles Index',
    'reviews': 'Classical Music Reviews Index'
  };
  
  return titleMap[baseName] || baseName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Index';
}

function extractPageDescription(content) {
  // Extract first paragraph as description
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
  return paragraphs[0]?.substring(0, 200) || '';
}

function extractIndexSummary(content) {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Look for summary information
  const summaryLine = lines.find(line => 
    line.toLowerCase().includes('total') || 
    line.toLowerCase().includes('count') || 
    line.toLowerCase().includes('items')
  );
  
  return summaryLine || lines[0]?.substring(0, 150) + '...' || '';
}

function extractImplicitKeywords(content) {
  const keywords = [];
  const keywordSources = [
    'classical music', 'interviews', 'reviews', 'articles', 'performances',
    'symphony', 'opera', 'concerts', 'musicians', 'composers'
  ];
  
  const contentLower = content.toLowerCase();
  keywordSources.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  return keywords;
}

function extractAccessibilityFeatures(content) {
  const features = [];
  const a11yKeywords = [
    'alt=', 'aria-', 'role=', 'tabindex', 'screen reader', 'accessible',
    'keyboard navigation', 'focus', 'semantic'
  ];
  
  const contentLower = content.toLowerCase();
  a11yKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.toLowerCase())) {
      features.push(keyword);
    }
  });
  
  return features;
}

function assessMobileOptimization(content) {
  const contentLower = content.toLowerCase();
  let score = 0;
  
  const mobileIndicators = [
    'responsive', 'mobile', 'viewport', 'media query', 'flexible',
    'adaptive', 'breakpoint', 'touch'
  ];
  
  mobileIndicators.forEach(indicator => {
    if (contentLower.includes(indicator)) score++;
  });
  
  if (score >= 4) return 'high';
  if (score >= 2) return 'moderate';
  return 'low';
}

function assessLoadPerformance(content) {
  const contentLength = content.length;
  const imageCount = (content.match(/\.(jpg|jpeg|png|gif|webp)/gi) || []).length;
  
  if (contentLength < 10000 && imageCount < 10) return 'optimized';
  if (contentLength < 25000 && imageCount < 20) return 'moderate';
  return 'heavy';
}

function analyzeUserEngagement(content) {
  const contentLower = content.toLowerCase();
  let engagementScore = 0;
  
  const engagementFeatures = [
    'search', 'filter', 'sort', 'interactive', 'clickable', 'hover',
    'navigation', 'thumbnail', 'preview', 'link'
  ];
  
  engagementFeatures.forEach(feature => {
    if (contentLower.includes(feature)) engagementScore++;
  });
  
  if (engagementScore >= 6) return 'high';
  if (engagementScore >= 3) return 'moderate';
  return 'low';
}

function generateIndexTags(content, pageType) {
  const tags = [];
  
  // Add page type as tag
  tags.push(pageType);
  
  // Add content-based tags
  const contentLower = content.toLowerCase();
  const tagKeywords = [
    'navigation', 'index', 'directory', 'catalog', 'collection',
    'archive', 'library', 'database'
  ];
  
  tagKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return [...new Set(tags)];
}

function generateIndexAnalytics(indexPages) {
  const analytics = indexPages.analytics;
  
  indexPages.index_pages.forEach(page => {
    // Page type analysis
    analytics.page_types[page.page_structure.type] = (analytics.page_types[page.page_structure.type] || 0) + 1;
    
    // Content category analysis
    page.navigation.categories.forEach(category => {
      analytics.content_categories[category] = (analytics.content_categories[category] || 0) + 1;
    });
    
    // Navigation pattern analysis
    const navStyle = page.page_structure.navigation_style;
    analytics.navigation_patterns[navStyle] = (analytics.navigation_patterns[navStyle] || 0) + 1;
  });
  
  analytics.total = indexPages.index_pages.length;
}

// Run the specialized extraction
if (require.main === module) {
  extractIndexPagesSpecialized();
}

module.exports = { extractIndexPagesSpecialized };
