#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Enhanced Warner content extraction focusing on list structures
 * Specialized for professional/technical content with extensive lists
 */
async function extractWarnerListsEnhanced() {
  console.log('📋 ENHANCED WARNER LISTS EXTRACTION');
  console.log('='.repeat(50));
  
  try {
    // Find all w_* files
    const contentDir = path.join(__dirname, '../public/content');
    const warnerFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('w_'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${warnerFiles.length} Warner files for enhanced list extraction`);
    
    const enhancedData = {
      metadata: {
        id: "warner_lists_enhanced",
        type: "professional_lists_collection",
        category: "professional",
        subcategory: "structured-content",
        status: "published",
        extractionVersion: "enhanced"
      },
      content: {
        title: "D. Warner North - Enhanced Professional Lists",
        summary: "Comprehensive extraction of structured lists, projects, publications, and professional activities with enhanced parsing",
        body: "Detailed breakdown of professional accomplishments, expertise areas, and structured content from Warner North's professional portfolio."
      },
      lists: {
        projects: [],
        publications: [],
        organizations: [],
        expertise: [],
        awards: [],
        positions: [],
        education: [],
        miscellaneous: []
      },
      statistics: {},
      legacy: {
        sourceFiles: warnerFiles.map(f => path.basename(f)),
        extractionDate: new Date().toISOString()
      }
    };
    
    let totalListItems = 0;
    
    // Process each file with enhanced list extraction
    for (const filePath of warnerFiles) {
      const fileName = path.basename(filePath);
      console.log(`📝 Processing: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        const extractedLists = extractEnhancedLists(content, fileName);
        totalListItems += extractedLists.totalItems;
        
        // Categorize and add lists
        categorizeAndAddLists(enhancedData.lists, extractedLists, fileName);
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Generate statistics
    enhancedData.statistics = generateListStatistics(enhancedData.lists);
    
    console.log('\n📊 Enhanced Extraction Results:');
    console.log(`Total list items: ${totalListItems}`);
    console.log(`Projects: ${enhancedData.lists.projects.length}`);
    console.log(`Publications: ${enhancedData.lists.publications.length}`);
    console.log(`Organizations: ${enhancedData.lists.organizations.length}`);
    console.log(`Expertise areas: ${enhancedData.lists.expertise.length}`);
    console.log(`Awards/Recognition: ${enhancedData.lists.awards.length}`);
    console.log(`Positions: ${enhancedData.lists.positions.length}`);
    
    // Save enhanced data
    const outputPath = path.join(__dirname, '../src/data/warner-lists-enhanced.json');
    fs.writeFileSync(outputPath, JSON.stringify(enhancedData, null, 2));
    console.log(`\n💾 Saved enhanced lists to: ${outputPath}`);
    
    // Generate comprehensive analysis
    generateEnhancedAnalysis(enhancedData);
    
  } catch (error) {
    console.error('❌ Error in enhanced extraction:', error);
    process.exit(1);
  }
}

/**
 * Extract enhanced lists with better categorization
 */
function extractEnhancedLists(content, fileName) {
  const lists = {
    bulleted: [],
    numbered: [],
    structured: [],
    inline: [],
    totalItems: 0
  };
  
  const lines = content.split('\n');
  let currentList = null;
  let listContext = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const prevLine = i > 0 ? lines[i-1].trim() : '';
    const nextLine = i < lines.length - 1 ? lines[i+1].trim() : '';
    
    // Detect list start markers
    if (line.match(/^[-*+•]\s+/) || line.match(/^\d+\.\s+/) || line.match(/^[a-zA-Z]\.\s+/)) {
      
      // Start new list if not in one
      if (!currentList) {
        listContext = getListContext(lines, i);
        currentList = {
          type: getListType(line),
          context: listContext,
          items: [],
          sourceFile: fileName,
          startLine: i + 1,
          category: categorizeListContext(listContext, fileName)
        };
      }
      
      // Extract and clean list item
      const item = extractListItem(line);
      if (item) {
        const enhancedItem = enhanceListItem(item, prevLine, nextLine, fileName);
        currentList.items.push(enhancedItem);
        lists.totalItems++;
      }
      
    } else if (line === '' && currentList) {
      // End current list
      if (currentList.items.length > 0) {
        lists[getListCategory(currentList.type)].push(currentList);
      }
      currentList = null;
      
    } else if (currentList && line) {
      // Continue current list item or add sub-items
      if (line.match(/^\s+[-*+•]\s+/) || line.match(/^\s+\d+\.\s+/)) {
        // Sub-item
        const subItem = extractListItem(line.trim());
        if (subItem && currentList.items.length > 0) {
          if (!currentList.items[currentList.items.length - 1].subItems) {
            currentList.items[currentList.items.length - 1].subItems = [];
          }
          currentList.items[currentList.items.length - 1].subItems.push(subItem);
          lists.totalItems++;
        }
      } else if (currentList.items.length > 0) {
        // Continue current item
        currentList.items[currentList.items.length - 1].text += ' ' + line;
      }
    }
  }
  
  // Add final list if exists
  if (currentList && currentList.items.length > 0) {
    lists[getListCategory(currentList.type)].push(currentList);
  }
  
  return lists;
}

/**
 * Get list context from surrounding lines
 */
function getListContext(lines, startIndex) {
  const contextLines = [];
  
  // Look backwards for headers or context
  for (let i = Math.max(0, startIndex - 5); i < startIndex; i++) {
    const line = lines[i].trim();
    if (line && (line.startsWith('#') || line.includes('**') || line.includes(':') || line.length > 10)) {
      contextLines.push(line);
    }
  }
  
  return contextLines.join(' ').replace(/[#*]/g, '').trim();
}

/**
 * Determine list type
 */
function getListType(line) {
  if (line.match(/^\d+\.\s+/)) return 'numbered';
  if (line.match(/^[a-zA-Z]\.\s+/)) return 'lettered';
  if (line.match(/^[-*+•]\s+/)) return 'bulleted';
  return 'other';
}

/**
 * Get list category for storage
 */
function getListCategory(type) {
  if (type === 'numbered' || type === 'lettered') return 'numbered';
  return 'bulleted';
}

/**
 * Extract clean list item text
 */
function extractListItem(line) {
  const cleaned = line.replace(/^[-*+•\d+\w+\.]\s*/, '').trim();
  return cleaned || null;
}

/**
 * Enhance list item with metadata
 */
function enhanceListItem(text, prevLine, nextLine, fileName) {
  const item = {
    text: text,
    length: text.length,
    hasDate: /\b(19|20)\d{2}\b/.test(text),
    hasOrganization: containsOrganization(text),
    hasNumber: /\d+/.test(text),
    hasUrl: /https?:\/\//.test(text) || /\.pdf|\.html?|\.doc/.test(text),
    category: categorizeItemContent(text, fileName),
    keywords: extractKeywords(text)
  };
  
  // Add year if found
  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    item.year = yearMatch[0];
  }
  
  return item;
}

/**
 * Check if text contains organization names
 */
function containsOrganization(text) {
  const orgPatterns = [
    /Stanford|EPA|NRC|DOE|NSF|EPRI|University|Commission|Agency|Board|Society|Institute|Council|Corporation|Company/i
  ];
  
  return orgPatterns.some(pattern => pattern.test(text));
}

/**
 * Categorize item content
 */
function categorizeItemContent(text, fileName) {
  const lower = text.toLowerCase();
  
  if (lower.includes('ph.d.') || lower.includes('b.s.') || lower.includes('university') || lower.includes('degree')) {
    return 'education';
  }
  if (lower.includes('award') || lower.includes('medal') || lower.includes('recognition') || lower.includes('prize')) {
    return 'award';
  }
  if (lower.includes('president') || lower.includes('chair') || lower.includes('member') || lower.includes('director')) {
    return 'position';
  }
  if (lower.includes('report') || lower.includes('paper') || lower.includes('publication') || lower.includes('journal')) {
    return 'publication';
  }
  if (lower.includes('project') || lower.includes('study') || lower.includes('analysis') || lower.includes('assessment')) {
    return 'project';
  }
  if (lower.includes('risk') || lower.includes('decision') || lower.includes('environmental') || lower.includes('nuclear')) {
    return 'expertise';
  }
  
  return 'general';
}

/**
 * Categorize list based on context
 */
function categorizeListContext(context, fileName) {
  const lower = context.toLowerCase();
  
  if (fileName.includes('pub') || lower.includes('publication')) return 'publications';
  if (fileName.includes('project') || lower.includes('project')) return 'projects';
  if (lower.includes('education') || lower.includes('degree')) return 'education';
  if (lower.includes('award') || lower.includes('recognition')) return 'awards';
  if (lower.includes('board') || lower.includes('member') || lower.includes('position')) return 'positions';
  if (lower.includes('expertise') || lower.includes('experience')) return 'expertise';
  
  return 'general';
}

/**
 * Extract keywords from text
 */
function extractKeywords(text) {
  const keywords = [];
  const importantWords = [
    'risk', 'analysis', 'decision', 'environmental', 'nuclear', 'energy', 'policy',
    'assessment', 'management', 'research', 'study', 'project', 'consulting',
    'government', 'safety', 'waste', 'regulation', 'science', 'technology'
  ];
  
  importantWords.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      keywords.push(word);
    }
  });
  
  return keywords.slice(0, 5);
}

/**
 * Categorize and add lists to appropriate categories
 */
function categorizeAndAddLists(listsCollection, extractedLists, fileName) {
  // Process all list types
  [...extractedLists.bulleted, ...extractedLists.numbered, ...extractedLists.structured].forEach(list => {
    list.items.forEach(item => {
      const listItem = {
        text: item.text,
        context: list.context,
        sourceFile: fileName,
        category: item.category,
        metadata: {
          hasDate: item.hasDate,
          hasOrganization: item.hasOrganization,
          hasUrl: item.hasUrl,
          year: item.year,
          keywords: item.keywords,
          length: item.length
        },
        subItems: item.subItems || []
      };
      
      // Add to appropriate category
      switch (item.category) {
        case 'project':
          listsCollection.projects.push(listItem);
          break;
        case 'publication':
          listsCollection.publications.push(listItem);
          break;
        case 'award':
          listsCollection.awards.push(listItem);
          break;
        case 'position':
          listsCollection.positions.push(listItem);
          break;
        case 'education':
          listsCollection.education.push(listItem);
          break;
        case 'expertise':
          listsCollection.expertise.push(listItem);
          break;
        default:
          listsCollection.miscellaneous.push(listItem);
      }
      
      // Also check for organizations
      if (item.hasOrganization) {
        listsCollection.organizations.push({
          ...listItem,
          category: 'organization'
        });
      }
    });
  });
}

/**
 * Generate statistics
 */
function generateListStatistics(lists) {
  const stats = {};
  
  Object.entries(lists).forEach(([category, items]) => {
    stats[category] = {
      count: items.length,
      withDates: items.filter(item => item.metadata?.hasDate).length,
      withUrls: items.filter(item => item.metadata?.hasUrl).length,
      avgLength: items.length > 0 ? 
        Math.round(items.reduce((sum, item) => sum + (item.metadata?.length || 0), 0) / items.length) : 0,
      topKeywords: getTopKeywords(items)
    };
  });
  
  return stats;
}

/**
 * Get top keywords from items
 */
function getTopKeywords(items) {
  const keywordCounts = {};
  
  items.forEach(item => {
    if (item.metadata?.keywords) {
      item.metadata.keywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    }
  });
  
  return Object.entries(keywordCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([keyword, count]) => ({ keyword, count }));
}

/**
 * Generate enhanced analysis
 */
function generateEnhancedAnalysis(data) {
  console.log('\n📈 ENHANCED ANALYSIS');
  console.log('-'.repeat(30));
  
  const totalItems = Object.values(data.lists).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`Total structured items: ${totalItems}`);
  
  // Category breakdown
  console.log('\nCategory Breakdown:');
  Object.entries(data.lists).forEach(([category, items]) => {
    if (items.length > 0) {
      console.log(`  ${category}: ${items.length} items`);
      
      // Show sample items
      if (items.length > 0) {
        console.log(`    Sample: "${items[0].text.substring(0, 60)}..."`);
      }
    }
  });
  
  // Years analysis
  const allItems = Object.values(data.lists).flat();
  const itemsWithYears = allItems.filter(item => item.metadata?.year);
  const years = itemsWithYears.map(item => item.metadata.year);
  const uniqueYears = [...new Set(years)].sort();
  
  if (uniqueYears.length > 0) {
    console.log(`\nTemporal Range: ${uniqueYears[0]} - ${uniqueYears[uniqueYears.length - 1]}`);
    console.log(`Items with dates: ${itemsWithYears.length} (${Math.round(itemsWithYears.length/totalItems*100)}%)`);
  }
  
  // Keywords analysis
  console.log('\nTop Keywords Across All Content:');
  const allKeywords = allItems.reduce((acc, item) => {
    if (item.metadata?.keywords) {
      item.metadata.keywords.forEach(keyword => {
        acc[keyword] = (acc[keyword] || 0) + 1;
      });
    }
    return acc;
  }, {});
  
  Object.entries(allKeywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .forEach(([keyword, count]) => {
      console.log(`  ${keyword}: ${count} mentions`);
    });
  
  console.log('\n✅ Enhanced Warner lists extraction complete!');
  console.log('📋 Comprehensive list-focused analysis ready for structured components');
  console.log('🎯 Compatible with ContentCard/FilterableCollection architecture');
}

// Run the enhanced extraction
if (require.main === module) {
  extractWarnerListsEnhanced();
}

module.exports = { extractWarnerListsEnhanced };
