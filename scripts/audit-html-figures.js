#!/usr/bin/env node

/**
 * Audit script for HTML figure popup files
 * Analyzes old HTML popup architecture and generates migration report
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'public', 'content');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

/**
 * Extract image info from HTML popup file
 */
function extractImageFromHtml(htmlPath) {
  try {
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Match img tag with src, height, width attributes
    const imgMatch = html.match(/<img\s+src="([^"]+)"[^>]*height="(\d+)"[^>]*width="(\d+)"/i) ||
                     html.match(/<img\s+src="([^"]+)"[^>]*width="(\d+)"[^>]*height="(\d+)"/i);
    
    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    
    if (imgMatch) {
      return {
        src: imgMatch[1].replace(/^images\//, '/images/'),
        width: parseInt(imgMatch[imgMatch.length - 1]),
        height: parseInt(imgMatch[imgMatch.length - 2]),
        title: titleMatch ? titleMatch[1] : 'Unknown'
      };
    }
  } catch (err) {
    console.error(`Error reading ${htmlPath}:`, err.message);
  }
  return null;
}

/**
 * Check if image file exists
 */
function imageExists(imageSrc) {
  const imagePath = path.join(__dirname, '..', 'public', imageSrc);
  return fs.existsSync(imagePath);
}

/**
 * Find markdown files that reference HTML popup files
 */
function findMarkdownReferences() {
  const mdFiles = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md') && f.startsWith('w-'));
  
  const references = {};
  
  mdFiles.forEach(mdFile => {
    const content = fs.readFileSync(path.join(CONTENT_DIR, mdFile), 'utf-8');
    const htmlRefs = content.match(/\[.*?\]\([^)]*\.htm\)/g);
    
    if (htmlRefs) {
      references[mdFile] = htmlRefs.map(ref => {
        const match = ref.match(/\(([^)]+\.htm)\)/);
        return match ? match[1].replace(/^.*\//, '') : null;
      }).filter(Boolean);
    }
  });
  
  return references;
}

/**
 * Main audit function
 */
function auditHtmlFigures() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║         HTML Figure Popup Architecture Audit Report         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  // Find all HTML files
  const htmlFiles = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.htm'));
  
  console.log(`Found ${htmlFiles.length} HTML popup files in public/content/\n`);
  
  // Audit each HTML file
  const audit = [];
  const missing = [];
  
  htmlFiles.forEach(filename => {
    const htmlPath = path.join(CONTENT_DIR, filename);
    const imageInfo = extractImageFromHtml(htmlPath);
    
    if (imageInfo) {
      const exists = imageExists(imageInfo.src);
      const item = {
        htmlFile: filename,
        ...imageInfo,
        imageExists: exists
      };
      
      audit.push(item);
      if (!exists) missing.push(item);
      
      console.log(`📄 ${filename}`);
      console.log(`   Title: ${imageInfo.title}`);
      console.log(`   Image: ${imageInfo.src}`);
      console.log(`   Size: ${imageInfo.width}x${imageInfo.height}`);
      console.log(`   Status: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log();
    }
  });
  
  // Find markdown references
  console.log('\n─────────────────────────────────────────────────────────────');
  console.log('Markdown Files with HTML References:\n');
  
  const mdReferences = findMarkdownReferences();
  Object.entries(mdReferences).forEach(([mdFile, htmlRefs]) => {
    console.log(`📝 ${mdFile}`);
    htmlRefs.forEach(ref => console.log(`   → ${ref}`));
    console.log();
  });
  
  // Summary
  console.log('─────────────────────────────────────────────────────────────');
  console.log('SUMMARY:\n');
  console.log(`Total HTML files: ${audit.length}`);
  console.log(`Images found: ${audit.filter(a => a.imageExists).length}`);
  console.log(`Images missing: ${missing.length}`);
  console.log(`Markdown files affected: ${Object.keys(mdReferences).length}`);
  
  if (missing.length > 0) {
    console.log('\n⚠️  MISSING IMAGES:');
    missing.forEach(item => {
      console.log(`   • ${item.src} (from ${item.htmlFile})`);
    });
  }
  
  // Generate migration data
  console.log('\n─────────────────────────────────────────────────────────────');
  console.log('MIGRATION DATA (by Markdown file):\n');
  
  Object.entries(mdReferences).forEach(([mdFile, htmlRefs]) => {
    console.log(`\n${mdFile}:`);
    console.log('images:');
    
    htmlRefs.forEach((htmlRef, index) => {
      const htmlData = audit.find(a => a.htmlFile.toLowerCase() === htmlRef.toLowerCase());
      if (htmlData) {
        console.log(`  - src: ${htmlData.src}`);
        console.log(`    alt: "${htmlData.title}"`);
        console.log(`    figureHint: "${index + 1}"`);
        console.log(`    width: ${htmlData.width}`);
        console.log(`    height: ${htmlData.height}`);
      }
    });
  });
  
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('Audit complete!');
  console.log('═════════════════════════════════════════════════════════════\n');
  
  // Write JSON report
  const reportPath = path.join(__dirname, '..', 'docs', 'html-figure-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    htmlFiles: audit,
    markdownReferences: mdReferences,
    missingImages: missing
  }, null, 2));
  
  console.log(`📊 Full report written to: ${reportPath}\n`);
}

// Run audit
auditHtmlFigures();
