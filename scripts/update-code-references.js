#!/usr/bin/env node

/**
 * Update Code References Script
 * 
 * Updates all code references from old data files to the new 
 * specialized high-quality extractions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// File mapping: old -> new
const FILE_MAPPINGS = {
  'interviews-improved.json': 'interviews-specialized.json',
  'articles-improved.json': 'articles-specialized.json', 
  'warner-portfolio-quality.json': 'warner-portfolio-specialized.json',
  'warner-lists-enhanced.json': 'warner-portfolio-specialized.json',
  'interviews.json': 'interviews-specialized.json' // fallback case
};

function updateCodeReferences() {
  console.log('🔄 Updating Code References to High-Quality Data Files');
  console.log('=====================================================\n');
  
  // Find all TSX files that might reference data files
  const srcDir = path.join(ROOT_DIR, 'src');
  const filesToCheck = [];
  
  function findTSXFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        findTSXFiles(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        filesToCheck.push(fullPath);
      }
    }
  }
  
  findTSXFiles(srcDir);
  
  let totalUpdates = 0;
  
  // Process each file
  filesToCheck.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    let fileUpdates = 0;
    
    // Apply each mapping
    Object.entries(FILE_MAPPINGS).forEach(([oldFile, newFile]) => {
      const oldPattern = new RegExp(`src/data/${oldFile}`, 'g');
      if (content.includes(`src/data/${oldFile}`)) {
        content = content.replace(oldPattern, `src/data/${newFile}`);
        updated = true;
        fileUpdates++;
        console.log(`  📝 ${path.relative(ROOT_DIR, filePath)}: ${oldFile} → ${newFile}`);
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      totalUpdates += fileUpdates;
    }
  });
  
  console.log(`\n✅ Updated ${totalUpdates} references across ${filesToCheck.length} files\n`);
  
  // Verify the updates
  console.log('🔍 Verification - Checking for remaining old references:');
  const oldFiles = Object.keys(FILE_MAPPINGS);
  let foundOldRefs = false;
  
  filesToCheck.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    oldFiles.forEach(oldFile => {
      if (content.includes(`src/data/${oldFile}`)) {
        console.log(`  ⚠️  Still found: ${oldFile} in ${path.relative(ROOT_DIR, filePath)}`);
        foundOldRefs = true;
      }
    });
  });
  
  if (!foundOldRefs) {
    console.log('  ✅ No old references found - all updates successful!');
  }
  
  console.log('\n📋 New File Usage Summary:');
  Object.values(FILE_MAPPINGS).forEach(newFile => {
    const uniqueFile = [...new Set(Object.values(FILE_MAPPINGS))];
    if (uniqueFile.includes(newFile)) {
      console.log(`  📄 ${newFile} - High-quality specialized extraction`);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  updateCodeReferences();
}
