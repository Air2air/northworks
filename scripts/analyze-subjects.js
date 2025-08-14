#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Summary script to show before/after subjects and analyze the quality
 */

const contentDir = path.join(__dirname, '../public/content');

function analyzeSubjects() {
  console.log('📊 Subjects Analysis Report\n');
  
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(contentDir, file))
    .slice(0, 10); // Just show first 10 for sample
  
  let goodSubjects = 0;
  let needsWork = 0;
  let hasFragments = 0;
  
  files.forEach(filePath => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);
      
      if (frontmatter.subjects && frontmatter.subjects.length > 0) {
        const subjects = frontmatter.subjects;
        const fileName = path.basename(filePath);
        
        // Check for quality indicators
        const hasProperNouns = subjects.some(s => /^[A-Z]/.test(s));
        const hasMusicalTerms = subjects.some(s => 
          s.toLowerCase().includes('opera') || 
          s.toLowerCase().includes('symphony') || 
          s.toLowerCase().includes('piano') ||
          s.toLowerCase().includes('classical') ||
          s.toLowerCase().includes('aria')
        );
        const hasFragments = subjects.some(s => 
          s.length < 4 || 
          /^(the|and|or|of|in|on|at|to|for|with|is|was|are)\s/i.test(s) ||
          /\s(of|the|and)$/i.test(s)
        );
        
        console.log(`📄 ${fileName}:`);
        console.log(`   Subjects: [${subjects.slice(0, 5).join(', ')}${subjects.length > 5 ? '...' : ''}]`);
        
        if (hasFragments) {
          console.log(`   ⚠️  Still has fragments`);
          hasFragments++;
        } else if (hasProperNouns && hasMusicalTerms) {
          console.log(`   ✅ Good quality subjects`);
          goodSubjects++;
        } else {
          console.log(`   🔄 Could be improved`);
          needsWork++;
        }
        console.log();
      }
    } catch (error) {
      console.log(`❌ ${path.basename(filePath)}: YAML parsing error`);
      needsWork++;
    }
  });
  
  console.log(`📈 Summary (sample of ${files.length} files):`);
  console.log(`   ✅ Good subjects: ${goodSubjects}`);
  console.log(`   🔄 Needs improvement: ${needsWork}`);
  console.log(`   ⚠️  Still has fragments: ${hasFragments}`);
}

function showBestExamples() {
  console.log('\n🌟 Best Examples of Refined Subjects:\n');
  
  // Show the already refined files
  const refinedFiles = [
    'c_racette.md',
    'c_hvorostovsky.md', 
    'c_feltsman.md',
    'c_orbelian.md'
  ];
  
  refinedFiles.forEach(fileName => {
    const filePath = path.join(contentDir, fileName);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter } = matter(fileContent);
      
      if (frontmatter.subjects) {
        console.log(`📄 ${fileName}:`);
        console.log(`   ${frontmatter.subjects.join(', ')}`);
        console.log();
      }
    } catch (error) {
      // Skip if file has issues
    }
  });
}

if (require.main === module) {
  analyzeSubjects();
  showBestExamples();
}
