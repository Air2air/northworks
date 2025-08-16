#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class JsonImageUpdater {
    constructor() {
        this.contentDir = path.join(__dirname, '..', 'public', 'content');
        this.dataDir = path.join(__dirname, '..', 'src', 'data');
        this.publicDataDir = path.join(__dirname, '..', 'public', 'data');
    }

    async getJsonFiles() {
        const files = [];
        
        // Check src/data directory
        try {
            const srcFiles = await fs.readdir(this.dataDir);
            srcFiles
                .filter(file => file.endsWith('.json'))
                .forEach(file => files.push(path.join(this.dataDir, file)));
        } catch (error) {
            console.log('No src/data directory found');
        }
        
        // Check public/data directory
        try {
            const publicFiles = await fs.readdir(this.publicDataDir);
            publicFiles
                .filter(file => file.endsWith('.json'))
                .forEach(file => files.push(path.join(this.publicDataDir, file)));
        } catch (error) {
            console.log('No public/data directory found');
        }
        
        return files;
    }

    extractImagesFromMarkdown(content) {
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) return [];
        
        const frontmatter = match[1];
        const lines = frontmatter.split('\n');
        
        let inImages = false;
        const images = [];
        let currentImage = {};
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine === 'images:') {
                inImages = true;
                continue;
            }
            
            if (inImages) {
                if (trimmedLine.startsWith('- ') || (trimmedLine.startsWith('height:') && Object.keys(currentImage).length === 0)) {
                    // Start of new image or first property
                    if (currentImage.src) {
                        images.push(currentImage);
                    }
                    currentImage = {};
                    
                    if (trimmedLine.startsWith('- height:')) {
                        currentImage.height = parseInt(trimmedLine.substring(9).trim());
                    } else if (trimmedLine.startsWith('height:')) {
                        currentImage.height = parseInt(trimmedLine.substring(7).trim());
                    }
                } else if (trimmedLine.startsWith('height:')) {
                    currentImage.height = parseInt(trimmedLine.substring(7).trim());
                } else if (trimmedLine.startsWith('src:')) {
                    currentImage.src = trimmedLine.substring(4).trim();
                } else if (trimmedLine.startsWith('width:')) {
                    currentImage.width = parseInt(trimmedLine.substring(6).trim());
                } else if (trimmedLine && !trimmedLine.startsWith(' ') && trimmedLine.includes(':')) {
                    // Hit another field, stop collecting images
                    if (currentImage.src) {
                        images.push(currentImage);
                    }
                    break;
                }
            }
        }
        
        // Add the last image if it exists
        if (currentImage.src) {
            images.push(currentImage);
        }
        
        return images;
    }

    selectBestImage(images) {
        if (!images || images.length === 0) return null;
        
        // Prioritize images without 'thm-' prefix
        const nonThumbnails = images.filter(img => {
            const filename = path.basename(img.src);
            return !filename.startsWith('thm-');
        });
        
        // If we have non-thumbnail images, use the first one
        if (nonThumbnails.length > 0) {
            return nonThumbnails[0];
        }
        
        // Otherwise, use the first image available
        return images[0];
    }

    async getMarkdownImages(markdownId) {
        try {
            // Try the exact ID as filename first
            const exactFile = `${markdownId}.md`;
            
            try {
                const filePath = path.join(this.contentDir, exactFile);
                const content = await fs.readFile(filePath, 'utf-8');
                const images = this.extractImagesFromMarkdown(content);
                const bestImage = this.selectBestImage(images);
                
                if (bestImage) {
                    return {
                        url: bestImage.src,
                        alt: markdownId,
                        type: 'image',
                        width: bestImage.width,
                        height: bestImage.height
                    };
                }
            } catch (error) {
                // File doesn't exist with exact name, that's ok
            }
            
            return null;
        } catch (error) {
            console.error(`Error processing markdown for ${markdownId}:`, error.message);
            return null;
        }
    }

    async updateJsonFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content);
            
            let updatedCount = 0;
            let totalEntries = 0;
            
            // Handle different JSON structures
            const entries = data.articles || data.interviews || data.reviews || 
                           data.background || data.professional || data.publications || [];
            
            for (const entry of entries) {
                totalEntries++;
                
                if (entry.metadata && entry.metadata.id) {
                    const markdownImage = await this.getMarkdownImages(entry.metadata.id);
                    
                    if (markdownImage) {
                        // Ensure media structure exists
                        if (!entry.media) {
                            entry.media = {};
                        }
                        if (!entry.media.images) {
                            entry.media.images = [];
                        }
                        
                        // Check if we already have this image
                        const existingImage = entry.media.images.find(img => img.url === markdownImage.url);
                        
                        if (!existingImage) {
                            // Add the new image at the beginning (prioritize it)
                            entry.media.images.unshift(markdownImage);
                            updatedCount++;
                            console.log(`  📷 Added image for ${entry.metadata.id}: ${markdownImage.url}`);
                        } else {
                            // Update existing image with additional properties
                            const wasUpdated = Object.keys(markdownImage).some(key => 
                                existingImage[key] !== markdownImage[key]
                            );
                            Object.assign(existingImage, markdownImage);
                            if (wasUpdated) {
                                updatedCount++;
                            }
                            console.log(`  🔄 Updated existing image for ${entry.metadata.id}: ${markdownImage.url}`);
                        }
                    } else {
                        console.log(`  ⚠️  No image found for ${entry.metadata.id}`);
                    }
                }
            }
            
            // Update metadata
            if (data.metadata) {
                data.metadata.lastModified = new Date().toISOString();
            }
            
            // Write back to file
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
            
            return {
                filename: path.basename(filePath),
                totalEntries,
                updatedCount
            };
            
        } catch (error) {
            console.error(`Error updating ${filePath}:`, error.message);
            return {
                filename: path.basename(filePath),
                error: error.message
            };
        }
    }

    async run() {
        console.log('🖼️  Updating JSON files with markdown images...\n');
        
        const jsonFiles = await this.getJsonFiles();
        
        if (jsonFiles.length === 0) {
            console.log('No JSON files found.');
            return;
        }
        
        console.log(`Found ${jsonFiles.length} JSON files to update:\n`);
        
        const results = [];
        
        for (const filePath of jsonFiles) {
            console.log(`🔄 Processing ${path.basename(filePath)}...`);
            const result = await this.updateJsonFile(filePath);
            results.push(result);
            
            if (result.error) {
                console.log(`❌ Error: ${result.error}`);
            } else {
                console.log(`✅ Updated ${result.updatedCount}/${result.totalEntries} entries`);
            }
        }
        
        console.log('\n📊 SUMMARY:');
        console.log('─'.repeat(50));
        
        let totalUpdated = 0;
        let totalEntries = 0;
        
        results.forEach(result => {
            if (!result.error) {
                totalUpdated += result.updatedCount;
                totalEntries += result.totalEntries;
                console.log(`${result.filename}: ${result.updatedCount}/${result.totalEntries} entries updated`);
            } else {
                console.log(`${result.filename}: Error - ${result.error}`);
            }
        });
        
        console.log('─'.repeat(50));
        console.log(`🎉 Total: ${totalUpdated}/${totalEntries} entries updated across ${results.length} files`);
        
        if (totalUpdated > 0) {
            console.log('\n✨ Images have been prioritized:');
            console.log('   1. Non-thumbnail images (without "thm-" prefix) preferred');
            console.log('   2. Fallback to thumbnail images if no others available');
            console.log('   3. Added width/height information where available');
        }
    }
}

// Run if called directly
if (require.main === module) {
    const updater = new JsonImageUpdater();
    updater.run().catch(console.error);
}

module.exports = JsonImageUpdater;
