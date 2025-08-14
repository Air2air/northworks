#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Extract profile data from w_main.md and convert to structured JSON
 */
async function extractProfileToJson() {
  const inputFile = path.join(__dirname, '../public/content/w_main.md');
  const outputFile = path.join(__dirname, '../src/data/profile.json');
  
  try {
    console.log('🔍 Reading profile file...');
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);
    
    console.log('📝 Extracting profile sections...');
    
    // Parse the content into structured sections
    const profile = parseProfileContent(content, frontMatter);
    
    console.log('✅ Successfully extracted profile data');
    
    // Create the final JSON structure
    const jsonData = {
      metadata: {
        id: "warner_north_profile",
        type: "biography",
        category: "professional",
        subcategory: "academic-profile",
        status: "published",
        featured: true
      },
      content: {
        title: "D. Warner North",
        subtitle: "Principal Scientist, NorthWorks",
        summary: "Risk analysis and decision analysis expert with fifty years of experience in environmental protection and energy policy",
        body: profile.mainBio
      },
      subject: {
        people: [{
          name: "D. Warner North",
          role: "Principal Scientist",
          nationality: "American"
        }]
      },
      professional: {
        currentPosition: {
          title: "Principal Scientist",
          organization: "NorthWorks",
          location: "San Francisco, California",
          startDate: null
        },
        previousPositions: [
          {
            title: "Consulting Professor",
            organization: "Stanford University",
            department: "Department of Management Science and Engineering",
            endDate: "2009"
          }
        ],
        education: [
          {
            degree: "Ph.D.",
            field: "Operations Research",
            institution: "Stanford University"
          },
          {
            degree: "B.S.",
            field: "Physics",
            institution: "Yale University"
          }
        ],
        specializations: [
          "Decision Analysis",
          "Risk Analysis",
          "Environmental Risk Assessment",
          "Nuclear Waste Management",
          "Energy Policy"
        ],
        clients: [
          "Electric utilities (US and Mexico)",
          "Petroleum industry",
          "Chemical industry",
          "US Environmental Protection Agency",
          "US Nuclear Waste Technical Review Board"
        ]
      },
      awards: [
        {
          name: "Frank P. Ramsey Medal",
          organization: "Decision Analysis Society",
          year: "1997",
          description: "For lifetime contributions to the field of decision analysis"
        },
        {
          name: "Outstanding Risk Practitioner Award",
          organization: "Society for Risk Analysis",
          year: "1999"
        },
        {
          name: "Best Book Reviewer Award",
          organization: "Society for Risk Analysis",
          year: "2014"
        }
      ],
      publications: profile.publications,
      boardMemberships: profile.boardMemberships,
      currentActivities: profile.currentActivities,
      media: {
        images: frontMatter.images?.map(img => ({
          url: img.src,
          width: img.width,
          height: img.height,
          type: determineImageType(img.src),
          alt: generateImageAlt(img.src)
        })) || []
      },
      tags: [
        "Risk Analysis",
        "Decision Analysis",
        "Environmental Protection",
        "Nuclear Waste Management",
        "Stanford University",
        "EPA",
        "Academic Research",
        "Government Consulting"
      ],
      legacy: {
        originalFile: "w_main.md",
        images: frontMatter.images?.length || 0
      }
    };
    
    // Write to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log(`💾 Saved profile data to: ${outputFile}`);
    
    // Generate summary
    generateProfileStats(jsonData);
    
  } catch (error) {
    console.error('❌ Error extracting profile:', error);
    process.exit(1);
  }
}

/**
 * Parse profile content into structured sections
 */
function parseProfileContent(content) {
  const sections = content.split('####').map(section => section.trim()).filter(section => section);
  
  const profile = {
    mainBio: '',
    publications: [],
    boardMemberships: [],
    currentActivities: []
  };
  
  // Extract main biography (first large paragraph)
  const bioMatch = content.match(/D\. Warner North is principal scientist[\s\S]*?(?=####|\n\*\*\*|\n#{2,}|$)/);
  if (bioMatch) {
    profile.mainBio = bioMatch[0].trim();
  }
  
  // Parse each section
  sections.forEach(section => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    
    const heading = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    
    if (heading.includes('Sustainable Fuel Cycle Task Force')) {
      profile.currentActivities.push({
        title: 'Science Panel Member',
        organization: 'Sustainable Fuel Cycle Task Force',
        description: content,
        type: 'panel-membership'
      });
    } else if (heading.includes('Blue Ribbon Commission')) {
      profile.currentActivities.push({
        title: 'Commission Participant',
        organization: "Blue Ribbon Commission on America's Nuclear Future",
        description: content,
        type: 'commission-participation'
      });
    } else if (heading.includes('Society for Risk Analysis')) {
      profile.currentActivities.push({
        title: 'Area Editor',
        organization: 'Society for Risk Analysis',
        description: content,
        type: 'editorial-role'
      });
    } else if (heading.includes('National Research Council')) {
      profile.boardMemberships.push({
        organization: 'National Research Council',
        role: 'Committee Member',
        description: content,
        focus: 'Shale gas development workshops'
      });
    } else if (heading.includes('International Risk Governance Council')) {
      profile.boardMemberships.push({
        organization: 'International Risk Governance Council',
        role: 'Scientific and Technical Council Member',
        period: 'March 2006 to June 2012',
        description: content
      });
    } else if (heading.includes('Risk from Toxic Substances') || heading.includes('NS3')) {
      profile.currentActivities.push({
        title: 'Symposium Participant',
        organization: 'Various Scientific Symposia',
        description: content,
        type: 'conference-participation'
      });
    } else if (heading.includes('Energy Security')) {
      profile.currentActivities.push({
        title: 'Session Chair',
        organization: 'International Association of Energy Economists',
        description: content,
        type: 'conference-leadership'
      });
    } else {
      // Generic activity
      profile.currentActivities.push({
        title: heading,
        description: content,
        type: 'other'
      });
    }
  });
  
  // Extract publications from the content
  profile.publications = extractPublications(content);
  
  return profile;
}

/**
 * Extract publications from content
 */
function extractPublications(content) {
  const publications = [];
  
  // Look for publication patterns
  const pubPatterns = [
    /Risk Assessment in the Federal Government: Managing the Process.*?\(1983\)/,
    /Improving Risk Communication.*?\(1989\)/,
    /Science and Judgment in Risk Assessment.*?\(1994\)/,
    /Understanding Risk: Informing Decisions in a Democratic Society.*?\(1996\)/,
    /Public Participation in Environmental Assessment and Decision Making.*?\(2008\)/,
    /Disposition of High-Level Waste and Spent Nuclear Fuel.*?\(2001\)/
  ];
  
  pubPatterns.forEach(pattern => {
    const match = content.match(pattern);
    if (match) {
      const fullMatch = match[0];
      const yearMatch = fullMatch.match(/\((\d{4})\)/);
      const year = yearMatch ? yearMatch[1] : null;
      
      publications.push({
        title: fullMatch.replace(/\(\d{4}\)/, '').trim(),
        year: year,
        type: 'report',
        organization: 'National Research Council'
      });
    }
  });
  
  // Add specific Risk Analysis publications mentioned
  if (content.includes('Risk Analysis') && content.includes('2013')) {
    publications.push({
      title: 'Can Sisyphus Succeed? Getting U.S. High-Level Nuclear Waste into a Geological Repository',
      journal: 'Risk Analysis',
      volume: '33(1):2-14',
      year: '2013',
      type: 'journal-article'
    });
  }
  
  return publications;
}

/**
 * Determine image type from filename
 */
function determineImageType(src) {
  if (src.includes('title-')) return 'title';
  if (src.includes('warner-north')) return 'portrait';
  if (src.includes('speaking')) return 'professional';
  if (src.includes('title-advisory')) return 'section-header';
  return 'professional';
}

/**
 * Generate alt text for images
 */
function generateImageAlt(src) {
  if (src.includes('title-warner')) return 'Warner North title banner';
  if (src.includes('warner-north-6-06')) return 'D. Warner North portrait photo';
  if (src.includes('speaking-belgian-senate')) return 'Dr. North speaking at Belgian Senate';
  if (src.includes('title-advisory')) return 'Advisory Boards section title';
  return 'Professional photo';
}

/**
 * Generate summary statistics
 */
function generateProfileStats(profile) {
  console.log('\n📊 Profile Statistics:');
  console.log(`Current activities: ${profile.currentActivities.length}`);
  console.log(`Board memberships: ${profile.boardMemberships.length}`);
  console.log(`Publications: ${profile.publications.length}`);
  console.log(`Awards: ${profile.awards.length}`);
  console.log(`Images: ${profile.media.images.length}`);
  console.log(`Tags: ${profile.tags.length}`);
  
  console.log('\nActivity types:');
  const activityTypes = {};
  profile.currentActivities.forEach(activity => {
    const type = activity.type || 'other';
    activityTypes[type] = (activityTypes[type] || 0) + 1;
  });
  
  Object.entries(activityTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
}

// Run the extraction
if (require.main === module) {
  extractProfileToJson();
}

module.exports = { extractProfileToJson };
