#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Master subjects script that:
 * 1. Fixes YAML formatting issues
 * 2. Runs the subjects refinement
 * 3. Provides a summary report
 */

const contentDir = path.join(__dirname, '../public/content');

async function runScript(scriptName) {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    const { stdout, stderr } = await execAsync(`node ${scriptName}`, { 
      cwd: path.dirname(__filename) 
    });
    
    if (stderr) {
      console.error(`Errors from ${scriptName}:`, stderr);
    }
    
    return stdout;
  } catch (error) {
    console.error(`Failed to run ${scriptName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎵 Master Subjects Refinement Tool\n');
  
  // Step 1: Fix YAML formatting
  console.log('📝 Step 1: Fixing YAML formatting issues...');
  await runScript('fix-yaml-formatting.js');
  
  // Step 2: Run subjects refinement  
  console.log('\n🔍 Step 2: Refining subjects tags...');
  await runScript('refine-subjects.js');
  
  // Step 3: Show analysis
  console.log('\n📊 Step 3: Analysis report...');
  await runScript('analyze-subjects.js');
  
  console.log('\n✅ Subjects refinement complete!');
  console.log('\n💡 Tips for manual review:');
  console.log('   • Check files with YAML parsing errors');
  console.log('   • Review subjects that seem too generic');
  console.log('   • Add specific opera/piece names manually if needed');
  console.log('   • Consider adding decade/era tags for historical context');
}

if (require.main === module) {
  main().catch(console.error);
}
