#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * SUPERIOR Warner Content Extraction
 * Deep structural analysis of professional portfolio content with precise semantic parsing
 */
async function extractWarnerSuperiorContent() {
  console.log('🎯 SUPERIOR WARNER CONTENT EXTRACTION');
  console.log('='.repeat(60));
  
  try {
    // Find all w_* files
    const contentDir = path.join(__dirname, '../public/content');
    const warnerFiles = fs.readdirSync(contentDir)
      .filter(file => file.startsWith('w_'))
      .map(file => path.join(contentDir, file));
    
    console.log(`Processing ${warnerFiles.length} Warner files for superior extraction`);
    
    const superiorData = {
      metadata: {
        id: "warner_content_superior",
        type: "professional_portfolio_comprehensive",
        category: "professional",
        subcategory: "executive-portfolio",
        status: "published",
        extractionVersion: "superior_structural",
        extractionDate: new Date().toISOString()
      },
      content: {
        title: "D. Warner North - Comprehensive Professional Portfolio",
        summary: "Complete professional biography with structured extraction of career achievements, expertise, publications, and professional activities",
        body: "Superior extraction utilizing deep structural analysis and semantic parsing of professional content."
      },
      profile: {
        personalInfo: {},
        currentPosition: {},
        education: [],
        expertise: [],
        careerHighlights: [],
        awards: [],
        leadership: []
      },
      professional: {
        projects: [],
        publications: [],
        positions: [],
        affiliations: [],
        boards: [],
        committees: [],
        speaking: [],
        consulting: []
      },
      analytics: {
        timespan: {},
        organizations: {},
        domains: {},
        statistics: {}
      }
    };
    
    // Process each file with superior structural analysis
    for (const filePath of warnerFiles) {
      const fileName = path.basename(filePath);
      console.log(`📄 Processing: ${fileName}`);
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontMatter, content } = matter(fileContent);
        
        // Apply specialized extraction based on file content and structure
        await extractSuperiorStructuralContent(superiorData, content, fileName, frontMatter);
        
      } catch (error) {
        console.warn(`⚠️  Error processing ${fileName}:`, error.message);
      }
    }
    
    // Post-processing: Clean, deduplicate, and enhance data
    cleanAndEnhanceData(superiorData);
    
    // Generate comprehensive analytics
    generateAnalytics(superiorData);
    
    console.log('\n📊 Superior Extraction Results:');
    printSummaryStats(superiorData);
    
    // Save superior data
    const outputPath = path.join(__dirname, '../src/data/warner-portfolio-superior.json');
    fs.writeFileSync(outputPath, JSON.stringify(superiorData, null, 2));
    console.log(`\n💾 Saved superior portfolio to: ${outputPath}`);
    
    generateSuperiorAnalysis(superiorData);
    
  } catch (error) {
    console.error('❌ Error in superior extraction:', error);
    process.exit(1);
  }
}

/**
 * Extract content using superior structural analysis
 */
async function extractSuperiorStructuralContent(data, content, fileName, frontMatter) {
  // Clean content for processing
  const cleanContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/\*+/g, ''); // Remove markdown formatting
  
  if (fileName === 'w_main.md') {
    extractMainBiographyContent(data, cleanContent);
  } else if (fileName === 'w_background.md') {
    extractBackgroundContent(data, cleanContent);
  } else if (fileName === 'w_projects.md') {
    extractProjectsAndExperience(data, cleanContent);
  } else if (fileName.includes('pub')) {
    extractPublicationsContent(data, cleanContent, fileName);
  }
  
  // Extract general professional information from all files
  extractGeneralProfessionalContent(data, cleanContent, fileName);
}

/**
 * Extract main biography with sophisticated parsing
 */
function extractMainBiographyContent(data, content) {
  const sections = splitIntoSections(content);
  
  // Main bio paragraph
  const bioMatch = content.match(/D\. Warner North is principal scientist[\s\S]*?environmental protection\./);
  if (bioMatch) {
    data.profile.personalInfo = {
      overview: bioMatch[0],
      currentTitle: "Principal Scientist",
      company: "NorthWorks",
      location: "San Francisco, California",
      formerPosition: "Consulting Professor, Department of Management Science and Engineering, Stanford University (until 2009)",
      experienceYears: "Over fifty years",
      domains: ["decision analysis", "risk analysis", "electric utilities", "petroleum industry", "chemical industries", "government agencies", "energy", "environmental protection"]
    };
    
    data.profile.currentPosition = {
      title: "Principal Scientist",
      organization: "NorthWorks",
      type: "consulting_firm",
      location: "San Francisco, California",
      description: "Principal scientist of NorthWorks, a consulting firm",
      startDate: "2009" // When he left Stanford
    };
  }
  
  // Extract specific achievements and positions
  extractAchievementsFromBio(data, content);
  extractEducationFromBio(data, content);
  extractCommitteesAndBoards(data, content);
  extractPublicationsFromBio(data, content);
  extractSpecializedSections(data, content);
}

/**
 * Extract background/credentials content
 */
function extractBackgroundContent(data, content) {
  // Management Experience
  const mgmtMatch = content.match(/MANAGEMENT EXPERIENCE\*\*([\s\S]*?)ACADEMIC BACKGROUND/);
  if (mgmtMatch) {
    const mgmtText = mgmtMatch[1];
    
    // President position
    const presMatch = mgmtText.match(/President, Decision Focus Incorporated \(([^)]+)\)/);
    if (presMatch) {
      data.professional.positions.push({
        title: "President",
        organization: "Decision Focus Incorporated",
        period: presMatch[1],
        type: "executive_leadership",
        description: "President of Decision Focus Incorporated",
        source: "w_background.md"
      });
    }
    
    // Senior VP position
    const vpMatch = mgmtText.match(/Senior Vice President.*?(\d{4}-\d{4})/);
    if (vpMatch) {
      data.professional.positions.push({
        title: "Senior Vice President",
        organization: "Decision Focus Incorporated",
        period: vpMatch[1],
        type: "executive_leadership",
        description: "Senior Vice President at Decision Focus Incorporated",
        source: "w_background.md"
      });
    }
    
    // Assistant Director
    const dirMatch = mgmtText.match(/Assistant Director, Decision Analysis \(([^)]+)\) at Stanford Research Institute/);
    if (dirMatch) {
      data.professional.positions.push({
        title: "Assistant Director, Decision Analysis",
        organization: "Stanford Research Institute",
        period: dirMatch[1],
        type: "management",
        description: "Assistant Director of Decision Analysis at Stanford Research Institute",
        source: "w_background.md"
      });
    }
  }
  
  // Academic Background
  const acadMatch = content.match(/ACADEMIC BACKGROUND\*\*([\s\S]*?)PROFESSIONAL ASSOCIATIONS/);
  if (acadMatch) {
    extractEducationDetailed(data, acadMatch[1]);
  }
  
  // Professional Associations and Honors
  const profMatch = content.match(/PROFESSIONAL ASSOCIATIONS AND HONORS\*\*([\s\S]*?)$/);
  if (profMatch) {
    extractAwardsAndHonors(data, profMatch[1]);
    extractProfessionalAssociations(data, profMatch[1]);
  }
}

/**
 * Extract projects and experience with client organization recognition
 */
function extractProjectsAndExperience(data, content) {
  // Extract specialties statement
  const specialtiesMatch = content.match(/Dr\. North's specialties are ([^.]+)\./);
  if (specialtiesMatch) {
    const specialties = specialtiesMatch[1].split(';').map(s => s.trim());
    data.profile.expertise = specialties.map(specialty => ({
      area: specialty,
      type: "core_specialty",
      description: `Core professional specialty: ${specialty}`,
      source: "w_projects.md"
    }));
  }
  
  // Extract client organizations and projects
  extractClientProjects(data, content);
}

/**
 * Extract client projects with logo/organization matching
 */
function extractClientProjects(data, content) {
  // Split content into sections, each starting with an organization
  const lines = content.split('\n').filter(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for organization names followed by asterisks (bold formatting)
    if (line.includes('**') && !line.includes('![') && line.length > 10 && line.length < 200) {
      const orgLine = line.replace(/\*+/g, '').trim();
      
      // Get the description from the same line or next line
      let description = '';
      const parts = orgLine.split('**');
      if (parts.length >= 2) {
        const organization = parts[0].trim();
        description = parts.slice(1).join('').trim();
        
        if (organization && description && description.length > 20) {
          // Determine project type and domain
          const domain = classifyProjectDomain(organization, description);
          const type = classifyProjectType(organization, description);
          const clientType = classifyClientType(organization);
          
          data.professional.projects.push({
            organization: organization,
            description: description,
            domain: domain,
            type: type,
            client_type: clientType,
            keywords: extractKeywordsFromText(description),
            source: "w_projects.md"
          });
        }
      }
    }
  }
  
  console.log(`Extracted ${data.professional.projects.length} projects from w_projects.md`);
}

/**
 * Extract publications with sophisticated parsing
 */
function extractPublicationsContent(data, content, fileName) {
  // Find publication entries with various formats
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Publication titles (quoted or bold)
    if ((line.includes('"') || line.includes('**')) && line.length > 20) {
      const title = extractPublicationTitle(line);
      if (title) {
        const nextLines = lines.slice(i + 1, i + 4).join(' ');
        const pub = parsePublication(title, nextLines, fileName);
        if (pub) {
          data.professional.publications.push(pub);
        }
      }
    }
  }
}

/**
 * Helper functions for classification and parsing
 */
function classifyProjectDomain(organization, description) {
  const text = (organization + ' ' + description).toLowerCase();
  
  if (text.includes('nuclear') || text.includes('waste') || text.includes('radioactive')) return 'nuclear';
  if (text.includes('environment') || text.includes('epa') || text.includes('pollution')) return 'environmental';
  if (text.includes('energy') || text.includes('electric') || text.includes('utilities')) return 'energy';
  if (text.includes('government') || text.includes('federal') || text.includes('state')) return 'government';
  if (text.includes('risk') || text.includes('decision') || text.includes('analysis')) return 'risk_analysis';
  if (text.includes('research') || text.includes('university') || text.includes('academic')) return 'research';
  
  return 'general';
}

function classifyProjectType(organization, description) {
  const text = (organization + ' ' + description).toLowerCase();
  
  if (text.includes('consultant') || text.includes('consulting')) return 'consulting';
  if (text.includes('member') || text.includes('board') || text.includes('committee')) return 'advisory';
  if (text.includes('supervisor') || text.includes('leader') || text.includes('principal investigator')) return 'leadership';
  if (text.includes('testimony') || text.includes('presentation')) return 'expert_witness';
  if (text.includes('research') || text.includes('study')) return 'research';
  
  return 'professional_service';
}

function classifyClientType(organization) {
  const org = organization.toLowerCase();
  
  if (org.includes('epa') || org.includes('doe') || org.includes('government') || org.includes('federal')) return 'federal_government';
  if (org.includes('state') || org.includes('california') || org.includes('massachusetts')) return 'state_government';
  if (org.includes('university') || org.includes('stanford') || org.includes('research')) return 'academic';
  if (org.includes('institute') || org.includes('epri') || org.includes('laboratory')) return 'research_institute';
  if (org.includes('association') || org.includes('society') || org.includes('council')) return 'professional_association';
  if (org.includes('inc') || org.includes('corporation') || org.includes('company')) return 'private_sector';
  
  return 'other';
}

function extractAchievementsFromBio(data, content) {
  // Awards and recognitions
  const awardPatterns = [
    /Frank P\. Ramsey Medal from the Decision Analysis Society in (\d{4})/,
    /Outstanding Risk Practitioner Award from the Society for Risk Analysis/,
    /past president \(([^)]+)\) of the international Society for Risk Analysis/
  ];
  
  awardPatterns.forEach(pattern => {
    const match = content.match(pattern);
    if (match) {
      data.profile.awards.push({
        award: match[0],
        year: match[1] || null,
        organization: extractOrganizationFromAward(match[0]),
        type: 'professional_recognition',
        source: 'w_main.md'
      });
    }
  });
}

function extractEducationFromBio(data, content) {
  const eduMatches = content.match(/Ph\.D\. in operations research from Stanford University and.*?B\.S\. in physics from Yale University/);
  if (eduMatches) {
    data.profile.education.push(
      {
        degree: "Ph.D.",
        field: "Operations Research",
        institution: "Stanford University",
        type: "doctoral",
        source: "w_main.md"
      },
      {
        degree: "B.S.",
        field: "Physics",
        institution: "Yale University",
        type: "undergraduate",
        source: "w_main.md"
      }
    );
  }
}

function extractEducationDetailed(data, academicText) {
  // PhD details
  const phdMatch = academicText.match(/Ph\.D\., Operations Research, Stanford University \((\d{4})\);([^.]+)\./);
  if (phdMatch) {
    data.profile.education.push({
      degree: "Ph.D.",
      field: "Operations Research",
      institution: "Stanford University",
      year: phdMatch[1],
      specialization: phdMatch[2].trim(),
      type: "doctoral",
      source: "w_background.md"
    });
  }
  
  // MS degrees
  const msMatch = academicText.match(/M\.S\., Physics \((\d{4})\) and Mathematics \((\d{4})\), Stanford University/);
  if (msMatch) {
    data.profile.education.push(
      {
        degree: "M.S.",
        field: "Physics",
        institution: "Stanford University",
        year: msMatch[1],
        type: "masters",
        source: "w_background.md"
      },
      {
        degree: "M.S.",
        field: "Mathematics",
        institution: "Stanford University",
        year: msMatch[2],
        type: "masters",
        source: "w_background.md"
      }
    );
  }
  
  // BS degree
  const bsMatch = academicText.match(/B\.S\., Physics, Yale University \((\d{4})\)/);
  if (bsMatch) {
    data.profile.education.push({
      degree: "B.S.",
      field: "Physics",
      institution: "Yale University",
      year: bsMatch[1],
      type: "undergraduate",
      source: "w_background.md"
    });
  }
}

function extractAwardsAndHonors(data, honorsText) {
  const awards = [
    /Outstanding Risk Practitioner Award from the Society for Risk Analysis, (\d{4})/,
    /Frank P\. Ramsey Medal.*?awarded in (\d{4}) by the Decision Analysis Society/,
    /Presidential appointee.*?Nuclear Waste Technical Review Board, (\d{4}) - (\w+, \d{4})/
  ];
  
  awards.forEach(pattern => {
    const match = honorsText.match(pattern);
    if (match) {
      data.profile.awards.push({
        award: match[0].split(',')[0],
        year: match[1],
        organization: extractOrganizationFromAward(match[0]),
        type: getAwardType(match[0]),
        description: match[0],
        source: "w_background.md"
      });
    }
  });
}

function extractProfessionalAssociations(data, honorsText) {
  const lines = honorsText.split('\n').filter(line => line.trim().length > 10);
  
  lines.forEach(line => {
    const cleanLine = line.trim();
    
    // Skip lines that are clearly not associations
    if (cleanLine.includes('Presidential appointee') || 
        cleanLine.includes('Frank P.') || 
        cleanLine.includes('Outstanding Risk') ||
        cleanLine.includes('National Science Foundation')) {
      return;
    }
    
    // Look for society/association memberships
    if (cleanLine.includes('Society') || cleanLine.includes('Association') || 
        cleanLine.includes('Board') || cleanLine.includes('Sigma Xi') || 
        cleanLine.includes('Phi Beta Kappa')) {
      
      data.professional.affiliations.push({
        organization: extractOrganizationName(cleanLine),
        roles: extractRoles(cleanLine),
        description: cleanLine,
        type: 'professional_association',
        source: 'w_background.md'
      });
    }
  });
}

// Additional specialized extraction functions
function extractCommitteesAndBoards(data, content) {
  const boardPatterns = [
    /member of the Board on Radioactive Waste Management.*?from (\d{4}) until (\d{4})/,
    /Science Advisory Board of the US Environmental Protection Agency since (\d{4})/,
    /Nuclear Waste Technical Review Board \((\d{4})-(\d{4})\)/
  ];
  
  boardPatterns.forEach(pattern => {
    const match = content.match(pattern);
    if (match) {
      data.professional.boards.push({
        board: extractBoardName(match[0]),
        period: match[1] + (match[2] ? `-${match[2]}` : '-present'),
        type: 'advisory_board',
        description: match[0],
        source: 'w_main.md'
      });
    }
  });
}

function extractPublicationsFromBio(data, content) {
  const pubPattern = /co-author of many reports.*?including ([^.]+)\./;
  const match = content.match(pubPattern);
  if (match) {
    const reports = match[1].split(',').map(r => r.trim());
    reports.forEach(report => {
      const yearMatch = report.match(/\((\d{4})\)/);
      data.professional.publications.push({
        title: report.replace(/\(\d{4}\)/, '').trim(),
        year: yearMatch ? yearMatch[1] : null,
        type: 'government_report',
        organization: 'National Research Council of the National Academy of Sciences',
        source: 'w_main.md'
      });
    });
  }
}

function extractSpecializedSections(data, content) {
  // Extract specialized sections like "Sustainable Fuel Cycle Task Force"
  const sections = content.split(/####\s+/);
  sections.forEach(section => {
    const lines = section.split('\n');
    const title = lines[0]?.trim();
    if (title && title.length > 5) {
      const description = lines.slice(1).join(' ').trim();
      if (description.length > 50) {
        data.professional.committees.push({
          committee: title,
          description: description.substring(0, 500),
          type: 'specialized_service',
          source: 'w_main.md'
        });
      }
    }
  });
}

// Utility functions
function splitIntoSections(content) {
  return content.split(/\*{3,}|\#{2,}/).filter(section => section.trim().length > 50);
}

function extractKeywordsFromText(text) {
  const keywords = [
    'risk analysis', 'decision analysis', 'environmental', 'nuclear', 'energy',
    'safety', 'policy', 'research', 'consulting', 'government', 'assessment',
    'management', 'science', 'technology', 'waste', 'regulation', 'protection'
  ];
  
  return keywords.filter(keyword => 
    text.toLowerCase().includes(keyword)
  ).slice(0, 5);
}

function extractPublicationTitle(line) {
  // Extract title from various formats
  if (line.includes('"')) {
    const match = line.match(/"([^"]+)"/);
    return match ? match[1] : null;
  }
  if (line.includes('**')) {
    const match = line.match(/\*\*([^*]+)\*\*/);
    return match ? match[1] : null;
  }
  return null;
}

function parsePublication(title, context, fileName) {
  const yearMatch = context.match(/\b(19|20)\d{2}\b/);
  const journalMatch = context.match(/\*\*([^*]+)\*\*/);
  
  return {
    title: title,
    year: yearMatch ? yearMatch[0] : null,
    journal: journalMatch ? journalMatch[1] : null,
    context: context.substring(0, 200),
    type: 'academic_publication',
    source: fileName
  };
}

function extractOrganizationFromAward(awardText) {
  const patterns = [
    /from the ([^,]+)/,
    /by the ([^,]+)/,
    /Society for Risk Analysis/,
    /Decision Analysis Society/
  ];
  
  for (const pattern of patterns) {
    const match = awardText.match(pattern);
    if (match) return match[1] || match[0];
  }
  return 'Unknown Organization';
}

function getAwardType(awardText) {
  if (awardText.includes('Medal')) return 'medal';
  if (awardText.includes('Award')) return 'award';
  if (awardText.includes('president')) return 'leadership';
  if (awardText.includes('appointee')) return 'appointment';
  return 'recognition';
}

function extractOrganizationName(text) {
  const orgPatterns = [
    /Society for [^,]+/,
    /National [^,]+/,
    /Board[^,]+/,
    /Academy[^,]+/,
    /Institute[^,]+/
  ];
  
  for (const pattern of orgPatterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  
  return text.split(',')[0].trim();
}

function extractRoles(text) {
  const roles = [];
  const rolePatterns = [
    /president/i, /chair/i, /member/i, /director/i, /editor/i
  ];
  
  rolePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      roles.push(pattern.source.replace(/[^a-zA-Z]/g, ''));
    }
  });
  
  return roles;
}

function extractBoardName(text) {
  const boardPatterns = [
    /Board on [^,]+/,
    /Science Advisory Board[^,]+/,
    /Nuclear Waste Technical Review Board/
  ];
  
  for (const pattern of boardPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  
  return text.split(',')[0];
}

function extractGeneralProfessionalContent(data, content, fileName) {
  // Extract any additional professional information not caught by specialized extractors
  const sentences = content.split('.').filter(s => s.trim().length > 30);
  
  sentences.forEach(sentence => {
    if (sentence.includes('consultant') || sentence.includes('advisor')) {
      // Check if this is a new consulting role
      const consultingRole = {
        description: sentence.trim(),
        type: 'consulting',
        source: fileName
      };
      
      // Only add if not already captured
      if (!isDuplicate(data.professional.consulting, consultingRole)) {
        data.professional.consulting.push(consultingRole);
      }
    }
  });
}

function isDuplicate(array, item) {
  return array.some(existing => 
    existing.description && item.description && 
    existing.description.substring(0, 50) === item.description.substring(0, 50)
  );
}

/**
 * Clean and enhance extracted data
 */
function cleanAndEnhanceData(data) {
  // Remove duplicates
  data.professional.projects = removeDuplicates(data.professional.projects, 'organization');
  data.professional.publications = removeDuplicates(data.professional.publications, 'title');
  data.professional.positions = removeDuplicates(data.professional.positions, 'title');
  
  // Sort by relevance/date
  if (data.profile.education.length > 0) {
    data.profile.education.sort((a, b) => (b.year || 0) - (a.year || 0));
  }
  
  if (data.profile.awards.length > 0) {
    data.profile.awards.sort((a, b) => (b.year || 0) - (a.year || 0));
  }
  
  console.log('✨ Data cleaned and enhanced with superior algorithms');
}

function removeDuplicates(array, keyField) {
  const seen = new Set();
  return array.filter(item => {
    const key = item[keyField]?.toLowerCase() || '';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Generate comprehensive analytics
 */
function generateAnalytics(data) {
  const analytics = data.analytics;
  
  // Time span analysis
  const years = [
    ...data.profile.education.map(e => e.year).filter(Boolean),
    ...data.professional.publications.map(p => p.year).filter(Boolean),
    ...data.profile.awards.map(a => a.year).filter(Boolean)
  ].map(y => parseInt(y)).filter(y => !isNaN(y));
  
  if (years.length > 0) {
    analytics.timespan = {
      earliest: Math.min(...years),
      latest: Math.max(...years),
      span: Math.max(...years) - Math.min(...years),
      decades: Math.ceil((Math.max(...years) - Math.min(...years)) / 10)
    };
  }
  
  // Organization analysis
  const organizations = [
    ...data.professional.projects.map(p => p.organization),
    ...data.professional.positions.map(p => p.organization),
    ...data.professional.affiliations.map(a => a.organization)
  ].filter(Boolean);
  
  analytics.organizations = {
    total: new Set(organizations).size,
    mostFrequent: getMostFrequent(organizations),
    byType: countByType(data.professional.projects, 'client_type')
  };
  
  // Domain analysis
  const domains = data.professional.projects.map(p => p.domain).filter(Boolean);
  analytics.domains = {
    total: new Set(domains).size,
    distribution: countOccurrences(domains)
  };
  
  // Statistics
  analytics.statistics = {
    totalProjects: data.professional.projects.length,
    totalPublications: data.professional.publications.length,
    totalPositions: data.professional.positions.length,
    totalAffiliations: data.professional.affiliations.length,
    totalAwards: data.profile.awards.length,
    educationLevels: data.profile.education.length,
    expertiseAreas: data.profile.expertise.length
  };
}

function getMostFrequent(array) {
  const counts = countOccurrences(array);
  const max = Math.max(...Object.values(counts));
  return Object.keys(counts).find(key => counts[key] === max);
}

function countOccurrences(array) {
  return array.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function countByType(array, typeField) {
  return array.reduce((acc, item) => {
    const type = item[typeField] || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Print summary statistics
 */
function printSummaryStats(data) {
  console.log(`Profile sections: ${Object.keys(data.profile).length}`);
  console.log(`Personal info fields: ${Object.keys(data.profile.personalInfo).length}`);
  console.log(`Education records: ${data.profile.education.length}`);
  console.log(`Expertise areas: ${data.profile.expertise.length}`);
  console.log(`Awards & honors: ${data.profile.awards.length}`);
  console.log(`Leadership roles: ${data.profile.leadership.length}`);
  console.log(`Professional projects: ${data.professional.projects.length}`);
  console.log(`Publications: ${data.professional.publications.length}`);
  console.log(`Positions held: ${data.professional.positions.length}`);
  console.log(`Affiliations: ${data.professional.affiliations.length}`);
  console.log(`Board memberships: ${data.professional.boards.length}`);
  console.log(`Committee roles: ${data.professional.committees.length}`);
  console.log(`Speaking engagements: ${data.professional.speaking.length}`);
  console.log(`Consulting roles: ${data.professional.consulting.length}`);
}

/**
 * Generate superior analysis report
 */
function generateSuperiorAnalysis(data) {
  console.log('\n📈 SUPERIOR ANALYSIS REPORT');
  console.log('='.repeat(40));
  
  const analytics = data.analytics;
  
  console.log('\n🎯 Career Overview:');
  if (analytics.timespan.earliest) {
    console.log(`  Career span: ${analytics.timespan.earliest} - ${analytics.timespan.latest} (${analytics.timespan.span} years)`);
    console.log(`  Professional decades: ${analytics.timespan.decades}`);
  }
  
  console.log('\n🏢 Organizational Reach:');
  console.log(`  Total organizations: ${analytics.organizations.total}`);
  console.log(`  Most frequent client: ${analytics.organizations.mostFrequent}`);
  
  console.log('\n📊 Professional Distribution:');
  Object.entries(analytics.organizations.byType).forEach(([type, count]) => {
    console.log(`    ${type}: ${count} projects`);
  });
  
  console.log('\n🎓 Education Profile:');
  data.profile.education.forEach(edu => {
    console.log(`  ${edu.degree} ${edu.field}, ${edu.institution} (${edu.year || 'date unknown'})`);
  });
  
  console.log('\n🏆 Recognition & Awards:');
  data.profile.awards.forEach(award => {
    console.log(`  ${award.year || '----'}: ${award.award}`);
  });
  
  console.log('\n🎯 Core Expertise:');
  data.profile.expertise.forEach(exp => {
    console.log(`  • ${exp.area}`);
  });
  
  console.log('\n✅ Superior Warner portfolio extraction complete!');
  console.log('🎯 Deep structural analysis with semantic understanding');
  console.log('📋 Comprehensive professional profile ready for executive presentation');
  console.log('🔍 Enhanced analytics and career intelligence extracted');
}

// Run the superior extraction
if (require.main === module) {
  extractWarnerSuperiorContent();
}

module.exports = { extractWarnerSuperiorContent };
