#!/usr/bin/env node

/**
 * Title Inference Script
 * 
 * Analyzes specialized data files and infers meaningful titles
 * for entries marked as "Untitled" based on available content.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Title inference strategies for different content types
const titleInference = {
  interview: (item) => {
    // Try to extract artist name from content
    if (item.content?.summary) {
      // Look for interview patterns like "Cheryl North Interviews [Name]"
      const interviewMatch = item.content.summary.match(/Interviews?\s+([^,\n]+?)(?:\s+prior to|\s+for|\s+about|$)/i);
      if (interviewMatch) {
        return `Interview with ${interviewMatch[1].trim()}`;
      }
      
      // Look for artist mentions in first line
      const firstLine = item.content.summary.split('\n')[0];
      if (firstLine && firstLine.length < 100) {
        return firstLine.replace(/[#*]/g, '').trim();
      }
    }
    
    // Try excerpt
    if (item.content?.excerpt) {
      const excerpt = item.content.excerpt.trim();
      if (excerpt.length < 80) {
        return excerpt.replace(/[#*]/g, '').trim();
      }
    }
    
    // Fallback to artist name if available
    if (item.content?.artist && item.content.artist !== "Are all") {
      return `Interview with ${item.content.artist}`;
    }
    
    return null;
  },

  review: (item) => {
    // Try headline first - often has venue and work
    if (item.content?.headline) {
      const headline = item.content.headline.replace(/[#*]/g, '').trim();
      
      // Look for performance patterns
      const performanceMatch = headline.match(/(.+?(?:Symphony|Opera|Concert|Performance).*?)(?:Review|published)/i);
      if (performanceMatch) {
        return performanceMatch[1].trim();
      }
      
      // Take first meaningful line
      const lines = headline.split('\n').filter(line => line.trim().length > 0);
      for (const line of lines) {
        const cleaned = line.replace(/[#*]/g, '').trim();
        if (cleaned.length > 10 && cleaned.length < 100) {
          return cleaned;
        }
      }
    }
    
    // Try to construct from performance data
    if (item.performance?.organization && item.musical_works?.primary_works?.length > 0) {
      const org = item.performance.organization;
      const work = item.musical_works.primary_works[0];
      if (work.length < 50) {
        return `${org}: ${work}`;
      }
    }
    
    // Fallback to venue + date
    if (item.performance?.venue && item.publication?.date) {
      return `Review: ${item.performance.venue} - ${item.publication.date}`;
    }
    
    return null;
  },

  article: (item) => {
    // Many articles already have good titles, only fix truly "Untitled" ones
    if (item.content?.title && item.content.title !== "Untitled") {
      return null; // Keep existing title
    }
    
    // Try headline
    if (item.content?.headline) {
      const headline = item.content.headline.replace(/[#*]/g, '').trim();
      const lines = headline.split('\n').filter(line => line.trim().length > 0);
      
      for (const line of lines) {
        const cleaned = line.replace(/[#*]/g, '').trim();
        if (cleaned.length > 10 && cleaned.length < 120) {
          return cleaned;
        }
      }
    }
    
    // Try summary
    if (item.content?.summary) {
      const summary = item.content.summary.replace(/[#*]/g, '').trim();
      const lines = summary.split('\n').filter(line => line.trim().length > 0);
      
      for (const line of lines) {
        const cleaned = line.trim();
        if (cleaned.length > 10 && cleaned.length < 120) {
          return cleaned;
        }
      }
    }
    
    return null;
  },

  portfolio: (item) => {
    // Portfolio sections often have descriptive content
    if (item.content?.section_type) {
      const sectionType = item.content.section_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `Professional ${sectionType}`;
    }
    
    if (item.content?.headline) {
      const headline = item.content.headline.replace(/[#*]/g, '').trim();
      if (headline.length > 5 && headline.length < 80) {
        return headline;
      }
    }
    
    return null;
  }
};

function inferTitle(item, contentType) {
  const strategy = titleInference[contentType];
  if (!strategy) return null;
  
  const inferredTitle = strategy(item);
  if (!inferredTitle) return null;
  
  // Clean up the inferred title
  return inferredTitle
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/\*+/g, '') // Remove markdown
    .replace(/^\s*[#]+\s*/, '') // Remove markdown headers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function processDataFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return;
  }
  
  console.log(`\n📄 Processing: ${filename}`);
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let processedCount = 0;
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
  
  console.log(`   📊 Found ${items.length} ${contentType} items`);
  
  // Process each item
  items.forEach((item, index) => {
    processedCount++;
    
    if (item.content?.title === "Untitled" || !item.content?.title) {
      const inferredTitle = inferTitle(item, contentType);
      
      if (inferredTitle && inferredTitle.length > 5) {
        const oldTitle = item.content?.title || "Missing";
        item.content = item.content || {};
        item.content.title = inferredTitle;
        
        console.log(`   ✅ [${index + 1}] "${oldTitle}" → "${inferredTitle}"`);
        improvedCount++;
      } else {
        console.log(`   ❌ [${index + 1}] Could not infer title for "${item.id}"`);
      }
    }
  });
  
  // Write back the improved data
  if (improvedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`   💾 Saved ${improvedCount}/${processedCount} improvements`);
  } else {
    console.log(`   ℹ️  No improvements made`);
  }
  
  return { processed: processedCount, improved: improvedCount };
}

function main() {
  console.log('🎯 Title Inference for Specialized Data Files');
  console.log('===========================================\n');
  
  const specializedFiles = [
    'interviews-specialized.json',
    'reviews-specialized.json', 
    'articles-specialized.json',
    'warner-portfolio-specialized.json'
  ];
  
  let totalProcessed = 0;
  let totalImproved = 0;
  
  specializedFiles.forEach(filename => {
    const result = processDataFile(filename);
    if (result) {
      totalProcessed += result.processed;
      totalImproved += result.improved;
    }
  });
  
  console.log('\n📈 Summary');
  console.log('==========');
  console.log(`   Total items processed: ${totalProcessed}`);
  console.log(`   Total titles improved: ${totalImproved}`);
  console.log(`   Improvement rate: ${totalProcessed > 0 ? Math.round((totalImproved / totalProcessed) * 100) : 0}%`);
  
  if (totalImproved > 0) {
    console.log('\n✅ Title inference complete! Files have been updated.');
  } else {
    console.log('\n ℹ️  No titles needed improvement.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
