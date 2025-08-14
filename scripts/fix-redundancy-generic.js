const fs = require('fs');
const path = require('path');

function fixRedundancyAndGenericTitles() {
    const dataDir = path.join(__dirname, '../src/data');
    
    // Process reviews for redundancy
    const reviewsFile = path.join(dataDir, 'reviews-specialized.json');
    const reviewsData = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
    
    let reviewFixCount = 0;
    
    reviewsData.reviews.forEach(review => {
        if (review.content.title) {
            const oldTitle = review.content.title;
            let newTitle = oldTitle;
            
            // Fix redundant organization names
            newTitle = newTitle
                .replace(/California Symphony.*California Symphony/i, 'California Symphony')
                .replace(/Berkeley Opera.*Berkeley Opera/i, 'Berkeley Opera')
                .replace(/Symphony.*Symphony/i, 'Symphony');
            
            // Shorten overly long titles
            if (newTitle.length > 80) {
                const parts = newTitle.split(',');
                if (parts.length > 1) {
                    newTitle = parts[0].trim();
                }
            }
            
            if (newTitle !== oldTitle) {
                review.content.title = newTitle;
                console.log(`Fixed review title: "${oldTitle}" → "${newTitle}"`);
                reviewFixCount++;
            }
        }
    });
    
    fs.writeFileSync(reviewsFile, JSON.stringify(reviewsData, null, 2), 'utf8');
    
    // Process Warner portfolio for generic titles
    const warnerFile = path.join(dataDir, 'warner-portfolio-specialized.json');
    const warnerData = JSON.parse(fs.readFileSync(warnerFile, 'utf8'));
    
    let warnerFixCount = 0;
    
    warnerData.portfolio_sections.forEach(section => {
        if (section.content.title) {
            const oldTitle = section.content.title;
            let newTitle = oldTitle;
            
            // Make titles more specific based on content
            if (section.content.headline) {
                const headline = section.content.headline.toLowerCase();
                
                if (newTitle === "Board Memberships & Advisory Roles" && headline.includes('american music')) {
                    newTitle = "American Music Center Advisory Role";
                } else if (newTitle === "Board Memberships & Advisory Roles" && headline.includes('contemporary')) {
                    newTitle = "Contemporary Music Organization Roles";
                } else if (newTitle === "Consulting Projects & Engagements" && headline.includes('strategic')) {
                    newTitle = "Strategic Planning Consulting";
                } else if (newTitle === "Consulting Projects & Engagements" && headline.includes('board')) {
                    newTitle = "Board Development Consulting";
                } else if (newTitle === "Professional Organizations & Board Memberships" && headline.includes('music')) {
                    newTitle = "Music Industry Professional Organizations";
                } else if (newTitle === "Publication Authorship" && headline.includes('research')) {
                    newTitle = "Research Publications & Academic Papers";
                } else if (newTitle === "Research Publications & Papers" && headline.includes('classical')) {
                    newTitle = "Classical Music Research Publications";
                }
            }
            
            if (newTitle !== oldTitle) {
                section.content.title = newTitle;
                console.log(`Fixed Warner title: "${oldTitle}" → "${newTitle}"`);
                warnerFixCount++;
            }
        }
    });
    
    fs.writeFileSync(warnerFile, JSON.stringify(warnerData, null, 2), 'utf8');
    
    console.log(`\n✅ Fixed ${reviewFixCount} review redundancy issues`);
    console.log(`✅ Fixed ${warnerFixCount} generic Warner portfolio titles`);
    console.log(`\n📊 Total improvements: ${reviewFixCount + warnerFixCount}`);
}

fixRedundancyAndGenericTitles();
