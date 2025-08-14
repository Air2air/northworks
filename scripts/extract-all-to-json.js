#!/usr/bin/env node

const { extractInterviewsToJson } = require('./extract-interviews-to-json');
const { extractArticlesToJson } = require('./extract-articles-to-json');
const { extractProfileToJson } = require('./extract-profile-to-json');
const fs = require('fs');
const path = require('path');

/**
 * Master script to extract all content to JSON format
 */
async function extractAllContentToJson() {
  console.log('🚀 Starting comprehensive content extraction to JSON...\n');
  
  const startTime = Date.now();
  const results = {
    interviews: { success: false, error: null, count: 0 },
    articles: { success: false, error: null, count: 0 },
    profile: { success: false, error: null, count: 0 }
  };
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created data directory');
  }
  
  // Extract interviews
  console.log('1️⃣ Extracting interviews...');
  try {
    await extractInterviewsToJson();
    const interviewsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'interviews.json'), 'utf8'));
    results.interviews.success = true;
    results.interviews.count = interviewsData.interviews?.length || 0;
    console.log(`✅ Interviews extraction completed: ${results.interviews.count} entries`);
  } catch (error) {
    results.interviews.error = error.message;
    console.error(`❌ Interviews extraction failed: ${error.message}`);
  }
  
  console.log('\n2️⃣ Extracting articles...');
  try {
    await extractArticlesToJson();
    const articlesData = JSON.parse(fs.readFileSync(path.join(dataDir, 'articles.json'), 'utf8'));
    results.articles.success = true;
    results.articles.count = articlesData.articles?.length || 0;
    console.log(`✅ Articles extraction completed: ${results.articles.count} entries`);
  } catch (error) {
    results.articles.error = error.message;
    console.error(`❌ Articles extraction failed: ${error.message}`);
  }
  
  console.log('\n3️⃣ Extracting profile...');
  try {
    await extractProfileToJson();
    results.profile.success = true;
    results.profile.count = 1;
    console.log(`✅ Profile extraction completed`);
  } catch (error) {
    results.profile.error = error.message;
    console.error(`❌ Profile extraction failed: ${error.message}`);
  }
  
  // Generate comprehensive summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 EXTRACTION SUMMARY');
  console.log('='.repeat(60));
  console.log(`⏱️  Total time: ${duration} seconds`);
  console.log(`📂 Output directory: ${dataDir}`);
  
  const totalSuccess = Object.values(results).filter(r => r.success).length;
  const totalAttempted = Object.keys(results).length;
  const totalEntries = Object.values(results).reduce((sum, r) => sum + r.count, 0);
  
  console.log(`\n📊 Results: ${totalSuccess}/${totalAttempted} successful extractions`);
  console.log(`📝 Total entries extracted: ${totalEntries}`);
  
  console.log('\n📋 Detailed Results:');
  Object.entries(results).forEach(([type, result]) => {
    const status = result.success ? '✅' : '❌';
    const count = result.success ? ` (${result.count} entries)` : '';
    const error = result.error ? ` - ${result.error}` : '';
    console.log(`  ${status} ${type}${count}${error}`);
  });
  
  // Generate schema update recommendations
  console.log('\n🔧 Schema Recommendations:');
  console.log('  • Add "index" collection type for list-based content');
  console.log('  • Include "professional" section for biographical data');
  console.log('  • Add "awards" array for achievements');
  console.log('  • Consider "currentActivities" for ongoing work');
  
  // Generate file usage recommendations
  console.log('\n📁 File Usage Recommendations:');
  console.log('  • Create React components: InterviewGrid, ArticleList, ProfileView');
  console.log('  • Implement search/filter functionality');
  console.log('  • Add dynamic routing for individual items');
  console.log('  • Consider pagination for large collections');
  
  // Create index file for all data
  const indexData = {
    metadata: {
      created: new Date().toISOString(),
      extractionDuration: `${duration}s`,
      totalEntries: totalEntries
    },
    collections: {
      interviews: {
        file: 'interviews.json',
        count: results.interviews.count,
        status: results.interviews.success ? 'success' : 'failed'
      },
      articles: {
        file: 'articles.json',
        count: results.articles.count,
        status: results.articles.success ? 'success' : 'failed'
      },
      profile: {
        file: 'profile.json',
        count: results.profile.count,
        status: results.profile.success ? 'success' : 'failed'
      }
    }
  };
  
  fs.writeFileSync(path.join(dataDir, 'index.json'), JSON.stringify(indexData, null, 2));
  console.log('\n💾 Created data index file: src/data/index.json');
  
  if (totalSuccess === totalAttempted) {
    console.log('\n🎉 All extractions completed successfully!');
    console.log('Next steps:');
    console.log('  1. Update content-schema.json with new patterns');
    console.log('  2. Create React components for dynamic lists');
    console.log('  3. Implement search and filtering');
    console.log('  4. Add individual item pages');
  } else {
    console.log('\n⚠️  Some extractions failed. Please review errors above.');
  }
  
  return results;
}

// Run if called directly
if (require.main === module) {
  extractAllContentToJson();
}

module.exports = { extractAllContentToJson };
