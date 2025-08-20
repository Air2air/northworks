/**
 * Utility functions for parsing long-form content into card sections
 */

export interface ContentSection {
  content: string;
  index: number;
  isEmpty: boolean;
}

/**
 * Parse long-form markdown content into sections for card display
 * Splits on --- delimiters and filters out empty sections
 */
export function parseContentSections(content: string): ContentSection[] {
  if (!content || typeof content !== 'string') {
    return [];
  }

  // Content is already processed by gray-matter, so no need to remove frontmatter
  // Use the content directly
  let actualContent = content;

  // Now split the actual content on --- delimiters
  // For publications content, always use newline-based delimiters first since most entries 
  // start with "---" at the beginning of lines
  let rawSections = actualContent.split(/\n\s*---\s*/);
  
  // If newline splitting doesn't work well, fall back to inline delimiters
  if (rawSections.length < 3) {
    // Try inline delimiters (space-dash-dash-dash-space)
    rawSections = actualContent.split(/ --- /);
    
    // If still not enough sections, try the stricter newline pattern
    if (rawSections.length < 3) {
      rawSections = actualContent.split(/\n\s*---\s*\n/);
    }
  }

  // Clean up and filter sections
  const cleanSections = rawSections
    .map(section => section.trim())
    .filter(section => section.length > 20); // Filter out very short sections

  // Convert to ContentSection objects with metadata
  const sections: ContentSection[] = cleanSections.map((content, index) => ({
    content,
    index,
    isEmpty: !content || content.length < 20
  }));

  // Filter out empty sections but preserve original indices
  return sections.filter(section => !section.isEmpty);
}

/**
 * Check if content should use section cards (long-form list pages)
 * Based on presence of multiple --- delimiters and content patterns
 */
export function shouldUseSectionCards(content: string): boolean {
  if (!content) return false;

  // Remove frontmatter to get actual content
  let actualContent = content;
  if (content.trim().startsWith('---')) {
    const frontmatterEnd = content.indexOf('\n---\n', 4);
    if (frontmatterEnd !== -1) {
      actualContent = content.substring(frontmatterEnd + 5);
    }
  }

  // Count section delimiters - check both inline and newline patterns
  const inlineDelimiters = (actualContent.match(/ --- /g) || []).length;
  const newlineDelimiters = (actualContent.match(/\n\s*---\s*/g) || []).length;
  const sectionCount = Math.max(inlineDelimiters, newlineDelimiters);
  
  // Look for patterns common in publication/project lists
  const hasListPatterns = [
    /\*\*[^*]+\*\*/g,  // Bold text (journal names, titles)
    /\[[^\]]+\]\([^)]+\)/g, // Markdown links
    /\b(19|20)\d{2}\b/g, // Years
    /\b(Science|IEEE|Journal|Risk Analysis|Environmental|National Academy)\b/gi // Academic keywords
  ].some(pattern => {
    const matches = actualContent.match(pattern);
    return matches && matches.length > 5; // More stringent threshold for publications
  });

  // Use section cards if we have multiple entries AND academic/publication patterns
  return sectionCount >= 5 && hasListPatterns;
}

/**
 * Extract page metadata from frontmatter for section-based pages
 */
export function extractSectionPageMetadata(frontmatter: any) {
  return {
    title: frontmatter?.title || 'Untitled',
    type: frontmatter?.type || 'content',
    tags: frontmatter?.tags || [],
    date: frontmatter?.publication?.date || frontmatter?.date,
    description: frontmatter?.description,
    id: frontmatter?.id
  };
}
