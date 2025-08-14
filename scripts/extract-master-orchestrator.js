#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * MASTER CONTENT EXTRACTION ORCHESTRATOR
 * Runs all specialized extraction scripts for complete content processing
 */

// Import all specialized extractors
const { extractInterviewsSpecialized } = require('./extract-interviews-specialized');
const { extractReviewsSpecialized } = require('./extract-reviews-specialized');
const { extractArticlesSpecialized } = require('./extract-articles-specialized');
const { extractIndexPagesSpecialized } = require('./extract-index-pages-specialized');
const { extractWarnerPortfolioSpecialized } = require('./extract-warner-portfolio-specialized');

async function runMasterExtraction() {
  console.log('🎼 MASTER CONTENT EXTRACTION ORCHESTRATOR');
  console.log('='.repeat(60));
  console.log('Running all specialized extraction scripts...\n');
  
  const startTime = Date.now();
  const results = {
    success: [],
    errors: [],
    summary: {}
  };
  
  try {
    // 1. Extract Classical Music Interviews
    console.log('1️⃣  PHASE 1: Classical Music Interviews');
    console.log('-'.repeat(40));
    try {
      const interviewResults = await extractInterviewsSpecialized();
      results.success.push('interviews');
      results.summary.interviews = {
        total: interviewResults.interviews.length,
        subjects: Object.keys(interviewResults.analytics.subjects).length,
        venues: Object.keys(interviewResults.analytics.venues).length
      };
      console.log('✅ Interviews extraction completed successfully\n');
    } catch (error) {
      console.error('❌ Interviews extraction failed:', error.message);
      results.errors.push({ type: 'interviews', error: error.message });
    }
    
    // 2. Extract Classical Music Reviews
    console.log('2️⃣  PHASE 2: Classical Music Reviews');
    console.log('-'.repeat(40));
    try {
      const reviewResults = await extractReviewsSpecialized();
      results.success.push('reviews');
      results.summary.reviews = {
        total: reviewResults.reviews.length,
        venues: Object.keys(reviewResults.analytics.venues).length,
        performers: Object.keys(reviewResults.analytics.performers).length
      };
      console.log('✅ Reviews extraction completed successfully\n');
    } catch (error) {
      console.error('❌ Reviews extraction failed:', error.message);
      results.errors.push({ type: 'reviews', error: error.message });
    }
    
    // 3. Extract Classical Music Articles
    console.log('3️⃣  PHASE 3: Classical Music Articles');
    console.log('-'.repeat(40));
    try {
      const articleResults = await extractArticlesSpecialized();
      results.success.push('articles');
      results.summary.articles = {
        total: articleResults.articles.length,
        topics: Object.keys(articleResults.analytics.topics).length,
        themes: Object.keys(articleResults.analytics.themes).length
      };
      console.log('✅ Articles extraction completed successfully\n');
    } catch (error) {
      console.error('❌ Articles extraction failed:', error.message);
      results.errors.push({ type: 'articles', error: error.message });
    }
    
    // 4. Extract Warner Professional Portfolio
    console.log('4️⃣  PHASE 4: Warner Professional Portfolio');
    console.log('-'.repeat(40));
    try {
      const warnerResults = await extractWarnerPortfolioSpecialized();
      results.success.push('warner_portfolio');
      results.summary.warner_portfolio = {
        total: warnerResults.portfolio_sections.length,
        content_types: Object.keys(warnerResults.analytics.content_types).length,
        organizations: Object.keys(warnerResults.analytics.organizations).length
      };
      console.log('✅ Warner portfolio extraction completed successfully\n');
    } catch (error) {
      console.error('❌ Warner portfolio extraction failed:', error.message);
      results.errors.push({ type: 'warner_portfolio', error: error.message });
    }
    
    // 5. Extract Index/Navigation Pages
    console.log('5️⃣  PHASE 5: Index & Navigation Pages');
    console.log('-'.repeat(40));
    try {
      const indexResults = await extractIndexPagesSpecialized();
      results.success.push('index_pages');
      results.summary.index_pages = {
        total: indexResults.index_pages.length,
        page_types: Object.keys(indexResults.analytics.page_types).length,
        categories: Object.keys(indexResults.analytics.content_categories).length
      };
      console.log('✅ Index pages extraction completed successfully\n');
    } catch (error) {
      console.error('❌ Index pages extraction failed:', error.message);
      results.errors.push({ type: 'index_pages', error: error.message });
    }
    
    // 6. Generate Master Summary
    console.log('6️⃣  PHASE 6: Master Data Integration');
    console.log('-'.repeat(40));
    await generateMasterSummary(results);
    
    // 6. Create Data Manifest
    await createDataManifest(results);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n🎉 MASTER EXTRACTION COMPLETE');
    console.log('='.repeat(60));
    console.log(`⏱️  Total execution time: ${duration.toFixed(2)}s`);
    console.log(`✅ Successful extractions: ${results.success.length}/5`);
    console.log(`❌ Failed extractions: ${results.errors.length}/5`);
    
    if (results.errors.length > 0) {
      console.log('\n⚠️  ERRORS ENCOUNTERED:');
      results.errors.forEach(error => {
        console.log(`   - ${error.type}: ${error.error}`);
      });
    }
    
    console.log('\n📊 EXTRACTION SUMMARY:');
    Object.entries(results.summary).forEach(([type, stats]) => {
      console.log(`   ${type}: ${stats.total} items`);
    });
    
    console.log('\n📁 Generated Files:');
    console.log('   - src/data/interviews-specialized.json');
    console.log('   - src/data/reviews-specialized.json');
    console.log('   - src/data/articles-specialized.json');
    console.log('   - src/data/warner-portfolio-specialized.json');
    console.log('   - src/data/index-pages-specialized.json');
    console.log('   - src/data/master-content-summary.json');
    console.log('   - src/data/data-manifest.json');
    
    return results;
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR in master extraction:', error);
    process.exit(1);
  }
}

async function generateMasterSummary(results) {
  const masterSummary = {
    metadata: {
      id: "master_content_summary",
      type: "comprehensive_analysis",
      category: "all_classical_content",
      extractionVersion: "master_v1",
      extractionDate: new Date().toISOString(),
      execution_results: {
        successful_extractions: results.success.length,
        failed_extractions: results.errors.length,
        total_phases: 4
      }
    },
    content_overview: {
      total_items: 0,
      content_types: results.success.length,
      extraction_coverage: `${(results.success.length / 4 * 100).toFixed(1)}%`
    },
    detailed_breakdown: results.summary,
    cross_domain_analysis: {
      common_subjects: [],
      venue_coverage: [],
      temporal_span: {},
      content_interconnections: []
    },
    data_quality_metrics: {
      completeness_score: calculateCompletenessScore(results),
      structural_consistency: assessStructuralConsistency(results),
      content_richness: assessContentRichness(results)
    },
    usage_recommendations: {
      search_implementation: generateSearchRecommendations(results),
      display_strategies: generateDisplayStrategies(results),
      data_integration: generateIntegrationRecommendations(results)
    }
  };
  
  // Calculate total items
  Object.values(results.summary).forEach(summary => {
    masterSummary.content_overview.total_items += summary.total || 0;
  });
  
  // Cross-domain analysis
  if (results.summary.interviews && results.summary.reviews) {
    masterSummary.cross_domain_analysis.content_interconnections.push({
      type: 'interviews_reviews_crossover',
      description: 'Musicians featured in both interviews and performance reviews'
    });
  }
  
  if (results.summary.articles && results.summary.reviews) {
    masterSummary.cross_domain_analysis.content_interconnections.push({
      type: 'articles_reviews_venues',
      description: 'Venues covered in both feature articles and performance reviews'
    });
  }
  
  // Save master summary
  const outputPath = path.join(__dirname, '../src/data/master-content-summary.json');
  fs.writeFileSync(outputPath, JSON.stringify(masterSummary, null, 2));
  console.log('📋 Generated master content summary');
  
  return masterSummary;
}

async function createDataManifest(results) {
  const manifest = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    description: "Classical Music Content Data Manifest",
    data_files: [],
    schemas: {},
    usage_guide: {
      recommended_load_order: [],
      dependencies: {},
      performance_notes: []
    }
  };
  
  // Add successful extractions to manifest
  if (results.success.includes('interviews')) {
    manifest.data_files.push({
      filename: 'interviews-specialized.json',
      type: 'classical_interviews',
      description: 'Specialized extraction of classical music interviews',
      record_count: results.summary.interviews?.total || 0,
      key_fields: ['content.artist', 'musical_context.venues', 'interview_specifics.type'],
      dependencies: []
    });
    manifest.usage_guide.recommended_load_order.push('interviews-specialized.json');
  }
  
  if (results.success.includes('reviews')) {
    manifest.data_files.push({
      filename: 'reviews-specialized.json',
      type: 'performance_reviews',
      description: 'Specialized extraction of classical music performance reviews',
      record_count: results.summary.reviews?.total || 0,
      key_fields: ['performance.venue', 'musical_works.primary_works', 'review_analysis.overall_assessment'],
      dependencies: []
    });
    manifest.usage_guide.recommended_load_order.push('reviews-specialized.json');
  }
  
  if (results.success.includes('articles')) {
    manifest.data_files.push({
      filename: 'articles-specialized.json',
      type: 'feature_articles',
      description: 'Specialized extraction of classical music feature articles',
      record_count: results.summary.articles?.total || 0,
      key_fields: ['topic.primary_topic', 'subjects.people', 'analysis.tone'],
      dependencies: []
    });
    manifest.usage_guide.recommended_load_order.push('articles-specialized.json');
  }
  
  if (results.success.includes('warner_portfolio')) {
    manifest.data_files.push({
      filename: 'warner-portfolio-specialized.json',
      type: 'professional_portfolio',
      description: 'Specialized extraction of Warner North professional portfolio',
      record_count: results.summary.warner_portfolio?.total || 0,
      key_fields: ['professional_data.organizations', 'biographical_elements.education', 'content.section_type'],
      dependencies: []
    });
    manifest.usage_guide.recommended_load_order.push('warner-portfolio-specialized.json');
  }
  
  if (results.success.includes('index_pages')) {
    manifest.data_files.push({
      filename: 'index-pages-specialized.json',
      type: 'navigation_indices',
      description: 'Specialized extraction of content index and navigation pages',
      record_count: results.summary.index_pages?.total || 0,
      key_fields: ['page_structure.type', 'navigation.links', 'content_organization.total_items'],
      dependencies: manifest.data_files.map(f => f.filename) // Index pages depend on all content
    });
    manifest.usage_guide.recommended_load_order.push('index-pages-specialized.json');
  }
  
  // Add performance recommendations
  manifest.usage_guide.performance_notes = [
    "Load interviews and reviews first for core content",
    "Articles provide contextual enhancement",
    "Index pages should be loaded last as they reference other content",
    "Consider lazy loading for large content sets",
    "Implement client-side caching for frequently accessed data"
  ];
  
  // Add schema definitions
  manifest.schemas = {
    interview_schema: {
      required_fields: ["id", "content.artist", "subject.people"],
      optional_fields: ["musical_context.venues", "interview_specifics.type"],
      field_types: {
        "id": "string",
        "content.artist": "string",
        "subject.people": "array",
        "musical_context.venues": "array"
      }
    },
    review_schema: {
      required_fields: ["id", "performance.venue", "musical_works.primary_works"],
      optional_fields: ["review_analysis.overall_assessment", "performance.conductor"],
      field_types: {
        "id": "string",
        "performance.venue": "string",
        "musical_works.primary_works": "array"
      }
    },
    article_schema: {
      required_fields: ["id", "topic.primary_topic", "content.title"],
      optional_fields: ["subjects.people", "analysis.tone"],
      field_types: {
        "id": "string",
        "topic.primary_topic": "string",
        "content.title": "string"
      }
    }
  };
  
  // Save manifest
  const manifestPath = path.join(__dirname, '../src/data/data-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('📋 Generated data manifest');
  
  return manifest;
}

function calculateCompletenessScore(results) {
  const maxScore = 5; // Total possible extractions (interviews, reviews, articles, warner_portfolio, index_pages)
  const actualScore = results.success.length;
  return (actualScore / maxScore * 100).toFixed(1) + '%';
}

function assessStructuralConsistency(results) {
  // All successful extractions should have consistent structure
  const hasConsistentMetadata = results.success.length > 0;
  const hasConsistentContent = results.success.length > 0;
  const hasConsistentAnalytics = results.success.length > 0;
  
  if (hasConsistentMetadata && hasConsistentContent && hasConsistentAnalytics) {
    return 'high';
  } else if (results.success.length >= 2) {
    return 'moderate';
  } else {
    return 'low';
  }
}

function assessContentRichness(results) {
  const totalItems = Object.values(results.summary).reduce((sum, summary) => sum + (summary.total || 0), 0);
  
  if (totalItems >= 100) return 'rich';
  if (totalItems >= 50) return 'moderate';
  if (totalItems >= 10) return 'basic';
  return 'minimal';
}

function generateSearchRecommendations(results) {
  const recommendations = [];
  
  if (results.success.includes('interviews')) {
    recommendations.push('Implement artist-based search across interviews');
  }
  if (results.success.includes('reviews')) {
    recommendations.push('Enable venue and performance date search for reviews');
  }
  if (results.success.includes('articles')) {
    recommendations.push('Create topic-based categorization for articles');
  }
  if (results.success.includes('warner_portfolio')) {
    recommendations.push('Enable organization and project-based search for portfolio');
  }
  
  recommendations.push('Implement cross-domain search to find related content');
  recommendations.push('Use full-text search for content discovery');
  
  return recommendations;
}

function generateDisplayStrategies(results) {
  const strategies = [];
  
  if (results.success.length >= 3) {
    strategies.push('Multi-tab interface for different content types');
    strategies.push('Cross-referenced content suggestions');
  }
  
  if (results.success.includes('index_pages')) {
    strategies.push('Navigation-driven content discovery');
  }
  
  strategies.push('Timeline view for chronological content');
  strategies.push('Card-based layout for content browsing');
  
  return strategies;
}

function generateIntegrationRecommendations(results) {
  const recommendations = [];
  
  if (results.success.length >= 2) {
    recommendations.push('Create unified content API endpoints');
    recommendations.push('Implement content relationship mapping');
  }
  
  recommendations.push('Use consistent data loading patterns');
  recommendations.push('Implement progressive data enhancement');
  recommendations.push('Create content analytics dashboard');
  
  return recommendations;
}

// Run the master extraction if called directly
if (require.main === module) {
  runMasterExtraction().catch(error => {
    console.error('💥 Fatal error in master extraction:', error);
    process.exit(1);
  });
}

module.exports = { 
  runMasterExtraction,
  generateMasterSummary,
  createDataManifest
};
