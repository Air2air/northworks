#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Analyzes list structures in content files and proposes standardization
 * Identifies different types of content organization patterns
 */

const contentDir = path.join(__dirname, '../public/content');

function analyzeContentStructures() {
  console.log('📋 Content Structure Analysis\n');
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  const analysis = {
    index_pages: [],      // Pages that list other content
    data_heavy: [],       // Pages with lots of structured data
    narrative: [],        // Regular article content
    mixed: [],           // Combination of structure and narrative
    errors: []           // Files with parsing issues
  };
  
  files.forEach(filePath => {
    try {
      const fileName = path.basename(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContent);
      
      // Count various structural elements
      const imageCount = frontmatter.images ? frontmatter.images.length : 0;
      const subjectCount = frontmatter.subjects ? frontmatter.subjects.length : 0;
      const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
      const listItemCount = (content.match(/^[\*\-\+]\s+/gm) || []).length;
      const contentLength = content.length;
      
      // Classify the content type
      let category = 'narrative';
      let notes = [];
      
      // Index pages - lots of links relative to content
      if (linkCount > 10 && contentLength < 5000) {
        category = 'index_pages';
        notes.push(`${linkCount} links`);
      }
      
      // Data-heavy pages
      if (imageCount > 20) {
        category = 'data_heavy';
        notes.push(`${imageCount} images`);
      }
      
      // Mixed content
      if (linkCount > 5 && contentLength > 2000) {
        category = 'mixed';
        notes.push(`${linkCount} links, ${Math.round(contentLength/1000)}k chars`);
      }
      
      // Special cases
      if (fileName.includes('main') || fileName.includes('index') || 
          fileName.includes('articles') || fileName.includes('interviews')) {
        category = 'index_pages';
      }
      
      analysis[category].push({
        file: fileName,
        images: imageCount,
        subjects: subjectCount,
        links: linkCount,
        listItems: listItemCount,
        contentLength: contentLength,
        notes: notes.join(', '),
        type: frontmatter.type || 'unknown'
      });
      
    } catch (error) {
      analysis.errors.push({
        file: path.basename(filePath),
        error: error.message
      });
    }
  });
  
  return analysis;
}

function generateRecommendations(analysis) {
  console.log('🎯 Standardization Recommendations\n');
  
  // Index pages recommendation
  console.log('📑 INDEX PAGES (should be JSON-driven):');
  analysis.index_pages.forEach(item => {
    console.log(`   ${item.file} - ${item.links} links, ${item.notes}`);
  });
  
  console.log('\n📊 DATA-HEAVY PAGES (consider JSON structure):');
  analysis.data_heavy.forEach(item => {
    console.log(`   ${item.file} - ${item.images} images, ${item.notes}`);
  });
  
  console.log('\n📝 MIXED CONTENT (may need restructuring):');
  analysis.mixed.forEach(item => {
    console.log(`   ${item.file} - ${item.notes}`);
  });
  
  console.log('\n⚠️  PARSING ERRORS (need YAML fixes):');
  analysis.errors.forEach(item => {
    console.log(`   ${item.file} - ${item.error.substring(0, 80)}...`);
  });
  
  // Generate specific recommendations
  console.log('\n💡 SPECIFIC RECOMMENDATIONS:\n');
  
  console.log('1. 🗂️  CONVERT TO JSON DATA:');
  console.log('   • c_interviews.md → interviews.json');
  console.log('   • c_articles.md → articles.json');
  console.log('   • c_reviews.md → reviews.json (if exists)');
  console.log('   • w_main.md → profile.json + narrative content');
  
  console.log('\n2. 📋 STANDARDIZE FRONTMATTER:');
  console.log('   • Consistent image metadata structure');
  console.log('   • Standardized publication info');
  console.log('   • Normalized subjects (already done!)');
  console.log('   • Add content_type field for filtering');
  
  console.log('\n3. 🔄 BENEFITS OF JSON CONVERSION:');
  console.log('   • Dynamic filtering and sorting');
  console.log('   • Better search functionality');
  console.log('   • Consistent UI components');
  console.log('   • Easier maintenance and updates');
  console.log('   • API-ready for future features');
  
  console.log('\n4. 🏗️  IMPLEMENTATION APPROACH:');
  console.log('   • Extract list data to JSON files');
  console.log('   • Create React components for dynamic lists');
  console.log('   • Keep narrative content in markdown');
  console.log('   • Use JSON for metadata and navigation');
  
  return {
    convert_to_json: analysis.index_pages.map(p => p.file),
    needs_yaml_fixes: analysis.errors.map(e => e.file),
    restructure_candidates: analysis.mixed.map(m => m.file)
  };
}

function proposeJsonStructures() {
  console.log('\n📄 PROPOSED JSON STRUCTURES:\n');
  
  console.log('interviews.json:');
  console.log(`{
  "interviews": [
    {
      "id": "c_racette", 
      "name": "Patricia Racette",
      "role": "Soprano",
      "date": "2009-09-16",
      "publication": "Bay Area News Group",
      "thumbnail": "/images/thm-racette.jpg",
      "subjects": ["Opera", "San Francisco Opera", "Puccini"],
      "description": "Interview about singing all three roles in Il Trittico"
    }
  ]
}`);
  
  console.log('\narticles.json:');
  console.log(`{
  "articles": [
    {
      "id": "c_art_heggie",
      "title": "Composer Heggie keeps seeking higher ground", 
      "date": "2006-10-27",
      "publication": "ANG Newspapers",
      "subjects": ["Composer", "Opera", "World Premiere"],
      "type": "feature"
    }
  ]
}`);
  
  console.log('\nprofile.json (for w_main.md):');
  console.log(`{
  "profile": {
    "name": "D. Warner North",
    "title": "Principal Scientist, NorthWorks",
    "education": {
      "phd": "Operations Research, Stanford University",
      "bs": "Physics, Yale University"
    },
    "positions": [
      {
        "organization": "US EPA Science Advisory Board",
        "role": "Member and Consultant", 
        "years": "1978-present"
      }
    ],
    "awards": [
      "Frank P. Ramsey Medal (1997)",
      "Outstanding Risk Practitioner Award (1999)"
    ]
  }
}`);
}

function main() {
  const analysis = analyzeContentStructures();
  const recommendations = generateRecommendations(analysis);
  proposeJsonStructures();
  
  console.log('\n✅ NEXT STEPS:');
  console.log('   1. Fix YAML parsing errors first');
  console.log('   2. Extract index page data to JSON');
  console.log('   3. Create dynamic list components'); 
  console.log('   4. Update routing to use JSON data');
  console.log('   5. Maintain markdown for article content');
}

if (require.main === module) {
  main();
}

module.exports = { analyzeContentStructures, generateRecommendations };
