#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Extract Warner North professional content to structured JSON
 * Similar approach to classical music content but for professional/technical content
 */
async function extractWarnerContent() {
  console.log('🔍 EXTRACTING WARNER NORTH PROFESSIONAL CONTENT');
  console.log('='.repeat(50));
  
  try {
    // Find all w_* files
    const contentDir = path.join(__dirname, '../public/content');
    const warnerFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('w_'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Found ${warnerFiles.length} Warner files to process`);
    
    const extractedContent = {
      metadata: {
        id: "warner_north_collection",
        type: "professional_portfolio",
        category: "professional",
        subcategory: "academic-consulting",
        status: "published",
        featured: true
      },
      content: {
        title: "D. Warner North - Professional Portfolio",
        summary: "Comprehensive collection of professional work, projects, publications, and expertise in decision analysis, risk assessment, and environmental policy",
        body: "Over fifty years of applications in decision analysis and risk analysis for electric utilities, petroleum and chemical industries, and government agencies."
      },
      publication: {
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      collections: {
        projects: [],
        publications: [],
        affiliations: [],
        expertise: [],
        documents: []
      },
      legacy: {
        totalFiles: warnerFiles.length,
        extractionDate: new Date().toISOString(),
        sourceFiles: warnerFiles.map(f => path.basename(f))
      }
    };
    
    // Process each file
    for (const filePath of warnerFiles) {
      const fileName = path.basename(filePath);
      console.log(`Processing: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const processedItem = processWarnerFile(fileName, frontMatter, content);
        
        // Categorize content
        if (fileName.includes('projects') || fileName.includes('government') || fileName.includes('stanford') || fileName.includes('nrc')) {
          extractedContent.collections.projects.push(processedItem);
        } else if (fileName.includes('pub')) {
          extractedContent.collections.publications.push(processedItem);
        } else if (fileName.includes('main') || fileName.includes('background')) {
          extractedContent.collections.affiliations.push(processedItem);
        } else if (fileName.includes('laser') || fileName.includes('risk')) {
          extractedContent.collections.expertise.push(processedItem);
        } else {
          extractedContent.collections.documents.push(processedItem);
        }
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate statistics
    const stats = {
      totalItems: Object.values(extractedContent.collections).reduce((sum, arr) => sum + arr.length, 0),
      projects: extractedContent.collections.projects.length,
      publications: extractedContent.collections.publications.length,
      affiliations: extractedContent.collections.affiliations.length,
      expertise: extractedContent.collections.expertise.length,
      documents: extractedContent.collections.documents.length
    };
    
    console.log('\n📊 Extraction Results:');
    console.log(`Total items extracted: ${stats.totalItems}`);
    console.log(`Projects: ${stats.projects}`);
    console.log(`Publications: ${stats.publications}`);
    console.log(`Affiliations: ${stats.affiliations}`);
    console.log(`Expertise areas: ${stats.expertise}`);
    console.log(`Other documents: ${stats.documents}`);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../src/data/warner-portfolio.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedContent, null, 2));
    console.log(`\n💾 Saved Warner portfolio to: ${outputPath}`);
    
    // Generate detailed analysis
    generateWarnerAnalysis(extractedContent, stats);
    
  } catch (error) {
    console.error('❌ Error extracting Warner content:', error);
    process.exit(1);
  }
}

/**
 * Process individual Warner file
 */
function processWarnerFile(fileName, frontMatter, content) {
  const id = fileName.replace(/\.(md|htm)$/, '');
  
  // Extract lists and structured content
  const lists = extractLists(content);
  const organizations = extractOrganizations(content);
  const projects = extractProjects(content);
  const publications = extractPublications(content);
  const expertise = extractExpertiseAreas(content);
  
  return {
    metadata: {
      id: id,
      type: determineContentType(fileName, content),
      category: "professional",
      subcategory: determineSubcategory(fileName),
      status: "published",
      sourceFile: fileName
    },
    content: {
      title: frontMatter.title || generateTitle(fileName),
      summary: generateSummary(content, fileName),
      body: content.substring(0, 500) + '...'
    },
    professional: {
      organizations: organizations,
      projects: projects,
      publications: publications,
      expertise: expertise
    },
    publication: {
      date: frontMatter.publication?.date || null,
      publisher: frontMatter.publication?.publisher || null,
      source: fileName
    },
    media: {
      images: frontMatter.images || []
    },
    data: {
      lists: lists,
      itemCount: lists.reduce((sum, list) => sum + list.items.length, 0)
    },
    tags: generateTags(fileName, content, organizations, expertise),
    legacy: {
      originalFile: fileName,
      conversionDate: frontMatter.conversion_date || new Date().toISOString().split('T')[0],
      convertedFromHtml: frontMatter.converted_from_html || false
    }
  };
}

/**
 * Extract lists from content
 */
function extractLists(content) {
  const lists = [];
  const lines = content.split('\n');
  let currentList = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect list items
    if (line.match(/^[-*+]\s+/) || line.match(/^\d+\.\s+/)) {
      if (!currentList) {
        currentList = {
          type: line.match(/^\d+\.\s+/) ? 'ordered' : 'unordered',
          items: [],
          context: lines[Math.max(0, i-2)] || ''
        };
      }
      
      const item = line.replace(/^[-*+\d\.]\s*/, '').trim();
      if (item) {
        currentList.items.push({
          text: item,
          line: i + 1
        });
      }
    } else if (currentList && line === '') {
      // End of list
      if (currentList.items.length > 0) {
        lists.push(currentList);
      }
      currentList = null;
    } else if (currentList && line) {
      // Continue current item
      if (currentList.items.length > 0) {
        currentList.items[currentList.items.length - 1].text += ' ' + line;
      }
    }
  }
  
  // Add final list if exists
  if (currentList && currentList.items.length > 0) {
    lists.push(currentList);
  }
  
  return lists;
}

/**
 * Extract organizations mentioned
 */
function extractOrganizations(content) {
  const orgPatterns = [
    /Stanford University/gi,
    /Environmental Protection Agency/gi,
    /EPA/gi,
    /Nuclear Waste Technical Review Board/gi,
    /National Research Council/gi,
    /National Academy of Sciences/gi,
    /Society for Risk Analysis/gi,
    /Decision Analysis Society/gi,
    /NorthWorks/gi,
    /Department of Energy/gi,
    /Nuclear Regulatory Commission/gi,
    /NRC/gi
  ];
  
  const organizations = new Set();
  
  orgPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => organizations.add(match));
    }
  });
  
  return Array.from(organizations);
}

/**
 * Extract project information
 */
function extractProjects(content) {
  const projects = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for project indicators
    if (line.includes('project') || line.includes('Project') || 
        line.includes('study') || line.includes('analysis') ||
        line.includes('assessment') || line.includes('consulting')) {
      
      projects.push({
        description: line,
        context: lines.slice(Math.max(0, i-1), i+2).join(' ').trim(),
        line: i + 1
      });
    }
  }
  
  return projects.slice(0, 20); // Limit to prevent overflow
}

/**
 * Extract publications
 */
function extractPublications(content) {
  const publications = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for publication indicators
    if (line.match(/\b(19|20)\d{2}\b/) && 
        (line.includes('"') || line.includes('*') || line.includes('report') || line.includes('paper'))) {
      
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      
      publications.push({
        title: line.replace(/[*"]/g, '').trim(),
        year: yearMatch ? yearMatch[0] : null,
        context: line,
        line: i + 1
      });
    }
  }
  
  return publications.slice(0, 30); // Limit to prevent overflow
}

/**
 * Extract expertise areas
 */
function extractExpertiseAreas(content) {
  const expertisePatterns = [
    'decision analysis',
    'risk analysis',
    'risk assessment',
    'environmental protection',
    'nuclear waste',
    'radioactive waste',
    'energy policy',
    'environmental policy',
    'operations research',
    'management science',
    'uncertainty analysis',
    'probabilistic assessment'
  ];
  
  const expertise = new Set();
  
  expertisePatterns.forEach(pattern => {
    if (content.toLowerCase().includes(pattern)) {
      expertise.add(pattern);
    }
  });
  
  return Array.from(expertise);
}

/**
 * Determine content type based on filename and content
 */
function determineContentType(fileName, content) {
  if (fileName.includes('main') || fileName.includes('background')) return 'profile';
  if (fileName.includes('projects')) return 'project_collection';
  if (fileName.includes('pub')) return 'publication_list';
  if (fileName.includes('laser')) return 'expertise_area';
  if (fileName.includes('epasab')) return 'government_service';
  return 'professional_document';
}

/**
 * Determine subcategory
 */
function determineSubcategory(fileName) {
  if (fileName.includes('government')) return 'government-service';
  if (fileName.includes('stanford')) return 'academic-affiliation';
  if (fileName.includes('nrc')) return 'regulatory-work';
  if (fileName.includes('laser')) return 'technical-expertise';
  if (fileName.includes('pub')) return 'publications';
  if (fileName.includes('projects')) return 'consulting-projects';
  return 'professional-content';
}

/**
 * Generate title from filename
 */
function generateTitle(fileName) {
  const name = fileName.replace(/^w_/, '').replace(/\.(md|htm)$/, '');
  return name.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Generate summary
 */
function generateSummary(content, fileName) {
  const firstParagraph = content.split('\n\n')[0];
  let summary = firstParagraph.replace(/[#*_]/g, '').trim();
  
  if (summary.length > 200) {
    summary = summary.substring(0, 200) + '...';
  }
  
  return summary || `Professional content from ${fileName}`;
}

/**
 * Generate tags
 */
function generateTags(fileName, content, organizations, expertise) {
  const tags = new Set(['Professional', 'Academic', 'Consulting']);
  
  // Add filename-based tags
  if (fileName.includes('projects')) tags.add('Projects');
  if (fileName.includes('pub')) tags.add('Publications');
  if (fileName.includes('government')) tags.add('Government Service');
  if (fileName.includes('stanford')) tags.add('Stanford University');
  if (fileName.includes('laser')) tags.add('Technical Expertise');
  if (fileName.includes('risk')) tags.add('Risk Analysis');
  
  // Add organization tags
  organizations.slice(0, 5).forEach(org => {
    if (org.length < 30) tags.add(org);
  });
  
  // Add expertise tags
  expertise.slice(0, 5).forEach(exp => {
    const tag = exp.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    tags.add(tag);
  });
  
  return Array.from(tags).slice(0, 10);
}

/**
 * Generate detailed analysis
 */
function generateWarnerAnalysis(data, stats) {
  console.log('\n📋 DETAILED ANALYSIS');
  console.log('-'.repeat(25));
  
  // Count total list items
  const totalListItems = data.collections.projects
    .concat(data.collections.publications)
    .concat(data.collections.expertise)
    .concat(data.collections.documents)
    .reduce((sum, item) => sum + (item.data?.itemCount || 0), 0);
  
  console.log(`Total list items extracted: ${totalListItems}`);
  
  // Top organizations
  const allOrgs = data.collections.projects
    .concat(data.collections.publications)
    .concat(data.collections.affiliations)
    .reduce((orgs, item) => orgs.concat(item.professional?.organizations || []), []);
  
  const orgCounts = {};
  allOrgs.forEach(org => {
    orgCounts[org] = (orgCounts[org] || 0) + 1;
  });
  
  console.log('\nTop Organizations:');
  Object.entries(orgCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([org, count]) => {
      console.log(`  ${org}: ${count} mentions`);
    });
  
  // Expertise areas
  const allExpertise = data.collections.expertise
    .concat(data.collections.projects)
    .reduce((exp, item) => exp.concat(item.professional?.expertise || []), []);
  
  console.log('\nExpertise Areas Identified:');
  [...new Set(allExpertise)].slice(0, 8).forEach(exp => {
    console.log(`  • ${exp}`);
  });
  
  console.log('\n✅ Warner North content extraction complete!');
  console.log('📊 This creates a comprehensive professional portfolio JSON');
  console.log('🔧 Ready for use with reusable ContentCard and FilterableCollection components');
}

// Run the extraction
if (require.main === module) {
  extractWarnerContent();
}

module.exports = { extractWarnerContent };
