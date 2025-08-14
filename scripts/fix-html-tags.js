const fs = require('fs');
const path = require('path');

function fixHtmlTags() {
    const dataDir = path.join(__dirname, '../src/data');
    const reviewsFile = path.join(dataDir, 'reviews-specialized.json');
    
    try {
        console.log('Reading reviews file...');
        const reviewsData = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
        
        let fixCount = 0;
        
        // Fix HTML tags in titles
        reviewsData.reviews.forEach(review => {
            // Fix content.title
            if (review.content.title && review.content.title.includes('<')) {
                const oldTitle = review.content.title;
                review.content.title = review.content.title
                    .replace(/<[^>]*>/g, '') // Remove all HTML tags
                    .trim();
                console.log(`Fixed content.title: "${oldTitle}" → "${review.content.title}"`);
                fixCount++;
            }
            
            // Fix performance.title  
            if (review.performance?.title && review.performance.title.includes('<')) {
                const oldTitle = review.performance.title;
                review.performance.title = review.performance.title
                    .replace(/<[^>]*>/g, '') // Remove all HTML tags
                    .trim();
                console.log(`Fixed performance.title: "${oldTitle}" → "${review.performance.title}"`);
                fixCount++;
            }
        });
        
        // Write back the cleaned data
        fs.writeFileSync(reviewsFile, JSON.stringify(reviewsData, null, 2), 'utf8');
        
        console.log(`\n✅ Fixed ${fixCount} HTML tag issues in reviews`);
        
        // Verify the fixes
        const verifyData = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
        let remainingTags = 0;
        
        verifyData.reviews.forEach(review => {
            if (review.content.title && review.content.title.includes('<')) {
                remainingTags++;
            }
            if (review.performance?.title && review.performance.title.includes('<')) {
                remainingTags++;
            }
        });
        
        console.log(`\n📊 Verification: ${remainingTags} HTML tags remaining`);
        
    } catch (error) {
        console.error('Error fixing HTML tags:', error);
    }
}

fixHtmlTags();
