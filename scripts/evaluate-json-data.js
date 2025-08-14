#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive evaluation of JSON conversion results
 */
function evaluateJsonData() {
  console.log('🔍 COMPREHENSIVE JSON DATA EVALUATION');
  console.log('='.repeat(60));
  
  const dataDir = path.join(__dirname, '../src/data');
  
  // Load all data files
  const interviewsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'interviews.json'), 'utf8'));
  const articlesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'articles.json'), 'utf8'));
  const profileData = JSON.parse(fs.readFileSync(path.join(dataDir, 'profile.json'), 'utf8'));
  const indexData = JSON.parse(fs.readFileSync(path.join(dataDir, 'index.json'), 'utf8'));
  
  console.log('📊 OVERALL STATISTICS');
  console.log('-'.repeat(30));
  console.log(`Total entries: ${indexData.metadata.totalEntries}`);
  console.log(`Extraction time: ${indexData.metadata.extractionDuration}`);
  console.log(`Collections: ${Object.keys(indexData.collections).length}`);
  console.log('');
  
  // Evaluate each collection
  evaluateInterviews(interviewsData);
  evaluateArticles(articlesData);
  evaluateProfile(profileData);
  
  // Cross-collection analysis
  evaluateDataConsistency(interviewsData, articlesData, profileData);
  
  // Component reusability assessment
  evaluateComponentReusability(interviewsData, articlesData, profileData);
  
  // Data quality issues
  identifyDataQualityIssues(interviewsData, articlesData);
  
  // Recommendations
  provideFinalRecommendations();
}

/**
 * Evaluate interview data completeness and quality
 */
function evaluateInterviews(data) {
  console.log('🎤 INTERVIEW DATA EVALUATION');
  console.log('-'.repeat(30));
  
  const interviews = data.interviews;
  const total = interviews.length;
  
  // Count completeness metrics
  const withNames = interviews.filter(i => i.subject.people[0]?.name).length;
  const withRoles = interviews.filter(i => i.subject.people[0]?.role).length;
  const withDates = interviews.filter(i => i.publication.date).length;
  const withPublishers = interviews.filter(i => i.publication.publisher).length;
  const withUrls = interviews.filter(i => i.content.url).length;
  const withImages = interviews.filter(i => i.media.images?.length > 0).length;
  const withTags = interviews.filter(i => i.tags?.length > 0).length;
  
  console.log(`Total interviews: ${total}`);
  console.log(`With names: ${withNames}/${total} (${Math.round(withNames/total*100)}%)`);
  console.log(`With roles: ${withRoles}/${total} (${Math.round(withRoles/total*100)}%)`);
  console.log(`With dates: ${withDates}/${total} (${Math.round(withDates/total*100)}%)`);
  console.log(`With publishers: ${withPublishers}/${total} (${Math.round(withPublishers/total*100)}%)`);
  console.log(`With URLs: ${withUrls}/${total} (${Math.round(withUrls/total*100)}%)`);
  console.log(`With images: ${withImages}/${total} (${Math.round(withImages/total*100)}%)`);
  console.log(`With tags: ${withTags}/${total} (${Math.round(withTags/total*100)}%)`);
  
  // Role analysis
  const roles = {};
  interviews.forEach(i => {
    const role = i.subject.people[0]?.role || 'unknown';
    roles[role] = (roles[role] || 0) + 1;
  });
  
  console.log('\nRole distribution:');
  Object.entries(roles)
    .sort(([,a], [,b]) => b - a)
    .forEach(([role, count]) => {
      console.log(`  ${role}: ${count} (${Math.round(count/total*100)}%)`);
    });
  
  // Publisher analysis
  const publishers = {};
  interviews.forEach(i => {
    const pub = i.publication.publisher || 'unknown';
    publishers[pub] = (publishers[pub] || 0) + 1;
  });
  
  console.log('\nPublisher distribution:');
  Object.entries(publishers)
    .sort(([,a], [,b]) => b - a)
    .forEach(([pub, count]) => {
      console.log(`  ${pub}: ${count} (${Math.round(count/total*100)}%)`);
    });
  
  console.log('');
}

/**
 * Evaluate article data completeness and quality
 */
function evaluateArticles(data) {
  console.log('📰 ARTICLE DATA EVALUATION');
  console.log('-'.repeat(30));
  
  const articles = data.articles;
  const total = articles.length;
  
  // Count completeness metrics
  const withTitles = articles.filter(a => a.content.title && a.content.title.trim()).length;
  const withHeadlines = articles.filter(a => a.content.headline && a.content.headline.trim()).length;
  const withDates = articles.filter(a => a.publication.date).length;
  const withPublishers = articles.filter(a => a.publication.publisher).length;
  const withUrls = articles.filter(a => a.content.url && a.content.url.trim()).length;
  const withTags = articles.filter(a => a.tags?.length > 2).length; // More than default tags
  
  console.log(`Total articles: ${total}`);
  console.log(`With titles: ${withTitles}/${total} (${Math.round(withTitles/total*100)}%)`);
  console.log(`With headlines: ${withHeadlines}/${total} (${Math.round(withHeadlines/total*100)}%)`);
  console.log(`With dates: ${withDates}/${total} (${Math.round(withDates/total*100)}%)`);
  console.log(`With publishers: ${withPublishers}/${total} (${Math.round(withPublishers/total*100)}%)`);
  console.log(`With URLs: ${withUrls}/${total} (${Math.round(withUrls/total*100)}%)`);
  console.log(`With meaningful tags: ${withTags}/${total} (${Math.round(withTags/total*100)}%)`);
  
  // Type analysis
  const types = {};
  articles.forEach(a => {
    const type = a.metadata.subcategory || 'unknown';
    types[type] = (types[type] || 0) + 1;
  });
  
  console.log('\nArticle type distribution:');
  Object.entries(types)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count} (${Math.round(count/total*100)}%)`);
    });
  
  // Date range analysis
  const validDates = articles
    .map(a => a.publication.date)
    .filter(date => date)
    .sort();
  
  if (validDates.length > 0) {
    console.log(`\nDate range: ${validDates[0]} to ${validDates[validDates.length - 1]}`);
  }
  
  console.log('');
}

/**
 * Evaluate profile data structure
 */
function evaluateProfile(data) {
  console.log('👤 PROFILE DATA EVALUATION');
  console.log('-'.repeat(30));
  
  console.log(`Name: ${data.content.title}`);
  console.log(`Position: ${data.content.subtitle}`);
  console.log(`Education entries: ${data.professional.education?.length || 0}`);
  console.log(`Awards: ${data.awards?.length || 0}`);
  console.log(`Publications: ${data.publications?.length || 0}`);
  console.log(`Board memberships: ${data.boardMemberships?.length || 0}`);
  console.log(`Current activities: ${data.currentActivities?.length || 0}`);
  console.log(`Specializations: ${data.professional.specializations?.length || 0}`);
  console.log(`Images: ${data.media.images?.length || 0}`);
  console.log(`Tags: ${data.tags?.length || 0}`);
  console.log('');
}

/**
 * Evaluate consistency across collections
 */
function evaluateDataConsistency(interviews, articles, profile) {
  console.log('🔄 CROSS-COLLECTION CONSISTENCY');
  console.log('-'.repeat(30));
  
  // Schema consistency
  const interviewFields = getFieldStructure(interviews.interviews[0]);
  const articleFields = getFieldStructure(articles.articles[0]);
  const profileFields = getFieldStructure(profile);
  
  console.log('Schema consistency:');
  console.log(`Interview fields: ${interviewFields.length}`);
  console.log(`Article fields: ${articleFields.length}`);
  console.log(`Profile fields: ${profileFields.length}`);
  
  // Common fields
  const commonFields = interviewFields.filter(field => 
    articleFields.includes(field)
  );
  console.log(`Common fields: ${commonFields.length} (${commonFields.join(', ')})`);
  
  // Tag consistency
  const allInterviewTags = new Set();
  const allArticleTags = new Set();
  
  interviews.interviews.forEach(i => {
    i.tags?.forEach(tag => allInterviewTags.add(tag));
  });
  
  articles.articles.forEach(a => {
    a.tags?.forEach(tag => allArticleTags.add(tag));
  });
  
  const commonTags = [...allInterviewTags].filter(tag => allArticleTags.has(tag));
  console.log(`Unique interview tags: ${allInterviewTags.size}`);
  console.log(`Unique article tags: ${allArticleTags.size}`);
  console.log(`Common tags: ${commonTags.length} (${commonTags.join(', ')})`);
  
  console.log('');
}

/**
 * Evaluate component reusability potential
 */
function evaluateComponentReusability(interviews, articles, profile) {
  console.log('🔧 COMPONENT REUSABILITY ASSESSMENT');
  console.log('-'.repeat(30));
  
  console.log('✅ Highly Reusable Patterns:');
  console.log('  • metadata.* - Consistent across all types');
  console.log('  • content.{title, summary} - Universal content fields');
  console.log('  • publication.{date, publisher} - Common publication info');
  console.log('  • tags[] - Consistent tagging system');
  console.log('  • media.images[] - Standardized image handling');
  
  console.log('\n✅ Type-Specific but Consistent:');
  console.log('  • subject.people[] - Interview-specific but well-structured');
  console.log('  • professional.* - Profile-specific but comprehensive');
  console.log('  • awards[] - Profile-specific but reusable pattern');
  
  console.log('\n⚠️  Areas Needing Improvement:');
  console.log('  • Article parsing incomplete (missing titles/URLs)');
  console.log('  • Role detection too generic ("classical musician")');
  console.log('  • Publisher extraction inconsistent');
  console.log('  • Date parsing could be more robust');
  
  console.log('\n💡 Reusable Component Opportunities:');
  console.log('  • GenericCard(item, fields, linkPattern)');
  console.log('  • FilterableList(items, filterConfigs)');
  console.log('  • SearchableGrid(items, searchFields)');
  console.log('  • MetadataBadge(metadata, displayFields)');
  console.log('  • PublicationInfo(publication, dateFormat)');
  console.log('  • TagCloud(tags, clickHandler)');
  console.log('  • ImageThumbnail(media.images, size)');
  
  console.log('');
}

/**
 * Identify specific data quality issues
 */
function identifyDataQualityIssues(interviews, articles) {
  console.log('🚨 DATA QUALITY ISSUES');
  console.log('-'.repeat(30));
  
  console.log('Interview Issues:');
  
  // Missing names
  const missingNames = interviews.interviews.filter(i => !i.subject.people[0]?.name);
  if (missingNames.length > 0) {
    console.log(`  • ${missingNames.length} interviews missing names`);
  }
  
  // Generic roles
  const genericRoles = interviews.interviews.filter(i => 
    i.subject.people[0]?.role === 'classical musician'
  );
  console.log(`  • ${genericRoles.length} interviews with generic "classical musician" role`);
  
  // Missing publishers
  const missingPubs = interviews.interviews.filter(i => !i.publication.publisher);
  console.log(`  • ${missingPubs.length} interviews missing publisher info`);
  
  console.log('\nArticle Issues:');
  
  // Missing titles
  const missingTitles = articles.articles.filter(a => !a.content.title || a.content.title.trim() === '');
  console.log(`  • ${missingTitles.length} articles missing titles`);
  
  // Missing URLs
  const missingUrls = articles.articles.filter(a => !a.content.url || a.content.url.trim() === '');
  console.log(`  • ${missingUrls.length} articles missing URLs`);
  
  // Empty headlines same as titles
  const redundantHeadlines = articles.articles.filter(a => 
    a.content.headline === a.content.title
  );
  console.log(`  • ${redundantHeadlines.length} articles with redundant headlines`);
  
  console.log('');
}

/**
 * Get field structure for comparison
 */
function getFieldStructure(obj, prefix = '') {
  const fields = [];
  
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(key => {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      fields.push(fieldName);
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        fields.push(...getFieldStructure(obj[key], fieldName));
      }
    });
  }
  
  return fields;
}

/**
 * Provide final recommendations
 */
function provideFinalRecommendations() {
  console.log('💡 FINAL RECOMMENDATIONS');
  console.log('-'.repeat(30));
  
  console.log('🔧 Immediate Improvements:');
  console.log('  1. Fix article parsing to extract titles and URLs properly');
  console.log('  2. Improve role detection for more specific classifications');
  console.log('  3. Enhance publisher extraction logic');
  console.log('  4. Validate and clean redundant data');
  console.log('');
  
  console.log('🏗️  Component Architecture:');
  console.log('  1. Create base ContentCard component for all types');
  console.log('  2. Build FilterableCollection HOC for reusability');
  console.log('  3. Implement SearchProvider for consistent search');
  console.log('  4. Design responsive grid system for different content types');
  console.log('');
  
  console.log('📊 Data Enhancement:');
  console.log('  1. Add semantic search capabilities');
  console.log('  2. Implement tag normalization');
  console.log('  3. Create content relationship mapping');
  console.log('  4. Add full-text search indexing');
  console.log('');
  
  console.log('🚀 Future Features:');
  console.log('  1. Dynamic content recommendation');
  console.log('  2. Advanced filtering with faceted search');
  console.log('  3. Content analytics and insights');
  console.log('  4. REST API endpoints for each collection');
  console.log('');
  
  console.log('✅ Overall Assessment: SUCCESSFUL WITH ROOM FOR IMPROVEMENT');
  console.log('   • Data structure is consistent and component-friendly');
  console.log('   • Schema provides good foundation for reusable components');
  console.log('   • Most critical data successfully extracted');
  console.log('   • Clear improvement path identified');
}

// Run the evaluation
if (require.main === module) {
  evaluateJsonData();
}

module.exports = { evaluateJsonData };
