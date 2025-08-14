#!/usr/bin/env node

/**
 * Title Quality Analysis Script
 * 
 * Analyzes all titles in specialized data files to identify
 * quality issues and suggest improvements.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Title quality assessment criteria
const titleQualityChecks = {
  hasHtmlTags: (title) => /<[^>]+>/.test(title),
  hasMarkdown: (title) => /[*#`]/.test(title),
  isTooGeneric: (title) => {
    const generic = [
      'Untitled',
      'The Author',
      'The Authors', 
      'Professional Project Portfolio',
      'Professional Organizations & Affiliations'
    ];
    return generic.includes(title);
  },
  isTooLong: (title) => title.length > 120,
  isTooShort: (title) => title.length < 5,
  hasRedundancy: (title) => {
    // Check for repeated words
    const words = title.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    return words.length !== uniqueWords.size;
  },
  isIncomplete: (title) => {
    return title.endsWith('...') || title.endsWith('..') || 
           title.endsWith(',') || title.endsWith('about');
  },
  hasEncoding: (title) => {
    return title.includes('&') || title.includes('&lt;') || title.includes('&gt;');
  }
};

function analyzeTitle(title, context = {}) {
  const issues = [];
  const suggestions = [];
  
  Object.entries(titleQualityChecks).forEach(([check, fn]) => {
    if (fn(title)) {
      issues.push(check);
    }
  });
  
  // Generate suggestions based on issues
  if (issues.includes('hasHtmlTags')) {
    const cleaned = title.replace(/<[^>]*>/g, '').trim();
    suggestions.push(`Remove HTML: "${cleaned}"`);
  }
  
  if (issues.includes('hasMarkdown')) {
    const cleaned = title.replace(/[*#`]/g, '').trim();
    suggestions.push(`Remove markdown: "${cleaned}"`);
  }
  
  if (issues.includes('hasRedundancy')) {
    if (title.includes('Berkeley Opera: Berkeley Opera')) {
      suggestions.push(`Fix redundancy: "Berkeley Opera: Don Giovanni"`);
    }
    if (title.includes('Interview with') && title.includes('Interviews')) {
      const cleaned = title.replace('Cheryl North Interviews', 'Interview with');
      suggestions.push(`Simplify: "${cleaned}"`);
    }
  }
  
  if (issues.includes('isTooGeneric')) {
    if (context.contentType === 'portfolio' && context.hasOrganizations) {
      suggestions.push(`More specific: "Board Memberships & Advisory Roles"`);
    }
    if (context.contentType === 'portfolio' && context.hasProjects) {
      suggestions.push(`More specific: "Consulting Projects & Engagements"`);
    }
  }
  
  if (issues.includes('isIncomplete')) {
    suggestions.push(`Complete the title based on content`);
  }
  
  return {
    title,
    issues,
    suggestions,
    quality: issues.length === 0 ? 'good' : issues.length < 3 ? 'fair' : 'poor'
  };
}

function processDataFileAnalysis(filename) {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  console.log(`\n📄 Analyzing: ${filename}`);
  console.log('=' + '='.repeat(filename.length + 12));
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Determine content type and data structure
  let items = [];
  let contentType = '';
  
  if (data.interviews) {
    items = data.interviews;
    contentType = 'interview';
  } else if (data.reviews) {
    items = data.reviews;
    contentType = 'review';
  } else if (data.articles) {
    items = data.articles;
    contentType = 'article';
  } else if (data.portfolio_sections) {
    items = data.portfolio_sections;
    contentType = 'portfolio';
  }
  
  if (items.length === 0) {
    console.log(`   ⚠️  No items found`);
    return null;
  }
  
  const results = {
    filename,
    contentType,
    totalItems: items.length,
    good: 0,
    fair: 0,
    poor: 0,
    issues: []
  };
  
  // Analyze each title
  items.forEach((item, index) => {
    const title = item.content?.title || 'Missing Title';
    
    const context = {
      contentType,
      hasOrganizations: item.professional_data?.organizations?.length > 0,
      hasProjects: item.professional_data?.projects?.length > 0,
      id: item.id
    };
    
    const analysis = analyzeTitle(title, context);
    
    if (analysis.quality === 'good') {
      results.good++;
    } else if (analysis.quality === 'fair') {
      results.fair++;
    } else {
      results.poor++;
    }
    
    if (analysis.issues.length > 0) {
      results.issues.push({
        index: index + 1,
        id: item.id,
        ...analysis
      });
    }
  });
  
  // Report results
  console.log(`📊 Quality Distribution:`);
  console.log(`   ✅ Good: ${results.good} (${Math.round(results.good/results.totalItems*100)}%)`);
  console.log(`   ⚠️  Fair: ${results.fair} (${Math.round(results.fair/results.totalItems*100)}%)`);
  console.log(`   ❌ Poor: ${results.poor} (${Math.round(results.poor/results.totalItems*100)}%)`);
  
  if (results.issues.length > 0) {
    console.log(`\n🔍 Issues Found (${results.issues.length}):`);
    
    results.issues.slice(0, 10).forEach(issue => {
      console.log(`\n   [${issue.index}] ${issue.id}`);
      console.log(`   Title: "${issue.title}"`);
      console.log(`   Issues: ${issue.issues.join(', ')}`);
      if (issue.suggestions.length > 0) {
        console.log(`   Suggestions: ${issue.suggestions.join(' | ')}`);
      }
    });
    
    if (results.issues.length > 10) {
      console.log(`   ... and ${results.issues.length - 10} more issues`);
    }
  }
  
  return results;
}

function main() {
  console.log('🔍 Comprehensive Title Quality Analysis');
  console.log('=====================================');
  
  const specializedFiles = [
    'interviews-specialized.json',
    'reviews-specialized.json', 
    'articles-specialized.json',
    'warner-portfolio-specialized.json'
  ];
  
  const overallResults = {
    totalFiles: 0,
    totalItems: 0,
    totalGood: 0,
    totalFair: 0,
    totalPoor: 0,
    fileResults: []
  };
  
  specializedFiles.forEach(filename => {
    const result = processDataFileAnalysis(filename);
    if (result) {
      overallResults.totalFiles++;
      overallResults.totalItems += result.totalItems;
      overallResults.totalGood += result.good;
      overallResults.totalFair += result.fair;
      overallResults.totalPoor += result.poor;
      overallResults.fileResults.push(result);
    }
  });
  
  // Overall summary
  console.log('\n🎯 Overall Summary');
  console.log('================');
  console.log(`📁 Files analyzed: ${overallResults.totalFiles}`);
  console.log(`📄 Total items: ${overallResults.totalItems}`);
  console.log(`✅ Good titles: ${overallResults.totalGood} (${Math.round(overallResults.totalGood/overallResults.totalItems*100)}%)`);
  console.log(`⚠️  Fair titles: ${overallResults.totalFair} (${Math.round(overallResults.totalFair/overallResults.totalItems*100)}%)`);
  console.log(`❌ Poor titles: ${overallResults.totalPoor} (${Math.round(overallResults.totalPoor/overallResults.totalItems*100)}%)`);
  
  // Priority recommendations
  console.log('\n🎯 Priority Improvements Needed:');
  
  const allIssues = overallResults.fileResults.flatMap(file => file.issues);
  const priorityIssues = allIssues.filter(issue => 
    issue.issues.includes('hasHtmlTags') || 
    issue.issues.includes('hasRedundancy') ||
    issue.issues.includes('isTooGeneric')
  );
  
  if (priorityIssues.length > 0) {
    console.log(`\n🚨 High Priority (${priorityIssues.length} items):`);
    priorityIssues.slice(0, 5).forEach(issue => {
      console.log(`   • ${issue.title}`);
    });
  }
  
  const qualityScore = Math.round((overallResults.totalGood / overallResults.totalItems) * 100);
  console.log(`\n📈 Overall Title Quality Score: ${qualityScore}%`);
  
  if (qualityScore >= 80) {
    console.log('🎉 Excellent! Titles are in great shape.');
  } else if (qualityScore >= 60) {
    console.log('👍 Good quality, but some improvements needed.');
  } else {
    console.log('⚠️  Significant improvements needed for better user experience.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
