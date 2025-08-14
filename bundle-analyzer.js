#!/usr/bin/env node

/**
 * Bundle Analysis and Dead Code Detection Script
 * Analyzes the Next.js bundle and identifies optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BundleAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcDir = path.join(this.projectRoot, 'src');
    this.componentsDir = path.join(this.srcDir, 'components');
    this.buildDir = path.join(this.projectRoot, '.next');
  }

  // Analyze bundle composition
  async analyzeBundleComposition() {
    console.log('🔍 Analyzing bundle composition...\n');
    
    try {
      // Run bundle analyzer
      execSync('ANALYZE=true npm run build', { 
        stdio: 'pipe',
        cwd: this.projectRoot 
      });
      
      const analyzeDir = path.join(this.buildDir, 'analyze');
      if (fs.existsSync(analyzeDir)) {
        const files = fs.readdirSync(analyzeDir);
        console.log('✅ Bundle analysis complete. Reports generated:');
        files.forEach(file => {
          console.log(`   - ${file}`);
        });
      }
    } catch (error) {
      console.log('⚠️  Bundle analysis had issues, but continuing...');
    }
  }

  // Find unused components
  findUnusedComponents() {
    console.log('\n🔍 Searching for unused components...\n');
    
    const components = this.getAllComponents();
    const usedComponents = this.findComponentUsages();
    
    const unusedComponents = components.filter(comp => 
      !usedComponents.has(comp.name) && 
      !comp.name.includes('.test.') &&
      !comp.name.includes('.spec.') &&
      comp.name !== 'layout.tsx' &&
      comp.name !== 'page.tsx'
    );

    if (unusedComponents.length > 0) {
      console.log('🚨 Potentially unused components found:');
      unusedComponents.forEach(comp => {
        console.log(`   - ${comp.relativePath}`);
      });
    } else {
      console.log('✅ No unused components detected');
    }

    return unusedComponents;
  }

  // Get all component files
  getAllComponents() {
    const components = [];
    
    const scanDirectory = (dir, baseDir = this.srcDir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath, baseDir);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          components.push({
            name: item,
            fullPath,
            relativePath: path.relative(baseDir, fullPath)
          });
        }
      });
    };

    scanDirectory(this.srcDir);
    return components;
  }

  // Find component usages across the codebase
  findComponentUsages() {
    const usedComponents = new Set();
    const components = this.getAllComponents();
    
    components.forEach(comp => {
      const content = fs.readFileSync(comp.fullPath, 'utf8');
      
      // Extract imports
      const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g) || [];
      importMatches.forEach(match => {
        const pathMatch = match.match(/from\s+['"]([^'"]+)['"]/);
        if (pathMatch) {
          const importPath = pathMatch[1];
          if (importPath.startsWith('.') || importPath.startsWith('@/')) {
            const componentName = path.basename(importPath);
            usedComponents.add(componentName + '.tsx');
            usedComponents.add(componentName + '.ts');
          }
        }
      });

      // Extract dynamic imports
      const dynamicMatches = content.match(/import\(['"]([^'"]+)['"]\)/g) || [];
      dynamicMatches.forEach(match => {
        const pathMatch = match.match(/import\(['"]([^'"]+)['"]\)/);
        if (pathMatch) {
          const importPath = pathMatch[1];
          const componentName = path.basename(importPath);
          usedComponents.add(componentName + '.tsx');
          usedComponents.add(componentName + '.ts');
        }
      });
    });

    return usedComponents;
  }

  // Analyze large files
  analyzeLargeFiles() {
    console.log('\n🔍 Analyzing large files...\n');
    
    const components = this.getAllComponents();
    const largeFiles = components
      .map(comp => {
        const stat = fs.statSync(comp.fullPath);
        return {
          ...comp,
          size: stat.size
        };
      })
      .filter(comp => comp.size > 10000) // Files larger than 10KB
      .sort((a, b) => b.size - a.size);

    if (largeFiles.length > 0) {
      console.log('📊 Large files (>10KB) that could benefit from optimization:');
      largeFiles.forEach(file => {
        const sizeKB = (file.size / 1024).toFixed(1);
        console.log(`   - ${file.relativePath} (${sizeKB}KB)`);
      });
    } else {
      console.log('✅ No unusually large files detected');
    }

    return largeFiles;
  }

  // Check for optimization opportunities
  checkOptimizationOpportunities() {
    console.log('\n🔍 Checking optimization opportunities...\n');
    
    const components = this.getAllComponents();
    const opportunities = [];

    components.forEach(comp => {
      if (!comp.name.endsWith('.tsx')) return;
      
      const content = fs.readFileSync(comp.fullPath, 'utf8');
      
      // Check for React.memo usage
      if (content.includes('export') && 
          content.includes('function') && 
          !content.includes('React.memo') &&
          !content.includes('memo(')) {
        opportunities.push({
          file: comp.relativePath,
          type: 'React.memo',
          description: 'Could benefit from React.memo optimization'
        });
      }

      // Check for dynamic imports
      if (content.includes('import') && 
          !content.includes('dynamic(') &&
          comp.relativePath.includes('page.tsx')) {
        opportunities.push({
          file: comp.relativePath,
          type: 'Dynamic Import',
          description: 'Page could use dynamic imports for large components'
        });
      }

      // Check for image optimization
      if (content.includes('<img') && !content.includes('next/image')) {
        opportunities.push({
          file: comp.relativePath,
          type: 'Image Optimization',
          description: 'Could use Next.js Image component for optimization'
        });
      }
    });

    if (opportunities.length > 0) {
      console.log('🎯 Optimization opportunities found:');
      opportunities.forEach(opp => {
        console.log(`   - ${opp.file}: ${opp.description}`);
      });
    } else {
      console.log('✅ No obvious optimization opportunities detected');
    }

    return opportunities;
  }

  // Generate optimization report
  async generateReport() {
    console.log('🚀 Bundle Analysis and Optimization Report');
    console.log('==========================================\n');

    await this.analyzeBundleComposition();
    const unusedComponents = this.findUnusedComponents();
    const largeFiles = this.analyzeLargeFiles();
    const opportunities = this.checkOptimizationOpportunities();

    // Generate summary
    console.log('\n📋 Summary:');
    console.log(`   - Unused components: ${unusedComponents.length}`);
    console.log(`   - Large files (>10KB): ${largeFiles.length}`);
    console.log(`   - Optimization opportunities: ${opportunities.length}`);

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        unusedComponents: unusedComponents.length,
        largeFiles: largeFiles.length,
        optimizationOpportunities: opportunities.length
      },
      details: {
        unusedComponents,
        largeFiles,
        opportunities
      }
    };

    const reportPath = path.join(this.projectRoot, 'bundle-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    return report;
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.generateReport().catch(console.error);
}

module.exports = BundleAnalyzer;
