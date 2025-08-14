#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * SPECIALIZED WARNER PROFESSIONAL PORTFOLIO EXTRACTOR
 * Focused extraction for w_* professional portfolio files
 */
async function extractWarnerPortfolioSpecialized() {
  console.log('💼 SPECIALIZED WARNER PORTFOLIO EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    const contentDir = path.join(__dirname, '../public/content');
    const warnerFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('w_') && file.endsWith('.md'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${warnerFiles.length} Warner portfolio files`);
    
    const portfolio = {
      metadata: {
        id: "warner_portfolio_specialized",
        type: "professional_portfolio",
        category: "professional_biography",
        subcategory: "executive_portfolio",
        extractionVersion: "specialized_v1",
        extractionDate: new Date().toISOString()
      },
      portfolio_sections: [],
      analytics: {
        content_types: {},
        organizations: {},
        timespan: {},
        expertise_areas: {},
        total: 0
      }
    };
    
    for (const filePath of warnerFiles) {
      const fileName = path.basename(filePath);
      console.log(`📄 Processing portfolio section: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const section = extractPortfolioSection(fileName, frontMatter, content);
        if (section) {
          portfolio.portfolio_sections.push(section);
        }
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate analytics
    generatePortfolioAnalytics(portfolio);
    
    console.log('\n📊 Warner Portfolio Extraction Results:');
    console.log(`Total sections: ${portfolio.portfolio_sections.length}`);
    console.log(`Content types: ${Object.keys(portfolio.analytics.content_types).length}`);
    console.log(`Organizations: ${Object.keys(portfolio.analytics.organizations).length}`);
    console.log(`Expertise areas: ${Object.keys(portfolio.analytics.expertise_areas).length}`);
    
    // Save specialized data
    const outputPath = path.join(__dirname, '../src/data/warner-portfolio-specialized.json');
    fs.writeFileSync(outputPath, JSON.stringify(portfolio, null, 2));
    console.log(`\n💾 Saved specialized Warner portfolio to: ${outputPath}`);
    
    return portfolio;
    
  } catch (error) {
    console.error('❌ Error in specialized Warner portfolio extraction:', error);
    process.exit(1);
  }
}

function extractPortfolioSection(fileName, frontMatter, content) {
  const sectionType = classifyPortfolioSection(fileName, content);
  const professionalData = extractProfessionalData(sectionType, content);
  
  const section = {
    id: frontMatter.id || fileName.replace('.md', ''),
    metadata: {
      type: 'portfolio_section',
      category: 'professional_biography',
      status: 'published',
      source_file: fileName
    },
    content: {
      title: frontMatter.title || generateSectionTitle(fileName),
      section_type: sectionType,
      summary: extractSectionSummary(content),
      excerpt: extractSectionExcerpt(content),
      full_content: content,
      word_count: content.split(/\s+/).length
    },
    professional_data: {
      type: sectionType,
      organizations: professionalData.organizations,
      positions: professionalData.positions,
      projects: professionalData.projects,
      publications: professionalData.publications,
      achievements: professionalData.achievements,
      expertise: professionalData.expertise,
      timeframe: professionalData.timeframe
    },
    biographical_elements: {
      education: extractEducation(content),
      awards: extractAwards(content),
      leadership_roles: extractLeadershipRoles(content),
      professional_affiliations: extractProfessionalAffiliations(content),
      career_highlights: extractCareerHighlights(content)
    },
    publication: {
      date: frontMatter.publication?.date || null,
      publisher: frontMatter.publication?.publisher || 'NorthWorks Portfolio',
      author: 'D. Warner North'
    },
    media: {
      images: frontMatter.images || [],
      thumbnail: extractThumbnail(frontMatter.images),
      professional_photos: extractProfessionalPhotos(frontMatter.images)
    },
    context: {
      industry_focus: extractIndustryFocus(content),
      geographic_scope: extractGeographicScope(content),
      technical_domains: extractTechnicalDomains(content),
      collaborative_networks: extractCollaborativeNetworks(content)
    },
    tags: [
      ...(frontMatter.tags || []),
      ...generatePortfolioTags(content, sectionType)
    ]
  };
  
  return section;
}

function classifyPortfolioSection(fileName, content) {
  const fileBaseName = fileName.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Direct filename classification
  if (fileBaseName.includes('main') || fileBaseName.includes('background')) return 'biography_overview';
  if (fileBaseName.includes('projects')) return 'project_portfolio';
  if (fileBaseName.includes('pub')) return 'publications';
  if (fileBaseName.includes('northworks')) return 'current_position';
  if (fileBaseName.includes('epasab') || fileBaseName.includes('epa')) return 'advisory_role';
  
  // Content-based classification
  if (contentLower.includes('publications') || contentLower.includes('papers')) return 'publications';
  if (contentLower.includes('projects') || contentLower.includes('consulting')) return 'project_portfolio';
  if (contentLower.includes('education') || contentLower.includes('degree')) return 'education_background';
  if (contentLower.includes('awards') || contentLower.includes('recognition')) return 'awards_recognition';
  if (contentLower.includes('board') || contentLower.includes('advisory')) return 'advisory_role';
  if (contentLower.includes('president') || contentLower.includes('chair')) return 'leadership_role';
  
  return 'general_professional';
}

function extractProfessionalData(sectionType, content) {
  const data = {
    organizations: [],
    positions: [],
    projects: [],
    publications: [],
    achievements: [],
    expertise: [],
    timeframe: {}
  };
  
  // Extract organizations
  const orgPatterns = [
    /(Stanford University|NorthWorks|EPA|National Research Council|Society for Risk Analysis|Nuclear Waste Technical Review Board)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|Institute|Corporation|Company|Agency|Board|Society|Association))/g
  ];
  
  orgPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      data.organizations.push(...matches);
    }
  });
  
  // Extract positions/titles
  const positionPatterns = [
    /(?:served as|appointed as|position as|role as)\s+([^.]+)/gi,
    /(principal scientist|consulting professor|president|chairman|member|consultant)/gi,
    /(Ph\.D\.|B\.S\.|Professor|Dr\.)\s+([^,.\n]+)/gi
  ];
  
  positionPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      data.positions.push(...matches.map(m => m.replace(/^(?:served as|appointed as|position as|role as)\s+/i, '')));
    }
  });
  
  // Extract projects (for project sections)
  if (sectionType === 'project_portfolio') {
    const projectPatterns = [
      /project[^.]*([^.]+)/gi,
      /analysis for\s+([^.]+)/gi,
      /consulting for\s+([^.]+)/gi
    ];
    
    projectPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        data.projects.push(...matches);
      }
    });
  }
  
  // Extract publications (for publication sections)
  if (sectionType === 'publications') {
    const pubPatterns = [
      /"([^"]+)"/g,  // Quoted titles
      /\*([^*]+)\*/g  // Italicized titles
    ];
    
    pubPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        data.publications.push(...matches.map(m => m.replace(/[*"]/g, '')));
      }
    });
  }
  
  // Extract achievements/awards
  const achievementPatterns = [
    /(medal|award|prize|recognition|achievement)/gi,
    /recipient of\s+([^.]+)/gi,
    /winner of\s+([^.]+)/gi
  ];
  
  achievementPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      data.achievements.push(...matches);
    }
  });
  
  // Extract expertise areas
  const expertiseKeywords = [
    'decision analysis', 'risk analysis', 'operations research', 'environmental protection',
    'nuclear waste', 'energy', 'management science', 'consulting', 'advisory services'
  ];
  
  const contentLower = content.toLowerCase();
  expertiseKeywords.forEach(expertise => {
    if (contentLower.includes(expertise)) {
      data.expertise.push(expertise);
    }
  });
  
  // Extract timeframe
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const years = content.match(yearPattern);
  if (years && years.length > 0) {
    const numericYears = years.map(y => parseInt(y)).filter(y => !isNaN(y));
    if (numericYears.length > 0) {
      data.timeframe = {
        earliest: Math.min(...numericYears),
        latest: Math.max(...numericYears),
        span: Math.max(...numericYears) - Math.min(...numericYears)
      };
    }
  }
  
  // Deduplicate arrays
  Object.keys(data).forEach(key => {
    if (Array.isArray(data[key])) {
      data[key] = [...new Set(data[key])];
    }
  });
  
  return data;
}

function extractEducation(content) {
  const education = [];
  const eduPatterns = [
    /(Ph\.D\.|Ph\.D|Doctor of Philosophy|Doctorate)\s+in\s+([^,.\n]+)(?:\s+from\s+([^,.\n]+))?/gi,
    /(B\.S\.|Bachelor)\s+in\s+([^,.\n]+)(?:\s+from\s+([^,.\n]+))?/gi,
    /(M\.S\.|Master)\s+in\s+([^,.\n]+)(?:\s+from\s+([^,.\n]+))?/gi
  ];
  
  eduPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      education.push({
        degree: match[1],
        field: match[2],
        institution: match[3] || null
      });
    }
  });
  
  return education;
}

function extractAwards(content) {
  const awards = [];
  const awardPatterns = [
    /(Frank P\. Ramsey Medal)/gi,
    /(Outstanding Risk Practitioner Award)/gi,
    /(Distinguished Achievement Award)/gi,
    /recipient of\s+(?:the\s+)?([^,.\n]+(?:medal|award|prize))/gi
  ];
  
  awardPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      awards.push(...matches.map(m => m.replace(/^recipient of\s+(?:the\s+)?/i, '')));
    }
  });
  
  return [...new Set(awards)];
}

function extractLeadershipRoles(content) {
  const roles = [];
  const leadershipPatterns = [
    /(?:president|chairman|chair|director|head)\s+(?:of\s+)?([^,.\n]+)/gi,
    /(?:served as|appointed as)\s+([^,.\n]*(?:president|chairman|chair|director)[^,.\n]*)/gi
  ];
  
  leadershipPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      roles.push(...matches);
    }
  });
  
  return [...new Set(roles)];
}

function extractProfessionalAffiliations(content) {
  const affiliations = [];
  const affiliationPatterns = [
    /member of\s+([^,.\n]+)/gi,
    /board member\s+(?:of\s+)?([^,.\n]+)/gi,
    /consultant to\s+([^,.\n]+)/gi,
    /affiliated with\s+([^,.\n]+)/gi
  ];
  
  affiliationPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      affiliations.push(...matches.map(m => m.replace(/^(?:member of|board member|consultant to|affiliated with)\s+(?:of\s+)?/i, '')));
    }
  });
  
  return [...new Set(affiliations)];
}

function extractCareerHighlights(content) {
  const highlights = [];
  
  // Look for significant achievements, appointments, and career milestones
  const highlightPatterns = [
    /(?:appointed|selected|chosen|nominated)\s+(?:as\s+)?([^,.\n]+)/gi,
    /(?:over the past|for the past)\s+([^,.\n]+years?)/gi,
    /(?:since|from)\s+(\d{4})/gi
  ];
  
  highlightPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      highlights.push(...matches);
    }
  });
  
  return highlights.slice(0, 10); // Limit to top 10 highlights
}

function extractIndustryFocus(content) {
  const industries = [];
  const industryKeywords = [
    'electric utilities', 'petroleum industry', 'chemical industry', 'government agencies',
    'environmental protection', 'energy sector', 'nuclear industry', 'risk assessment'
  ];
  
  const contentLower = content.toLowerCase();
  industryKeywords.forEach(industry => {
    if (contentLower.includes(industry)) {
      industries.push(industry);
    }
  });
  
  return industries;
}

function extractGeographicScope(content) {
  const locations = [];
  const locationPatterns = [
    /(United States|US|USA|Mexico|California|San Francisco|Stanford)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s+(?:California|Texas|New York|Mexico|Canada))/g
  ];
  
  locationPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      locations.push(...matches);
    }
  });
  
  return [...new Set(locations)];
}

function extractTechnicalDomains(content) {
  const domains = [];
  const technicalKeywords = [
    'decision analysis', 'risk analysis', 'operations research', 'management science',
    'environmental assessment', 'nuclear waste management', 'radioactive waste',
    'risk communication', 'public participation', 'technical review'
  ];
  
  const contentLower = content.toLowerCase();
  technicalKeywords.forEach(domain => {
    if (contentLower.includes(domain)) {
      domains.push(domain);
    }
  });
  
  return domains;
}

function extractCollaborativeNetworks(content) {
  const networks = [];
  const networkPatterns = [
    /collaboration with\s+([^,.\n]+)/gi,
    /working with\s+([^,.\n]+)/gi,
    /partnership with\s+([^,.\n]+)/gi,
    /co-author[^,.\n]*with\s+([^,.\n]+)/gi
  ];
  
  networkPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      networks.push(...matches.map(m => m.replace(/^(?:collaboration|working|partnership|co-author[^,.\n]*)\s+with\s+/i, '')));
    }
  });
  
  return [...new Set(networks)];
}

function generateSectionTitle(fileName) {
  const baseName = fileName.replace(/^w_/, '').replace(/\.md$/, '');
  
  const titleMap = {
    'main': 'Professional Biography Overview',
    'background': 'Professional Background',
    'projects': 'Project Portfolio & Experience',
    'pub': 'Publications & Research',
    'northworks': 'Current Position & NorthWorks',
    'epasab1990': 'EPA Science Advisory Board Service',
    'projects_stanford': 'Stanford University Projects',
    'projects_nrc': 'National Research Council Projects',
    'projects_government': 'Government Consulting Projects',
    'pub_vniigaz': 'VNIIGAZ Publications',
    'pub_stuttgart': 'Stuttgart Research Publications',
    'pub_seif-iv': 'SEIF-IV Publications'
  };
  
  return titleMap[baseName] || baseName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function extractSectionSummary(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  return paragraphs[0]?.substring(0, 300) + '...' || '';
}

function extractSectionExcerpt(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const midIndex = Math.floor(paragraphs.length / 2);
  return paragraphs[midIndex]?.substring(0, 250) + '...' || '';
}

function extractThumbnail(images) {
  if (!images || !Array.isArray(images)) return null;
  
  // Look for small images or thumbnails
  const thumbnail = images.find(img => 
    img.src?.includes('thumb') || 
    img.src?.includes('thm-') ||
    img.width <= 150 || 
    img.height <= 150
  );
  
  return thumbnail ? thumbnail.src : (images[0]?.src || null);
}

function extractProfessionalPhotos(images) {
  if (!images || !Array.isArray(images)) return [];
  
  // Look for professional photos
  const professionalPhotos = images.filter(img => 
    img.src?.includes('warner') ||
    img.src?.includes('speaking') ||
    img.src?.includes('professional') ||
    (img.width > 200 && img.height > 200)
  );
  
  return professionalPhotos.map(img => img.src);
}

function generatePortfolioTags(content, sectionType) {
  const tags = [];
  
  // Add section type as tag
  tags.push(sectionType);
  
  // Add content-based tags
  const contentLower = content.toLowerCase();
  const tagKeywords = [
    'stanford', 'epa', 'northworks', 'consulting', 'research', 'analysis',
    'environmental', 'nuclear', 'energy', 'risk', 'decision'
  ];
  
  tagKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      tags.push(keyword);
    }
  });
  
  return [...new Set(tags)];
}

function generatePortfolioAnalytics(portfolio) {
  const analytics = portfolio.analytics;
  
  portfolio.portfolio_sections.forEach(section => {
    // Content type analysis
    analytics.content_types[section.content.section_type] = (analytics.content_types[section.content.section_type] || 0) + 1;
    
    // Organization analysis
    section.professional_data.organizations.forEach(org => {
      analytics.organizations[org] = (analytics.organizations[org] || 0) + 1;
    });
    
    // Expertise analysis
    section.professional_data.expertise.forEach(expertise => {
      analytics.expertise_areas[expertise] = (analytics.expertise_areas[expertise] || 0) + 1;
    });
  });
  
  analytics.total = portfolio.portfolio_sections.length;
  
  // Time range analysis
  const timespans = portfolio.portfolio_sections
    .map(s => s.professional_data.timeframe)
    .filter(t => t && t.earliest && t.latest);
  
  if (timespans.length > 0) {
    const allYears = timespans.reduce((years, span) => {
      years.push(span.earliest, span.latest);
      return years;
    }, []);
    
    analytics.timespan = {
      career_start: Math.min(...allYears),
      career_latest: Math.max(...allYears),
      total_span: Math.max(...allYears) - Math.min(...allYears)
    };
  }
}

// Run the specialized extraction
if (require.main === module) {
  extractWarnerPortfolioSpecialized();
}

module.exports = { extractWarnerPortfolioSpecialized };
