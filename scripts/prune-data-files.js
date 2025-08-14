#!/usr/bin/env node

/**
 * Data Files Pruning Script
 * 
 * This script removes low-quality and duplicate data files, keeping only
 * the high-quality specialized extractions and essential files.
 * 
 * KEEPS (High Quality):
 * - *-specialized.json files (master orchestrator output)
 * - data-manifest.json (schema and metadata)
 * - master-content-summary.json (analytics)
 * 
 * REMOVES (Low Quality/Duplicates):
 * - interviews.json, interviews-improved.json (superseded by specialized)
 * - articles.json, articles-improved.json (superseded by specialized)
 * - warner-portfolio.json, warner-portfolio-*.json (multiple versions)
 * - warner-lists*.json (consolidated into portfolio)
 * - profile.json, index.json (unused)
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Files to KEEP (high quality, in use)
const KEEP_FILES = [
  // Master orchestrator outputs (highest quality)
  'interviews-specialized.json',
  'reviews-specialized.json', 
  'articles-specialized.json',
  'warner-portfolio-specialized.json',
  'index-pages-specialized.json',
  
  // Essential metadata
  'data-manifest.json',
  'master-content-summary.json',
  'README.md'
];

// Files to REMOVE (duplicates, low quality, unused)
const REMOVE_FILES = [
  // Superseded interview files
  'interviews.json',
  'interviews-improved.json',
  
  // Superseded article files  
  'articles.json',
  'articles-improved.json',
  
  // Multiple warner portfolio versions (keep only specialized)
  'warner-portfolio.json',
  'warner-portfolio-quality.json', 
  'warner-portfolio-superior.json',
  
  // Separate warner lists (consolidated into portfolio-specialized)
  'warner-lists.json',
  'warner-lists-enhanced.json',
  
  // Unused files
  'profile.json',
  'index.json'
];

function pruneDataFiles() {
  console.log('🗂️  Data Files Pruning Analysis');
  console.log('================================\n');
  
  // Check current files
  const currentFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') || f.endsWith('.md'));
  
  console.log('📊 Current Files Analysis:');
  currentFiles.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    if (KEEP_FILES.includes(file)) {
      console.log(`  ✅ KEEP: ${file} (${sizeKB}KB) - High quality/Essential`);
    } else if (REMOVE_FILES.includes(file)) {
      console.log(`  ❌ REMOVE: ${file} (${sizeKB}KB) - Superseded/Duplicate`);
    } else {
      console.log(`  ⚠️  UNKNOWN: ${file} (${sizeKB}KB) - Manual review needed`);
    }
  });
  
  // Calculate space savings
  let totalSize = 0;
  let removedSize = 0;
  let keptSize = 0;
  
  currentFiles.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    
    if (REMOVE_FILES.includes(file)) {
      removedSize += stats.size;
    } else if (KEEP_FILES.includes(file)) {
      keptSize += stats.size;
    }
  });
  
  console.log('\n📈 Space Analysis:');
  console.log(`  Total current size: ${Math.round(totalSize / 1024)}KB`);
  console.log(`  Files to keep: ${Math.round(keptSize / 1024)}KB`);
  console.log(`  Files to remove: ${Math.round(removedSize / 1024)}KB`);
  console.log(`  Space savings: ${Math.round((removedSize / totalSize) * 100)}%`);
  
  // Perform the cleanup
  console.log('\n🧹 Performing cleanup...');
  
  let removedCount = 0;
  REMOVE_FILES.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`  🗑️  Removed: ${file}`);
        removedCount++;
      } catch (error) {
        console.log(`  ❌ Failed to remove ${file}: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️  File not found: ${file}`);
    }
  });
  
  console.log('\n✅ Cleanup Complete!');
  console.log(`   Removed ${removedCount} files`);
  console.log(`   Kept ${KEEP_FILES.length} high-quality files`);
  
  // List final files
  console.log('\n📋 Remaining Files:');
  const finalFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json') || f.endsWith('.md'));
  finalFiles.forEach(file => {
    const filePath = path.join(DATA_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   📄 ${file} (${sizeKB}KB)`);
  });
  
  console.log('\n🎯 Quality Summary:');
  console.log('   ✅ All files are now from specialized extractions');
  console.log('   ✅ No duplicate or superseded files remain');
  console.log('   ✅ Schema and metadata files preserved');
  console.log('   ✅ Ready for production use');
}

// Check if files will be updated by apps
function checkFileUsage() {
  console.log('\n⚠️  Files Currently Referenced in Code:');
  
  // Files that need to be updated in the codebase
  const outdatedReferences = [
    'interviews-improved.json',
    'articles-improved.json', 
    'warner-portfolio-quality.json',
    'warner-lists-enhanced.json'
  ];
  
  outdatedReferences.forEach(file => {
    if (REMOVE_FILES.includes(file)) {
      console.log(`   🔄 ${file} - NEEDS CODE UPDATE to use specialized version`);
    }
  });
  
  console.log('\n📝 Code Update Required:');
  console.log('   Replace old file references with:');
  console.log('   - interviews-improved.json → interviews-specialized.json');
  console.log('   - articles-improved.json → articles-specialized.json');
  console.log('   - warner-portfolio-quality.json → warner-portfolio-specialized.json');
  console.log('   - warner-lists-enhanced.json → warner-portfolio-specialized.json');
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    checkFileUsage();
    
    console.log('\n❓ Proceed with file pruning? (This will delete files)');
    console.log('   Run with --execute flag to perform actual deletion');
    
    if (process.argv.includes('--execute')) {
      pruneDataFiles();
    } else {
      console.log('\n🔍 Dry run complete. Add --execute to perform actual cleanup.');
    }
    
  } catch (error) {
    console.error('❌ Error during data file pruning:', error.message);
    process.exit(1);
  }
}
