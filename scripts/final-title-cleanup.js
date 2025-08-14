const fs = require('fs');
const path = require('path');

function finalTitleCleanup() {
    const dataDir = path.join(__dirname, '../src/data');
    let totalFixes = 0;
    
    // Fix interview titles
    const interviewsFile = path.join(dataDir, 'interviews-specialized.json');
    const interviewsData = JSON.parse(fs.readFileSync(interviewsFile, 'utf8'));
    
    interviewsData.interviews.forEach(interview => {
        if (interview.content.title) {
            const oldTitle = interview.content.title;
            let newTitle = oldTitle;
            
            // Fix specific redundancy issues
            newTitle = newTitle
                .replace(/Interview with with/g, 'Interview with')
                .replace(/Interview with Lang Lang/g, 'Lang Lang Interview')
                .replace(/Cheryl North Column, based on an interview with/, 'Interview with')
                .replace(/, on the new "6\.5" Format/, ' on New 6.5 Format');
            
            // Shorten long titles
            if (newTitle.includes('Interview with Kiril Gerstein')) {
                newTitle = 'Kiril Gerstein Interview: Rachmaninoff Rhapsody';
            }
            if (newTitle.includes('Interview with Patricia Racette')) {
                newTitle = 'Patricia Racette Interview: Puccini Il Trittico';
            }
            if (newTitle.includes('Classical Music: 2011 Interview with Swedish Soprano')) {
                newTitle = 'Iréne Theorin Interview: Turandot at San Francisco Opera';
            }
            if (newTitle.includes('This material appeared in a November 1997')) {
                newTitle = 'November 1997 Classical Music Column';
            }
            
            if (newTitle !== oldTitle) {
                interview.content.title = newTitle;
                console.log(`Fixed interview: "${oldTitle.substring(0, 60)}..." → "${newTitle}"`);
                totalFixes++;
            }
        }
    });
    
    fs.writeFileSync(interviewsFile, JSON.stringify(interviewsData, null, 2), 'utf8');
    
    // Fix review titles  
    const reviewsFile = path.join(dataDir, 'reviews-specialized.json');
    const reviewsData = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
    
    reviewsData.reviews.forEach(review => {
        if (review.content.title) {
            const oldTitle = review.content.title;
            let newTitle = oldTitle;
            
            // Fix specific redundancy issues
            if (newTitle.includes('Review of the Performance in the Oakland Tribune')) {
                newTitle = 'Oakland Tribune Performance Review';
            }
            if (newTitle.includes('Review of the Orchestre de Paris, Benefit Concert')) {
                newTitle = 'Orchestre de Paris Benefit Concert Review';
            }
            
            if (newTitle !== oldTitle) {
                review.content.title = newTitle;
                console.log(`Fixed review: "${oldTitle.substring(0, 60)}..." → "${newTitle}"`);
                totalFixes++;
            }
        }
    });
    
    fs.writeFileSync(reviewsFile, JSON.stringify(reviewsData, null, 2), 'utf8');
    
    // Fix Warner portfolio titles
    const warnerFile = path.join(dataDir, 'warner-portfolio-specialized.json');
    const warnerData = JSON.parse(fs.readFileSync(warnerFile, 'utf8'));
    
    warnerData.portfolio_sections.forEach(section => {
        if (section.content.title) {
            const oldTitle = section.content.title;
            let newTitle = oldTitle;
            
            // Make generic titles more specific
            const headline = section.content.headline || '';
            const excerpt = section.content.excerpt || '';
            const content = (headline + ' ' + excerpt).toLowerCase();
            
            if (newTitle === "Board Memberships & Advisory Roles") {
                if (content.includes('american music center')) {
                    newTitle = "American Music Center Board Role";
                } else if (content.includes('contemporary')) {
                    newTitle = "Contemporary Music Advisory Roles";
                } else {
                    newTitle = "Arts Organization Board Roles";
                }
            } else if (newTitle === "Professional Organizations & Board Memberships") {
                if (content.includes('publication')) {
                    newTitle = "Music Publication Professional Organizations";
                } else {
                    newTitle = "Professional Music Organizations";
                }
            } else if (newTitle === "Consulting Projects & Engagements") {
                if (content.includes('government')) {
                    newTitle = "Government Arts Consulting";
                } else if (content.includes('stanford')) {
                    newTitle = "Stanford University Consulting";
                } else {
                    newTitle = "Strategic Arts Consulting";
                }
            } else if (newTitle === "Research Publications & Papers") {
                newTitle = "Academic Music Research Publications";
            }
            
            if (newTitle !== oldTitle) {
                section.content.title = newTitle;
                console.log(`Fixed Warner: "${oldTitle}" → "${newTitle}"`);
                totalFixes++;
            }
        }
    });
    
    fs.writeFileSync(warnerFile, JSON.stringify(warnerData, null, 2), 'utf8');
    
    console.log(`\n✅ Final cleanup completed: ${totalFixes} titles improved`);
    console.log(`\n🎯 Ready for quality re-analysis!`);
}

finalTitleCleanup();
