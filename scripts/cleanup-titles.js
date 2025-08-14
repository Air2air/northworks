#!/usr/bin/env node

/**
 * Title Cleanup Script
 * 
 * Fixes identified title quality issues:
 * - Removes HTML tags and markdown
 * - Fixes redundancy
 * - Improves generic titles
 * - Shortens overly long titles
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

function cleanTitle(title) {
  if (!title) return title;
  
  // Remove HTML tags
  let cleaned = title.replace(/<[^>]*>/g, '');
  
  // Remove markdown
  cleaned = cleaned.replace(/[*#`]/g, '');
  
  // Fix common redundancies
  cleaned = cleaned.replace(/Berkeley Opera: Berkeley Opera/g, 'Berkeley Opera: Don Giovanni');
  cleaned = cleaned.replace(/San Francisco Opera: Francisco Opera/g, 'San Francisco Opera');
  cleaned = cleaned.replace(/San Francisco Symphony: Francisco Symphony/g, 'San Francisco Symphony');
  
  // Simplify interview titles
  if (cleaned.includes('Cheryl North Interviews')) {
    cleaned = cleaned.replace('Cheryl North Interviews', 'Interview with');
    cleaned = cleaned.replace('Cheryl North Interviews with', 'Interview with');
  }
  
  // Clean up incomplete titles
  cleaned = cleaned.replace(/\.\.\.$/, '');
  cleaned = cleaned.replace(/,$/, '');
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

function improveSpecificTitles(item, contentType) {
  const title = item.content?.title;
  if (!title) return null;
  
  // Specific improvements based on content analysis
  const improvements = {
    // Generic portfolio titles
    'Professional Organizations & Affiliations': 'Board Memberships & Advisory Roles',
    'Professional Project Portfolio': 'Consulting Projects & Engagements',
    'The Author': 'Publication Authorship',
    'The Authors': 'Co-authored Publications',
    
    // Review improvements
    'Review of the performance': 'Performance Review',
    'Review of the July 15, 2009 performance': 'July 15, 2009 Performance Review',
    'Review of the October 3, 2010 performance,': 'October 3, 2010 Performance Review',
    'Review of the performance of January 22, 2010,': 'January 22, 2010 Performance Review',
    'Review of the performance of November 14, 2008,': 'November 14, 2008 Performance Review',
    'Review of the performance of May 20, 2005': 'May 20, 2005 Performance Review',
    
    // Interview improvements  
    'Interview with founder': 'Interview with Berkeley Opera Founder',
    'Interview with master': 'Interview with Master Musician',
    'Interview with guest': 'Interview with Guest Artist',
    
    // Article improvements
    'Thoughts on Our National Anthem': 'Our National Anthem: A Musical Perspective',
    'Music Trains the Brain': 'How Music Trains the Brain',
    'Update on Composer Jake Heggie': 'Composer Jake Heggie: An Update'
  };
  
  if (improvements[title]) {
    return improvements[title];
  }
  
  // Context-specific improvements
  if (contentType === 'portfolio') {
    if (title.includes('Professional') && item.professional_data?.organizations?.length > 0) {
      return 'Professional Organizations & Board Memberships';
    }
    if (title.includes('Publications') && item.professional_data?.publications?.length > 0) {
      return 'Research Publications & Papers';
    }
  }
  
  // Shorten overly long titles
  if (title.length > 80) {
    // Extract key phrases
    if (title.includes('Berkeley Opera Production')) {
      return 'Berkeley Opera: Wagner Ring Cycle Condensed';
    }
    if (title.includes('California Symphony season opens')) {
      return 'California Symphony: Guest Conductor Auditions';
    }
    if (title.includes('Beethoven\'s Ninth Symphony Conducted by Valery Gergiev')) {
      return 'Gergiev Conducts Beethoven 9th in Rotterdam';
    }
    if (title.includes('San Francisco Conservatory of Music Ensemble Parallele')) {
      return 'Ensemble Parallele: Wozzeck at Yerba Buena';
    }
  }
  
  return null;
}

function processDataFileCleanup(filename) {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return;
  }
  
  console.log(`\n🧹 Cleaning: ${filename}`);
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let cleanedCount = 0;
  let improvedCount = 0;
  
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
    console.log(`   ⚠️  No items found in expected structure`);
    return;
  }
  
  console.log(`   📊 Processing ${items.length} ${contentType} items`);
  
  // Process each item
  items.forEach((item, index) => {
    const originalTitle = item.content?.title;
    if (!originalTitle) return;
    
    // Try specific improvements first
    let improvedTitle = improveSpecificTitles(item, contentType);
    let wasImproved = false;
    
    if (improvedTitle && improvedTitle !== originalTitle) {
      item.content.title = improvedTitle;
      console.log(`   ✨ [${index + 1}] Improved: "${originalTitle}" → "${improvedTitle}"`);
      improvedCount++;
      wasImproved = true;
    }
    
    // Clean the title (either improved or original)
    const currentTitle = item.content.title;
    const cleanedTitle = cleanTitle(currentTitle);
    
    if (cleanedTitle !== currentTitle && !wasImproved) {
      item.content.title = cleanedTitle;
      console.log(`   🧹 [${index + 1}] Cleaned: "${currentTitle}" → "${cleanedTitle}"`);
      cleanedCount++;
    }
  });
  
  // Write back the cleaned data
  if (cleanedCount > 0 || improvedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`   💾 Saved ${cleanedCount} cleanups and ${improvedCount} improvements`);
  } else {
    console.log(`   ℹ️  No changes needed`);
  }
  
  return { cleaned: cleanedCount, improved: improvedCount };
}

function main() {
  console.log('🧹 Comprehensive Title Cleanup');
  console.log('==============================\n');
  
  const specializedFiles = [
    'interviews-specialized.json',
    'reviews-specialized.json', 
    'articles-specialized.json',
    'warner-portfolio-specialized.json'
  ];
  
  let totalCleaned = 0;
  let totalImproved = 0;
  
  specializedFiles.forEach(filename => {
    const result = processDataFileCleanup(filename);
    if (result) {
      totalCleaned += result.cleaned;
      totalImproved += result.improved;
    }
  });
  
  console.log('\n📈 Cleanup Summary');
  console.log('==================');
  console.log(`   Total titles cleaned: ${totalCleaned}`);
  console.log(`   Total titles improved: ${totalImproved}`);
  console.log(`   Total changes: ${totalCleaned + totalImproved}`);
  
  if (totalCleaned + totalImproved > 0) {
    console.log('\n✅ Title cleanup complete! Quality significantly improved.');
    console.log('   🎯 Removed HTML tags and markdown');
    console.log('   🎯 Fixed redundancy issues');
    console.log('   🎯 Improved generic titles');
    console.log('   🎯 Shortened overly long titles');
  } else {
    console.log('\n ℹ️  No cleanup needed - titles are already in good shape.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
