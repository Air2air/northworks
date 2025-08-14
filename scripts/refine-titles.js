#!/usr/bin/env node

/**
 * Enhanced Title Refinement Script
 * 
 * Second pass to improve titles that still need work,
 * using more sophisticated content analysis.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// Enhanced title refinement strategies
const titleRefinement = {
  interview: (item) => {
    // If we have artist name in subject data, use it
    if (item.subject?.people?.length > 0) {
      const person = item.subject.people[0];
      if (person.name && person.name !== "Are all" && person.name.length > 2) {
        return `Interview with ${person.name}`;
      }
    }
    
    // Parse content for artist names
    if (item.content?.full_content) {
      const content = item.content.full_content;
      
      // Look for "Cheryl North Interviews [Name]" patterns
      const interviewPattern = /Cheryl North Interviews?\s+([^,\n]+?)(?:\s+prior to|\s+before|\s+about|\s+for)/i;
      const match = content.match(interviewPattern);
      if (match) {
        return `Interview with ${match[1].trim()}`;
      }
      
      // Look for famous opera names in content
      const operaNames = ['Pavarotti', 'Domingo', 'Netrebko', 'Kaufmann', 'DiDonato', 'Abdrazakov', 'Hvorostovsky'];
      for (const name of operaNames) {
        if (content.includes(name)) {
          return `Interview with ${name}`;
        }
      }
    }
    
    return null;
  },

  review: (item) => {
    // Try to build better titles from performance data
    if (item.performance && item.musical_works) {
      const org = item.performance.organization;
      const venue = item.performance.venue;
      const conductor = item.performance.conductor;
      const works = item.musical_works.primary_works;
      const composers = item.musical_works.composers;
      
      // Try organization + main work
      if (org && works?.length > 0) {
        const mainWork = works.find(w => w.length < 50 && w.length > 5);
        if (mainWork) {
          return `${org}: ${mainWork}`;
        }
      }
      
      // Try composer + organization
      if (composers?.length > 0 && org) {
        const composer = composers.find(c => c.length < 20 && c.length > 4);
        if (composer) {
          return `${org} performs ${composer}`;
        }
      }
      
      // Try venue + conductor
      if (venue && conductor && conductor.length < 30) {
        return `${conductor} conducts at ${venue}`;
      }
    }
    
    // Parse headline more intelligently
    if (item.content?.headline) {
      const headline = item.content.headline;
      
      // Look for opera titles
      const operaTitlePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*?)(?:\s*\*|$)/;
      const match = headline.match(operaTitlePattern);
      if (match && match[1].length > 5 && match[1].length < 40) {
        return `Review: ${match[1]}`;
      }
    }
    
    return null;
  },

  portfolio: (item) => {
    // More specific portfolio titles based on content analysis
    if (item.professional_data) {
      const data = item.professional_data;
      
      if (data.organizations?.length > 0) {
        return "Professional Organizations & Affiliations";
      }
      
      if (data.awards?.length > 0) {
        return "Awards & Recognition";
      }
      
      if (data.education?.length > 0) {
        return "Education & Academic Background";
      }
      
      if (data.publications?.length > 0) {
        return "Publications & Research";
      }
    }
    
    // Analyze biographical elements
    if (item.biographical_elements) {
      const bio = item.biographical_elements;
      
      if (bio.education?.length > 0) {
        return "Educational Background";
      }
      
      if (bio.career_highlights?.length > 0) {
        return "Career Highlights";
      }
    }
    
    return null;
  }
};

function refineTitle(item, contentType) {
  const strategy = titleRefinement[contentType];
  if (!strategy) return null;
  
  const refinedTitle = strategy(item);
  if (!refinedTitle) return null;
  
  // Clean up the refined title
  return refinedTitle
    .replace(/[<>]/g, '')
    .replace(/\*+/g, '')
    .replace(/^\s*[#]+\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shouldRefineTitle(title) {
  if (!title) return true;
  
  // Titles that need refinement
  const needsWork = [
    title === "Untitled",
    title.startsWith("Review of the performance") && title.length < 30,
    title.startsWith("Classical Music Column") && title.length < 40,
    title.startsWith("Professional") && title.includes("Overview"),
    title.includes("ANG Newspapers") && title.length > 60,
    title.startsWith("Interview with guest"),
    title.startsWith("Interview with master"),
    title.startsWith("Interview with founder")
  ];
  
  return needsWork.some(condition => condition);
}

function processDataFileRefinement(filename) {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return;
  }
  
  console.log(`\n📄 Refining: ${filename}`);
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let processedCount = 0;
  let refinedCount = 0;
  
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
  
  console.log(`   📊 Checking ${items.length} ${contentType} items for refinement`);
  
  // Process each item
  items.forEach((item, index) => {
    processedCount++;
    
    const currentTitle = item.content?.title;
    
    if (shouldRefineTitle(currentTitle)) {
      const refinedTitle = refineTitle(item, contentType);
      
      if (refinedTitle && refinedTitle !== currentTitle && refinedTitle.length > 5) {
        item.content = item.content || {};
        const oldTitle = currentTitle || "Missing";
        item.content.title = refinedTitle;
        
        console.log(`   ✨ [${index + 1}] "${oldTitle}" → "${refinedTitle}"`);
        refinedCount++;
      }
    }
  });
  
  // Write back the refined data
  if (refinedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`   💾 Saved ${refinedCount}/${processedCount} refinements`);
  } else {
    console.log(`   ℹ️  No refinements made`);
  }
  
  return { processed: processedCount, refined: refinedCount };
}

function main() {
  console.log('✨ Enhanced Title Refinement for Specialized Data Files');
  console.log('===================================================\n');
  
  const specializedFiles = [
    'interviews-specialized.json',
    'reviews-specialized.json', 
    'warner-portfolio-specialized.json'
  ];
  
  let totalProcessed = 0;
  let totalRefined = 0;
  
  specializedFiles.forEach(filename => {
    const result = processDataFileRefinement(filename);
    if (result) {
      totalProcessed += result.processed;
      totalRefined += result.refined;
    }
  });
  
  console.log('\n📈 Refinement Summary');
  console.log('====================');
  console.log(`   Total items checked: ${totalProcessed}`);
  console.log(`   Total titles refined: ${totalRefined}`);
  
  if (totalRefined > 0) {
    console.log('\n✨ Title refinement complete! Quality improved further.');
  } else {
    console.log('\n ℹ️  No additional refinements needed.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
