import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface TagAnalysis {
  currentTags: string[];
  suggestedTags: string[];
  reasoning: string;
  contentSummary: string;
}

interface FileAnalysis {
  filePath: string;
  slug: string;
  title: string;
  type: string;
  currentTags: string[];
  content: string;
  wordCount: number;
}

/**
 * AI-Powered Tag Generation System
 * 
 * This script analyzes existing content and generates meaningful tags using:
 * 1. Content analysis (entities, topics, themes)
 * 2. Context understanding (interview subjects, venues, composers)
 * 3. Professional categorization (expertise areas, methods)
 * 4. Quality scoring and recommendation
 */

// Enhanced tag categories for different content types
const TAG_CATEGORIES = {
  PEOPLE: {
    description: "Names of interviewed subjects, composers, performers, conductors",
    examples: ["Kurt Masur", "Susan Graham", "Iréne Theorin"]
  },
  MUSICAL_WORKS: {
    description: "Specific compositions, operas, symphonies",
    examples: ["Don Giovanni", "War Requiem", "Turandot", "Ring Cycle"]
  },
  COMPOSERS: {
    description: "Classical and contemporary composers",
    examples: ["Mozart", "Wagner", "Puccini", "Benjamin Britten"]
  },
  VENUES: {
    description: "Performance halls, opera houses, theaters",
    examples: ["San Francisco Opera", "Carnegie Hall", "Davies Symphony Hall"]
  },
  INSTRUMENTS: {
    description: "Musical instruments and voice types",
    examples: ["Piano", "Violin", "Soprano", "Mezzo-soprano"]
  },
  GENRES: {
    description: "Musical styles and performance types",
    examples: ["Opera", "Symphony", "Chamber Music", "Art Songs"]
  },
  PROFESSIONAL_AREAS: {
    description: "Warner's areas of expertise and methodologies",
    examples: ["Risk Assessment", "Decision Analysis", "Environmental Policy"]
  },
  ORGANIZATIONS: {
    description: "Government agencies, institutions, companies",
    examples: ["EPA", "Nuclear Regulatory Commission", "Stanford University"]
  },
  RESEARCH_METHODS: {
    description: "Technical approaches and methodologies",
    examples: ["Monte Carlo Simulation", "Cost-Benefit Analysis", "Fault Tree Analysis"]
  },
  SUBJECT_AREAS: {
    description: "Academic and professional domains",
    examples: ["Nuclear Safety", "Environmental Health", "Energy Policy"]
  }
};

// Quality indicators for good tags
const QUALITY_INDICATORS = {
  SPECIFIC: "Tags should be specific rather than generic",
  SEARCHABLE: "Tags should match what users would search for",
  CONSISTENT: "Tags should use consistent naming conventions",
  RELEVANT: "Tags should directly relate to the content",
  ACTIONABLE: "Tags should help users find related content"
};

class IntelligentTagGenerator {
  
  /**
   * Analyze content and suggest improved tags
   */
  static analyzeContent(fileData: FileAnalysis): TagAnalysis {
    const { content, type, currentTags, title } = fileData;
    
    let suggestedTags: string[] = [];
    let reasoning = "";
    
    // Extract entities and topics based on content type
    if (type === 'interview') {
      const analysis = this.analyzeInterview(content, title);
      suggestedTags = analysis.tags;
      reasoning = analysis.reasoning;
    } else if (type === 'article') {
      const analysis = this.analyzeArticle(content, title);
      suggestedTags = analysis.tags;
      reasoning = analysis.reasoning;
    } else if (type === 'review') {
      const analysis = this.analyzeReview(content, title);
      suggestedTags = analysis.tags;
      reasoning = analysis.reasoning;
    } else if (type === 'professional') {
      const analysis = this.analyzeProfessional(content, title);
      suggestedTags = analysis.tags;
      reasoning = analysis.reasoning;
    } else {
      const analysis = this.analyzeGeneral(content, title);
      suggestedTags = analysis.tags;
      reasoning = analysis.reasoning;
    }
    
    // Remove duplicates and clean up
    suggestedTags = [...new Set(suggestedTags)]
      .filter(tag => tag.length > 2)
      .sort();
    
    return {
      currentTags,
      suggestedTags,
      reasoning,
      contentSummary: this.generateSummary(content, title)
    };
  }
  
  /**
   * Analyze interview content for people, venues, topics
   */
  static analyzeInterview(content: string, title: string) {
    const tags: string[] = [];
    const text = content.toLowerCase();
    
    // Extract person being interviewed from title
    const intervieweeMatch = title.match(/interviews? (.+?)(?:\s|$|,)/i);
    if (intervieweeMatch) {
      tags.push(intervieweeMatch[1].trim());
    }
    
    // Musical entities
    const composers = this.extractComposers(content);
    const venues = this.extractVenues(content);
    const instruments = this.extractInstruments(content);
    const musicalWorks = this.extractMusicalWorks(content);
    
    tags.push(...composers, ...venues, ...instruments, ...musicalWorks);
    
    // Performance-related terms
    if (text.includes('opera')) tags.push('Opera');
    if (text.includes('symphony')) tags.push('Symphony');
    if (text.includes('concert')) tags.push('Concert Performance');
    if (text.includes('recital')) tags.push('Recital');
    
    const reasoning = `Interview analysis: Identified ${composers.length} composers, ${venues.length} venues, ${instruments.length} instruments. Focus on people, musical works, and performance context.`;
    
    return { tags, reasoning };
  }
  
  /**
   * Analyze article content for topics and analysis
   */
  static analyzeArticle(content: string, title: string) {
    const tags: string[] = [];
    
    const composers = this.extractComposers(content);
    const venues = this.extractVenues(content);
    const musicalWorks = this.extractMusicalWorks(content);
    const instruments = this.extractInstruments(content);
    
    tags.push(...composers, ...venues, ...musicalWorks, ...instruments);
    
    // Article-specific topics
    if (content.toLowerCase().includes('festival')) tags.push('Music Festival');
    if (content.toLowerCase().includes('review')) tags.push('Performance Review');
    if (content.toLowerCase().includes('analysis')) tags.push('Musical Analysis');
    
    const reasoning = `Article analysis: Focus on musical works, venues, and analytical content. Emphasizes critical discussion and cultural context.`;
    
    return { tags, reasoning };
  }
  
  /**
   * Analyze review content for performances and venues
   */
  static analyzeReview(content: string, title: string) {
    const tags: string[] = [];
    
    const composers = this.extractComposers(content);
    const venues = this.extractVenues(content);
    const musicalWorks = this.extractMusicalWorks(content);
    const performers = this.extractPerformers(content);
    
    tags.push(...composers, ...venues, ...musicalWorks, ...performers);
    tags.push('Performance Review');
    
    const reasoning = `Review analysis: Identified specific performance with venues, works, and performers. Tags focus on reviewable elements.`;
    
    return { tags, reasoning };
  }
  
  /**
   * Analyze professional content for expertise areas
   */
  static analyzeProfessional(content: string, title: string) {
    const tags: string[] = [];
    const text = content.toLowerCase();
    
    // Professional expertise areas
    const expertise = this.extractProfessionalExpertise(content);
    const organizations = this.extractOrganizations(content);
    const methods = this.extractResearchMethods(content);
    
    tags.push(...expertise, ...organizations, ...methods);
    
    // Professional categories
    if (text.includes('risk')) tags.push('Risk Analysis');
    if (text.includes('safety')) tags.push('Safety Assessment');
    if (text.includes('environmental')) tags.push('Environmental Policy');
    if (text.includes('nuclear')) tags.push('Nuclear Technology');
    if (text.includes('decision')) tags.push('Decision Making');
    
    const reasoning = `Professional analysis: Focus on expertise areas, methodologies, and institutional affiliations. Emphasizes technical competencies.`;
    
    return { tags, reasoning };
  }
  
  /**
   * General content analysis fallback
   */
  static analyzeGeneral(content: string, title: string) {
    const tags: string[] = [];
    
    // Extract any recognizable entities
    const composers = this.extractComposers(content);
    const venues = this.extractVenues(content);
    
    tags.push(...composers, ...venues);
    
    const reasoning = `General analysis: Basic entity extraction for unspecified content type.`;
    
    return { tags, reasoning };
  }
  
  // Entity extraction methods
  static extractComposers(content: string): string[] {
    const composers = [
      'Mozart', 'Wolfgang Amadeus Mozart', 'Beethoven', 'Ludwig van Beethoven',
      'Wagner', 'Richard Wagner', 'Puccini', 'Giacomo Puccini',
      'Verdi', 'Giuseppe Verdi', 'Bach', 'Johann Sebastian Bach',
      'Brahms', 'Johannes Brahms', 'Mahler', 'Gustav Mahler',
      'Britten', 'Benjamin Britten', 'Strauss', 'Richard Strauss',
      'Berg', 'Alban Berg', 'Schubert', 'Franz Schubert'
    ];
    
    return composers.filter(composer => 
      content.toLowerCase().includes(composer.toLowerCase())
    );
  }
  
  static extractVenues(content: string): string[] {
    const venues = [
      'San Francisco Opera', 'San Francisco Symphony', 'Carnegie Hall',
      'Davies Symphony Hall', 'War Memorial Opera House', 'Lincoln Center',
      'Metropolitan Opera', 'Vienna State Opera', 'Royal Opera House',
      'Berkeley Opera', 'Oakland East Bay Symphony'
    ];
    
    return venues.filter(venue => 
      content.toLowerCase().includes(venue.toLowerCase())
    );
  }
  
  static extractInstruments(content: string): string[] {
    const instruments = [
      'Piano', 'Violin', 'Cello', 'Flute', 'Trumpet', 'Horn',
      'Soprano', 'Mezzo-soprano', 'Tenor', 'Baritone', 'Bass'
    ];
    
    return instruments.filter(instrument => 
      content.toLowerCase().includes(instrument.toLowerCase())
    );
  }
  
  static extractMusicalWorks(content: string): string[] {
    const works = [
      'Don Giovanni', 'The Magic Flute', 'Marriage of Figaro',
      'Ring Cycle', 'Tristan and Isolde', 'Parsifal',
      'La Bohème', 'Tosca', 'Turandot', 'Madama Butterfly',
      'War Requiem', 'Ninth Symphony', 'Eroica', 'Jupiter Symphony'
    ];
    
    return works.filter(work => 
      content.toLowerCase().includes(work.toLowerCase())
    );
  }
  
  static extractPerformers(content: string): string[] {
    // This would need more sophisticated NLP in practice
    const performers: string[] = [];
    
    // Look for patterns like "soprano [Name]", "conductor [Name]"
    const performerPatterns = [
      /soprano\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /conductor\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
      /pianist\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
    ];
    
    performerPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) performers.push(match[1]);
      }
    });
    
    return performers;
  }
  
  static extractProfessionalExpertise(content: string): string[] {
    const expertise = [
      'Risk Assessment', 'Decision Analysis', 'Environmental Policy',
      'Nuclear Safety', 'Energy Policy', 'Cost-Benefit Analysis',
      'Monte Carlo Simulation', 'Fault Tree Analysis', 'Uncertainty Analysis'
    ];
    
    return expertise.filter(area => 
      content.toLowerCase().includes(area.toLowerCase())
    );
  }
  
  static extractOrganizations(content: string): string[] {
    const orgs = [
      'EPA', 'Environmental Protection Agency',
      'Nuclear Regulatory Commission', 'NRC',
      'Stanford University', 'EPRI', 'Electric Power Research Institute'
    ];
    
    return orgs.filter(org => 
      content.toLowerCase().includes(org.toLowerCase())
    );
  }
  
  static extractResearchMethods(content: string): string[] {
    const methods = [
      'Monte Carlo Simulation', 'Sensitivity Analysis', 'Uncertainty Analysis',
      'Cost-Benefit Analysis', 'Risk-Benefit Analysis', 'Decision Trees',
      'Fault Tree Analysis', 'Event Tree Analysis'
    ];
    
    return methods.filter(method => 
      content.toLowerCase().includes(method.toLowerCase())
    );
  }
  
  static generateSummary(content: string, title: string): string {
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    
    return `${title} (${wordCount} words, ${sentences} sentences)`;
  }
}

/**
 * Main analysis function
 */
export async function analyzeAllTags(): Promise<void> {
  const contentDir = path.join(process.cwd(), 'public', 'content');
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
  
  const analyses: Array<FileAnalysis & { analysis: TagAnalysis }> = [];
  
  console.log('🔍 Analyzing content files for tag improvements...\n');
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    const fileData: FileAnalysis = {
      filePath,
      slug: file.replace('.md', ''),
      title: frontmatter.title || 'Untitled',
      type: frontmatter.type || 'unknown',
      currentTags: frontmatter.subjects || [],
      content,
      wordCount: content.split(/\s+/).length
    };
    
    const analysis = IntelligentTagGenerator.analyzeContent(fileData);
    
    analyses.push({ ...fileData, analysis });
  }
  
  // Generate report
  generateTagReport(analyses);
}

function generateTagReport(analyses: Array<FileAnalysis & { analysis: TagAnalysis }>): void {
  console.log('📊 TAG ANALYSIS REPORT');
  console.log('='.repeat(50));
  
  // Summary statistics
  const totalFiles = analyses.length;
  const filesWithTags = analyses.filter(a => a.currentTags.length > 0).length;
  const avgCurrentTags = analyses.reduce((sum, a) => sum + a.currentTags.length, 0) / totalFiles;
  const avgSuggestedTags = analyses.reduce((sum, a) => sum + a.analysis.suggestedTags.length, 0) / totalFiles;
  
  console.log(`\n📈 SUMMARY STATISTICS:`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Files with existing tags: ${filesWithTags} (${(filesWithTags/totalFiles*100).toFixed(1)}%)`);
  console.log(`Average current tags per file: ${avgCurrentTags.toFixed(1)}`);
  console.log(`Average suggested tags per file: ${avgSuggestedTags.toFixed(1)}`);
  
  // Content type breakdown
  const typeStats = analyses.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`\n📚 CONTENT TYPES:`);
  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`${type}: ${count} files`);
  });
  
  // Tag quality issues
  console.log(`\n⚠️  TAG QUALITY ISSUES:`);
  const problematicTags = new Set<string>();
  
  analyses.forEach(a => {
    a.currentTags.forEach(tag => {
      if (tag.length < 3) problematicTags.add(`Too short: "${tag}"`);
      if (tag.toLowerCase() === tag) problematicTags.add(`No capitalization: "${tag}"`);
      if (tag.includes('&')) problematicTags.add(`Special characters: "${tag}"`);
    });
  });
  
  Array.from(problematicTags).slice(0, 10).forEach(issue => {
    console.log(`- ${issue}`);
  });
  
  // Sample improvements
  console.log(`\n🎯 SAMPLE TAG IMPROVEMENTS:`);
  analyses.slice(0, 5).forEach(a => {
    console.log(`\n${a.slug} (${a.type}):`);
    console.log(`  Current: [${a.currentTags.join(', ')}]`);
    console.log(`  Suggested: [${a.analysis.suggestedTags.join(', ')}]`);
    console.log(`  Reasoning: ${a.analysis.reasoning}`);
  });
  
  console.log(`\n\n💡 RECOMMENDATIONS:`);
  console.log(`1. Implement AI-powered tag generation for all ${totalFiles} files`);
  console.log(`2. Standardize tag naming conventions (proper capitalization, consistent terminology)`);
  console.log(`3. Focus on specific entities (people, works, venues) rather than generic terms`);
  console.log(`4. Create tag taxonomies for different content types`);
  console.log(`5. Add tag validation and quality scoring`);
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeAllTags().catch(console.error);
}
