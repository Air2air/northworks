#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Analyzes the number of subjects/tags across all content files
 * to determine optimal tag count standards
 */

const contentDir = path.join(__dirname, '../public/content');

function analyzeTagCounts() {
  console.log('📊 Tag Count Analysis\n');
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file));
  
  const tagCounts = [];
  const examples = {};
  let validFiles = 0;
  
  files.forEach(filePath => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);
      
      if (frontmatter.subjects && Array.isArray(frontmatter.subjects)) {
        const count = frontmatter.subjects.length;
        tagCounts.push(count);
        validFiles++;
        
        const fileName = path.basename(filePath);
        
        // Store examples by tag count
        if (!examples[count]) examples[count] = [];
        if (examples[count].length < 3) {
          examples[count].push({
            file: fileName,
            subjects: frontmatter.subjects.slice(0, 5) // First 5 for preview
          });
        }
      }
    } catch (error) {
      // Skip files with parsing errors
    }
  });
  
  // Calculate statistics
  const sorted = tagCounts.sort((a, b) => a - b);
  const total = sorted.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(total / 2)];
  const mean = Math.round(sorted.reduce((a, b) => a + b, 0) / total);
  
  // Calculate quartiles
  const q1 = sorted[Math.floor(total * 0.25)];
  const q3 = sorted[Math.floor(total * 0.75)];
  
  console.log(`📈 Statistics (${validFiles} files with subjects):`);
  console.log(`   Min: ${min} tags`);
  console.log(`   Q1:  ${q1} tags`);
  console.log(`   Median: ${median} tags`);
  console.log(`   Mean: ${mean} tags`);
  console.log(`   Q3:  ${q3} tags`);
  console.log(`   Max: ${max} tags`);
  
  // Show distribution
  const distribution = {};
  tagCounts.forEach(count => {
    distribution[count] = (distribution[count] || 0) + 1;
  });
  
  console.log('\n📊 Distribution:');
  Object.keys(distribution)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach(count => {
      const percentage = Math.round(distribution[count] / total * 100);
      const bar = '█'.repeat(Math.floor(percentage / 5));
      console.log(`   ${count.padStart(2)} tags: ${distribution[count].toString().padStart(2)} files (${percentage}%) ${bar}`);
    });
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log(`   • Optimal range: ${q1}-${q3} tags (50% of articles fall here)`);
  console.log(`   • Target for articles: ${median} tags (median)`);
  console.log(`   • Target for interviews: ${Math.max(q3, 8)} tags (more detailed)`);
  console.log(`   • Target for reviews: ${Math.max(q1, 5)} tags (focused)`);
  
  // Show examples of different tag counts
  console.log('\n📝 Examples by tag count:');
  [3, 5, 8, 10, 15].forEach(targetCount => {
    if (examples[targetCount]) {
      console.log(`\n${targetCount} tags example (${examples[targetCount][0].file}):`);
      console.log(`   ${examples[targetCount][0].subjects.join(', ')}${examples[targetCount][0].subjects.length > 5 ? '...' : ''}`);
    }
  });
  
  return {
    min, max, median, mean, q1, q3,
    distribution,
    recommendation: {
      articles: median,
      interviews: Math.max(q3, 8),
      reviews: Math.max(q1, 5),
      optimal_range: [q1, q3]
    }
  };
}

if (require.main === module) {
  analyzeTagCounts();
}

module.exports = { analyzeTagCounts };
