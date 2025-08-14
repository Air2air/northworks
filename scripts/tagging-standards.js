#!/usr/bin/env node

/**
 * Content Tagging Standards and Recommendations
 * Based on analysis of the current content and industry best practices
 */

function getTaggingStandards() {
  return {
    // Industry standards for content tagging
    industry_standards: {
      blog_posts: "3-8 tags",
      academic_articles: "5-10 keywords", 
      news_articles: "3-6 tags",
      social_media: "3-11 hashtags",
      ecommerce: "5-15 tags",
      library_science: "3-8 subject headings"
    },
    
    // Analysis of current content
    current_analysis: {
      total_files: 121,
      median: 8,
      optimal_range: "5-10 tags",
      common_count: "10 tags (31% of files)",
      problem: "Some files have 20-38 tags (too many)"
    },
    
    // Recommendations by content type
    recommendations: {
      interviews: {
        target: "8-12 tags",
        rationale: "Rich content with multiple topics, people, pieces discussed"
      },
      reviews: {
        target: "5-8 tags", 
        rationale: "Focused on specific performance, venue, performers"
      },
      articles: {
        target: "6-10 tags",
        rationale: "General articles covering various musical topics"
      },
      biographical: {
        target: "7-12 tags",
        rationale: "Cover career, repertoire, achievements, venues"
      }
    },
    
    // Tag categories to include
    tag_categories: {
      required: [
        "Content type (Interview, Review, Article)",
        "Primary person/performer",
        "Musical genre/form (Opera, Symphony, Chamber Music)"
      ],
      important: [
        "Venue (if applicable)", 
        "Composer/piece (if specific)",
        "Publication context",
        "Musical role (Conductor, Soprano, etc.)"
      ],
      optional: [
        "Era/period",
        "Record label",
        "Collaboration details",
        "Technical aspects"
      ]
    }
  };
}

function main() {
  const standards = getTaggingStandards();
  
  console.log('🏷️  Content Tagging Standards & Recommendations\n');
  
  console.log('📚 Industry Standards:');
  Object.entries(standards.industry_standards).forEach(([type, range]) => {
    console.log(`   ${type.replace(/_/g, ' ')}: ${range}`);
  });
  
  console.log('\n📊 Current Content Analysis:');
  console.log(`   Total files analyzed: ${standards.current_analysis.total_files}`);
  console.log(`   Current median: ${standards.current_analysis.median} tags`);
  console.log(`   Optimal range: ${standards.current_analysis.optimal_range}`);
  console.log(`   Most common: ${standards.current_analysis.common_count}`);
  console.log(`   ⚠️  Issue: ${standards.current_analysis.problem}`);
  
  console.log('\n🎯 Recommended Tag Counts by Content Type:');
  Object.entries(standards.recommendations).forEach(([type, rec]) => {
    console.log(`\n   ${type.toUpperCase()}:`);
    console.log(`     Target: ${rec.target}`);
    console.log(`     Why: ${rec.rationale}`);
  });
  
  console.log('\n🏗️  Tag Structure Recommendations:');
  console.log('\n   REQUIRED (2-3 tags):');
  standards.tag_categories.required.forEach(tag => {
    console.log(`     • ${tag}`);
  });
  
  console.log('\n   IMPORTANT (3-5 tags):');
  standards.tag_categories.important.forEach(tag => {
    console.log(`     • ${tag}`);
  });
  
  console.log('\n   OPTIONAL (1-3 tags):');
  standards.tag_categories.optional.forEach(tag => {
    console.log(`     • ${tag}`);
  });
  
  console.log('\n✅ RECOMMENDED STANDARDS:');
  console.log('   • Target range: 6-10 tags for most content');
  console.log('   • Maximum limit: 12 tags (except special cases)');
  console.log('   • Minimum: 5 tags for adequate discoverability');
  console.log('   • Focus on specific, searchable terms');
  console.log('   • Avoid generic fragments and stop words');
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Update refine-subjects.js to limit to 10 tags max');
  console.log('   2. Prioritize most specific/relevant tags');
  console.log('   3. Review files with 15+ tags for optimization');
  console.log('   4. Ensure required categories are covered');
}

if (require.main === module) {
  main();
}

module.exports = { getTaggingStandards };
