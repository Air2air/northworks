#!/usr/bin/env node

/**
 * Complete Tag System Upgrade and Deployment Preparation
 * Final script to prepare the site for deployment with improved tagging
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentPrep {
    constructor() {
        this.rootDir = process.cwd();
        this.stats = {
            criticalFixed: 0,
            allImproved: 0,
            errors: 0,
            buildSuccess: false,
            deployReady: false
        };
    }

    async run(options = {}) {
        const { 
            dryRun = true, 
            skipBuild = false,
            skipTagUpdates = false 
        } = options;
        
        console.log('🚀 NORTHWORKS DEPLOYMENT PREPARATION');
        console.log(`Mode: ${dryRun ? 'DRY RUN' : 'EXECUTE CHANGES'}`);
        console.log('═'.repeat(60));
        
        try {
            // Step 1: Fix critical tag issues
            if (!skipTagUpdates) {
                await this.fixCriticalTags(dryRun);
            }
            
            // Step 2: Apply comprehensive tag improvements
            if (!skipTagUpdates && !dryRun) {
                await this.improveAllTags(dryRun);
            }
            
            // Step 3: Validate build
            if (!skipBuild) {
                await this.validateBuild();
            }
            
            // Step 4: Prepare for Vercel deployment
            if (!dryRun) {
                await this.prepareDeployment();
            }
            
            this.printDeploymentSummary();
            
        } catch (error) {
            console.error('❌ Deployment preparation failed:', error.message);
            this.stats.errors++;
        }
    }

    async fixCriticalTags(dryRun) {
        console.log('\n📋 STEP 1: Fixing Critical Tag Issues');
        console.log('─'.repeat(40));
        
        try {
            const cmd = dryRun 
                ? 'node scripts/priority-tags.js'
                : 'node scripts/priority-tags.js --apply';
                
            const output = execSync(cmd, { 
                cwd: this.rootDir,
                encoding: 'utf-8'
            });
            
            console.log(output);
            
            // Parse output for stats
            const improvedMatch = output.match(/Files improved: (\d+)/);
            if (improvedMatch) {
                this.stats.criticalFixed = parseInt(improvedMatch[1]);
            }
            
            console.log(`✅ Critical issues ${dryRun ? 'identified' : 'fixed'}`);
            
        } catch (error) {
            console.error('❌ Critical tag fix failed:', error.message);
            throw error;
        }
    }

    async improveAllTags(dryRun) {
        console.log('\n🎯 STEP 2: Comprehensive Tag Improvements');
        console.log('─'.repeat(40));
        
        try {
            const cmd = dryRun 
                ? 'node scripts/implement-tags.js'
                : 'node scripts/implement-tags.js --apply';
                
            console.log('Running comprehensive tag analysis...');
            const output = execSync(cmd, { 
                cwd: this.rootDir,
                encoding: 'utf-8',
                maxBuffer: 1024 * 1024 * 5 // 5MB buffer for large output
            });
            
            // Parse output for stats (show summary only)
            const lines = output.split('\n');
            const summaryStart = lines.findIndex(line => line.includes('IMPLEMENTATION SUMMARY'));
            if (summaryStart !== -1) {
                const summary = lines.slice(summaryStart).join('\n');
                console.log(summary);
            }
            
            const improvedMatch = output.match(/Files improved: (\d+)/);
            if (improvedMatch) {
                this.stats.allImproved = parseInt(improvedMatch[1]);
            }
            
            console.log(`✅ All tags ${dryRun ? 'analyzed' : 'improved'}`);
            
        } catch (error) {
            console.error('❌ Comprehensive tag improvement failed:', error.message);
            throw error;
        }
    }

    async validateBuild() {
        console.log('\n🏗️  STEP 3: Validating Build');
        console.log('─'.repeat(40));
        
        try {
            console.log('Installing dependencies...');
            execSync('npm install', { 
                cwd: this.rootDir,
                stdio: 'pipe'
            });
            
            console.log('Building application...');
            const buildOutput = execSync('npm run build', { 
                cwd: this.rootDir,
                encoding: 'utf-8'
            });
            
            // Check for build success indicators
            if (buildOutput.includes('compiled successfully') || 
                buildOutput.includes('Build completed')) {
                this.stats.buildSuccess = true;
                console.log('✅ Build successful');
            } else {
                console.log('⚠️  Build completed with warnings');
                console.log(buildOutput);
            }
            
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            throw error;
        }
    }

    async prepareDeployment() {
        console.log('\n🌐 STEP 4: Deployment Preparation');
        console.log('─'.repeat(40));
        
        try {
            // Verify package.json has deployment scripts
            const packagePath = path.join(this.rootDir, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
            
            const requiredScripts = ['deploy', 'deploy:prod', 'vercel-build'];
            const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
            
            if (missingScripts.length > 0) {
                console.log(`⚠️  Missing deployment scripts: ${missingScripts.join(', ')}`);
            } else {
                console.log('✅ Deployment scripts configured');
            }
            
            // Check for critical deployment files
            const deploymentFiles = [
                'vercel.json',
                'next.config.ts',
                '.env.example'
            ];
            
            deploymentFiles.forEach(file => {
                const filePath = path.join(this.rootDir, file);
                if (fs.existsSync(filePath)) {
                    console.log(`✅ ${file} present`);
                } else {
                    console.log(`⚠️  ${file} missing (optional)`);
                }
            });
            
            // Create deployment summary
            this.createDeploymentGuide();
            
            this.stats.deployReady = true;
            console.log('✅ Deployment preparation complete');
            
        } catch (error) {
            console.error('❌ Deployment preparation failed:', error.message);
            throw error;
        }
    }

    createDeploymentGuide() {
        const guide = `# DEPLOYMENT GUIDE

## Current Status
- Critical tag issues: ${this.stats.criticalFixed} fixed
- Total files improved: ${this.stats.allImproved}
- Build status: ${this.stats.buildSuccess ? 'PASSED' : 'PENDING'}
- Deployment ready: ${this.stats.deployReady ? 'YES' : 'NO'}

## Quick Deploy to Vercel

### Option 1: GitHub Integration (Recommended)
1. Push changes to GitHub repository
2. Connect repository to Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Option 2: Vercel CLI
\`\`\`bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
\`\`\`

### Option 3: Package Scripts
\`\`\`bash
# Deploy to preview
npm run deploy

# Deploy to production
npm run deploy:prod
\`\`\`

## Post-Deployment Checklist
- [ ] Verify all pages load correctly
- [ ] Test tag-based navigation and search
- [ ] Check responsive design on mobile
- [ ] Validate SEO metadata
- [ ] Test performance (Lighthouse score)

## Tag System Improvements
- Added specific entity tags (people, venues, works)
- Removed generic/invalid tags
- Standardized naming conventions
- Improved content discoverability

## Support
For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Next.js deployment guide: https://nextjs.org/docs/deployment
- Project logs in Vercel dashboard

Generated: ${new Date().toISOString()}
`;

        fs.writeFileSync(
            path.join(this.rootDir, 'DEPLOYMENT_GUIDE.md'), 
            guide, 
            'utf-8'
        );
        
        console.log('📝 Created DEPLOYMENT_GUIDE.md');
    }

    printDeploymentSummary() {
        console.log('\n' + '═'.repeat(60));
        console.log('📊 DEPLOYMENT PREPARATION SUMMARY');
        console.log('═'.repeat(60));
        console.log(`Critical issues fixed: ${this.stats.criticalFixed}`);
        console.log(`Total files improved: ${this.stats.allImproved}`);
        console.log(`Build successful: ${this.stats.buildSuccess ? 'YES' : 'NO'}`);
        console.log(`Deployment ready: ${this.stats.deployReady ? 'YES' : 'NO'}`);
        console.log(`Errors encountered: ${this.stats.errors}`);
        
        if (this.stats.deployReady && this.stats.errors === 0) {
            console.log('\n🎉 READY FOR DEPLOYMENT!');
            console.log('\n📖 Next steps:');
            console.log('1. Review DEPLOYMENT_GUIDE.md');
            console.log('2. Push changes to GitHub');
            console.log('3. Deploy via Vercel');
            console.log('4. Verify deployment success');
        } else {
            console.log('\n⚠️  Issues need to be resolved before deployment');
        }
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        dryRun: !args.includes('--apply'),
        skipBuild: args.includes('--skip-build'),
        skipTagUpdates: args.includes('--skip-tags')
    };
    
    new DeploymentPrep().run(options);
}

module.exports = DeploymentPrep;
