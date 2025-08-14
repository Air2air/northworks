#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * High-Quality Warner Content Extraction
 * Focus on meaningful professional content rather than fragmented lists
 */
async function extractWarnerQualityContent() {
  console.log('🎯 HIGH-QUALITY WARNER CONTENT EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    // Find all w_* files
    const contentDir = path.join(__dirname, '../public/content');
    const warnerFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('w_'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${warnerFiles.length} Warner files for quality extraction`);
    
    const qualityData = {
      metadata: {
        id: "warner_content_quality",
        type: "professional_portfolio_collection",
        category: "professional",
        subcategory: "structured-portfolio",
        status: "published",
        extractionVersion: "quality_focused"
      },
      content: {
        title: "D. Warner North - Professional Portfolio",
        summary: "Comprehensive professional portfolio including biography, projects, publications, expertise, and achievements",
        body: "High-quality extraction focusing on substantive professional content rather than fragmented text parsing."
      },
      portfolio: {
        biography: {},
        expertise: [],
        projects: [],
        publications: [],
        positions: [],
        awards: [],
        education: [],
        affiliations: []
      },
      legacy: {
        sourceFiles: warnerFiles.map(f => path.basename(f)),
        extractionDate: new Date().toISOString()
      }
    };
    
    // Process each file with focused extraction
    for (const filePath of warnerFiles) {
      const fileName = path.basename(filePath);
      console.log(`📄 Processing: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        // Extract based on file type
        await extractQualityContent(qualityData.portfolio, content, fileName, frontMatter);
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Clean and validate the extracted data
    cleanAndValidateData(qualityData.portfolio);
    
    console.log('\n📊 Quality Extraction Results:');
    console.log(`Biography sections: ${Object.keys(qualityData.portfolio.biography).length}`);
    console.log(`Expertise areas: ${qualityData.portfolio.expertise.length}`);
    console.log(`Projects: ${qualityData.portfolio.projects.length}`);
    console.log(`Publications: ${qualityData.portfolio.publications.length}`);
    console.log(`Positions: ${qualityData.portfolio.positions.length}`);
    console.log(`Awards: ${qualityData.portfolio.awards.length}`);
    console.log(`Education: ${qualityData.portfolio.education.length}`);
    console.log(`Affiliations: ${qualityData.portfolio.affiliations.length}`);
    
    // Save quality data
    const outputPath = path.join(__dirname, '../src/data/warner-portfolio-quality.json');
    fs.writeFileSync(outputPath, JSON.stringify(qualityData, null, 2));
    console.log(`\n💾 Saved quality portfolio to: ${outputPath}`);
    
    generateQualityAnalysis(qualityData);
    
  } catch (error) {
    console.error('❌ Error in quality extraction:', error);
    process.exit(1);
  }
}

/**
 * Extract quality content based on file type and structure
 */
async function extractQualityContent(portfolio, content, fileName, frontMatter) {
  const cleanContent = content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\*+/g, '');
  const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 50);
  
  if (fileName === 'w_main.md') {
    extractBiographyContent(portfolio, paragraphs, frontMatter);
  } else if (fileName === 'w_projects.md') {
    extractProjectsContent(portfolio, paragraphs, content);
  } else if (fileName.includes('pub')) {
    extractPublicationsContent(portfolio, paragraphs, content, fileName);
  } else if (fileName === 'w_background.md') {
    extractExpertiseContent(portfolio, paragraphs);
  }
  
  // Extract general professional information from all files
  extractGeneralProfessionalInfo(portfolio, paragraphs, fileName);
}

/**
 * Extract biography content from main file
 */
function extractBiographyContent(portfolio, paragraphs, frontMatter) {
  portfolio.biography = {
    overview: extractOverview(paragraphs),
    currentPosition: extractCurrentPosition(paragraphs),
    expertise: extractExpertiseAreas(paragraphs),
    achievements: extractMajorAchievements(paragraphs),
    education: extractEducationFromBio(paragraphs)
  };
}

/**
 * Extract overview from first meaningful paragraph
 */
function extractOverview(paragraphs) {
  const overviewParagraph = paragraphs.find(p => 
    p.includes('principal scientist') || 
    p.includes('consulting professor') ||
    p.includes('NorthWorks')
  );
  
  if (overviewParagraph) {
    return {
      text: overviewParagraph.trim(),
      source: 'main_biography',
      keywords: extractProfessionalKeywords(overviewParagraph)
    };
  }
  return null;
}

/**
 * Extract current position information
 */
function extractCurrentPosition(paragraphs) {
  const positionInfo = paragraphs.find(p => 
    p.includes('principal scientist') && p.includes('NorthWorks')
  );
  
  if (positionInfo) {
    return {
      title: "Principal Scientist",
      organization: "NorthWorks",
      location: "San Francisco, California", 
      description: positionInfo.trim(),
      type: "current_position"
    };
  }
  return null;
}

/**
 * Extract expertise areas from content
 */
function extractExpertiseAreas(paragraphs) {
  const expertiseKeywords = [
    'decision analysis', 'risk analysis', 'environmental protection',
    'nuclear waste', 'risk assessment', 'risk communication'
  ];
  
  const expertise = [];
  
  paragraphs.forEach(paragraph => {
    expertiseKeywords.forEach(keyword => {
      if (paragraph.toLowerCase().includes(keyword)) {
        expertise.push({
          area: keyword,
          description: extractSentenceContaining(paragraph, keyword),
          context: 'biography'
        });
      }
    });
  });
  
  return removeDuplicateExpertise(expertise);
}

/**
 * Extract major achievements and awards
 */
function extractMajorAchievements(paragraphs) {
  const achievements = [];
  
  paragraphs.forEach(paragraph => {
    // Look for awards and recognitions
    if (paragraph.includes('Medal') || paragraph.includes('Award') || paragraph.includes('president')) {
      const sentences = paragraph.split('.').filter(s => s.trim().length > 20);
      sentences.forEach(sentence => {
        if (sentence.includes('Medal') || sentence.includes('Award') || sentence.includes('president')) {
          achievements.push({
            achievement: sentence.trim(),
            type: getAchievementType(sentence),
            year: extractYear(sentence),
            source: 'biography'
          });
        }
      });
    }
  });
  
  return achievements;
}

/**
 * Extract education information
 */
function extractEducationFromBio(paragraphs) {
  const education = [];
  
  paragraphs.forEach(paragraph => {
    if (paragraph.includes('Ph.D.') || paragraph.includes('B.S.')) {
      const sentences = paragraph.split('.').filter(s => s.trim().length > 10);
      sentences.forEach(sentence => {
        if (sentence.includes('Ph.D.') || sentence.includes('B.S.')) {
          education.push({
            degree: extractDegree(sentence),
            field: extractField(sentence),
            institution: extractInstitution(sentence),
            description: sentence.trim(),
            type: 'formal_education'
          });
        }
      });
    }
  });
  
  return education;
}

/**
 * Extract projects content
 */
function extractProjectsContent(portfolio, paragraphs, fullContent) {
  // Look for project descriptions and client work
  paragraphs.forEach(paragraph => {
    if (paragraph.length > 100 && 
        (paragraph.includes('project') || 
         paragraph.includes('study') || 
         paragraph.includes('analysis') ||
         paragraph.includes('assessment'))) {
      
      portfolio.projects.push({
        description: paragraph.trim(),
        type: 'professional_project',
        domain: extractProjectDomain(paragraph),
        keywords: extractProfessionalKeywords(paragraph),
        source: 'projects_file'
      });
    }
  });
}

/**
 * Extract publications content
 */
function extractPublicationsContent(portfolio, paragraphs, fullContent, fileName) {
  // Look for publication titles and descriptions
  const lines = fullContent.split('\n');
  
  lines.forEach((line, index) => {
    if (line.includes('"') && line.length > 30) {
      // Potential publication title
      const title = line.replace(/[*"]/g, '').trim();
      const nextLine = index < lines.length - 1 ? lines[index + 1] : '';
      
      if (title.length > 10 && !title.includes('![')) {
        portfolio.publications.push({
          title: title,
          context: nextLine.trim(),
          source: fileName,
          type: 'professional_publication',
          year: extractYear(line + ' ' + nextLine),
          keywords: extractProfessionalKeywords(title)
        });
      }
    }
  });
}

/**
 * Extract general professional information from any file
 */
function extractGeneralProfessionalInfo(portfolio, paragraphs, fileName) {
  paragraphs.forEach(paragraph => {
    // Extract positions and affiliations
    if (paragraph.includes('member') || paragraph.includes('chair') || paragraph.includes('board')) {
      const position = extractPositionInfo(paragraph);
      if (position) {
        portfolio.positions.push({
          ...position,
          source: fileName
        });
      }
    }
    
    // Extract organizational affiliations
    if (paragraph.includes('Society') || paragraph.includes('Academy') || paragraph.includes('Board')) {
      const affiliation = extractAffiliationInfo(paragraph);
      if (affiliation) {
        portfolio.affiliations.push({
          ...affiliation,
          source: fileName
        });
      }
    }
  });
}

/**
 * Helper functions for extraction
 */
function extractProfessionalKeywords(text) {
  const keywords = [
    'risk analysis', 'decision analysis', 'environmental', 'nuclear',
    'energy', 'safety', 'policy', 'research', 'consulting', 'government',
    'assessment', 'management', 'science', 'technology', 'waste',
    'regulation', 'protection'
  ];
  
  return keywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).slice(0, 5);
}

function extractSentenceContaining(paragraph, keyword) {
  const sentences = paragraph.split('.').filter(s => s.trim().length > 10);
  const relevantSentence = sentences.find(s => 
    s.toLowerCase().includes(keyword.toLowerCase())
  );
  return relevantSentence ? relevantSentence.trim() : '';
}

function extractYear(text) {
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : null;
}

function getAchievementType(sentence) {
  if (sentence.toLowerCase().includes('medal')) return 'medal';
  if (sentence.toLowerCase().includes('award')) return 'award';
  if (sentence.toLowerCase().includes('president')) return 'leadership_position';
  return 'recognition';
}

function extractDegree(sentence) {
  if (sentence.includes('Ph.D.')) return 'Ph.D.';
  if (sentence.includes('B.S.')) return 'B.S.';
  return 'degree';
}

function extractField(sentence) {
  const fieldPatterns = [
    /Ph\.D\. in ([^,]+)/,
    /B\.S\. in ([^,]+)/,
    /(operations research|physics|engineering|science)/i
  ];
  
  for (const pattern of fieldPatterns) {
    const match = sentence.match(pattern);
    if (match) return match[1] || match[0];
  }
  return 'unspecified';
}

function extractInstitution(sentence) {
  const institutions = ['Stanford University', 'Yale University'];
  const found = institutions.find(inst => sentence.includes(inst));
  return found || 'unspecified';
}

function extractProjectDomain(paragraph) {
  const domains = {
    'environmental': ['environmental', 'EPA', 'pollution'],
    'nuclear': ['nuclear', 'waste', 'radioactive'],
    'energy': ['energy', 'utilities', 'electric'],
    'government': ['government', 'federal', 'agency'],
    'consulting': ['consulting', 'private', 'industry']
  };
  
  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(keyword => paragraph.toLowerCase().includes(keyword))) {
      return domain;
    }
  }
  return 'general';
}

function extractPositionInfo(paragraph) {
  const sentences = paragraph.split('.').filter(s => s.trim().length > 20);
  const positionSentence = sentences.find(s => 
    s.includes('member') || s.includes('chair') || s.includes('board')
  );
  
  if (positionSentence) {
    return {
      description: positionSentence.trim(),
      type: 'professional_position',
      year: extractYear(positionSentence),
      organization: extractOrganizationName(positionSentence)
    };
  }
  return null;
}

function extractAffiliationInfo(paragraph) {
  const sentences = paragraph.split('.').filter(s => s.trim().length > 20);
  const affiliationSentence = sentences.find(s => 
    s.includes('Society') || s.includes('Academy') || s.includes('Board')
  );
  
  if (affiliationSentence) {
    return {
      description: affiliationSentence.trim(),
      type: 'professional_affiliation',
      year: extractYear(affiliationSentence),
      organization: extractOrganizationName(affiliationSentence)
    };
  }
  return null;
}

function extractOrganizationName(sentence) {
  const orgPatterns = [
    /Society for [^,]+/,
    /National [^,]+/,
    /Board[^,]+/,
    /Academy[^,]+/,
    /Commission[^,]+/
  ];
  
  for (const pattern of orgPatterns) {
    const match = sentence.match(pattern);
    if (match) return match[0].trim();
  }
  return 'unspecified';
}

function removeDuplicateExpertise(expertise) {
  const seen = new Set();
  return expertise.filter(item => {
    const key = item.area.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Clean and validate extracted data
 */
function cleanAndValidateData(portfolio) {
  // Remove duplicates and clean up data
  portfolio.projects = portfolio.projects.filter(p => p.description.length > 50);
  portfolio.publications = portfolio.publications.filter(p => p.title.length > 10);
  portfolio.positions = portfolio.positions.filter(p => p.description.length > 20);
  portfolio.affiliations = portfolio.affiliations.filter(a => a.description.length > 20);
  
  console.log('✨ Data cleaned and validated');
}

/**
 * Generate quality analysis
 */
function generateQualityAnalysis(data) {
  console.log('\n📈 QUALITY ANALYSIS');
  console.log('-'.repeat(30));
  
  const portfolio = data.portfolio;
  
  // Biography analysis
  if (portfolio.biography.overview) {
    console.log(`✅ Quality biography extracted`);
    console.log(`   Overview: ${portfolio.biography.overview.text.substring(0, 100)}...`);
  }
  
  // Content quality metrics
  const totalItems = 
    portfolio.projects.length + 
    portfolio.publications.length + 
    portfolio.positions.length + 
    portfolio.affiliations.length;
    
  console.log(`\n📊 Content Quality Metrics:`);
  console.log(`Total meaningful items: ${totalItems}`);
  console.log(`Average description length: ${calculateAverageLength(portfolio)}`);
  console.log(`Items with years: ${countItemsWithYears(portfolio)}`);
  console.log(`Items with organizations: ${countItemsWithOrganizations(portfolio)}`);
  
  // Expertise analysis
  if (portfolio.biography.expertise) {
    console.log(`\n🎯 Expertise Areas Identified:`);
    portfolio.biography.expertise.forEach(exp => {
      console.log(`   • ${exp.area}`);
    });
  }
  
  console.log('\n✅ High-quality Warner portfolio extraction complete!');
  console.log('🎯 Focus on substantive professional content');
  console.log('💼 Ready for professional portfolio components');
}

function calculateAverageLength(portfolio) {
  const allItems = [
    ...portfolio.projects,
    ...portfolio.publications,
    ...portfolio.positions,
    ...portfolio.affiliations
  ];
  
  if (allItems.length === 0) return 0;
  
  const totalLength = allItems.reduce((sum, item) => {
    const text = item.description || item.title || '';
    return sum + text.length;
  }, 0);
  
  return Math.round(totalLength / allItems.length);
}

function countItemsWithYears(portfolio) {
  const allItems = [
    ...portfolio.projects,
    ...portfolio.publications,
    ...portfolio.positions,
    ...portfolio.affiliations
  ];
  
  return allItems.filter(item => item.year).length;
}

function countItemsWithOrganizations(portfolio) {
  const allItems = [
    ...portfolio.projects,
    ...portfolio.publications,
    ...portfolio.positions,
    ...portfolio.affiliations
  ];
  
  return allItems.filter(item => 
    item.organization || 
    (item.description && item.description.match(/\b[A-Z][a-z]+ (?:University|Society|Board|Commission|Agency)\b/))
  ).length;
}

// Run the quality extraction
if (require.main === module) {
  extractWarnerQualityContent();
}

module.exports = { extractWarnerQualityContent };
