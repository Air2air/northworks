/**
 * Simple frontmatter field access with fallback logic
 */

/**
 * Simple frontmatter field access with fallback logic
 */

/**
 * Get description with fallback logic
 */
export function getDescription(frontmatter: any): string {
  if (!frontmatter) return '';
  
  return frontmatter.description || 
         frontmatter.summary || 
         frontmatter.subtitle || 
         '';
}

/**
 * Get page title
 */
export function getPageTitle(frontmatter: any): string {
  return frontmatter?.title || '';
}

/**
 * Get page subtitle for content-specific display
 */
export function getPageSubtitle(frontmatter: any, contentType?: string): string | undefined {
  if (!frontmatter) return undefined;
  
  // Content-type specific subtitles
  if (contentType === 'publication' && frontmatter.journal) {
    return `Published in ${frontmatter.journal}`;
  }
  if (contentType === 'professional' && frontmatter.organization) {
    return frontmatter.organization;
  }
  if (contentType === 'interview' && frontmatter.interviewee) {
    return `Interview with ${frontmatter.interviewee}`;
  }
  
  // Generic subtitle fields
  return frontmatter.subtitle || frontmatter.description || frontmatter.summary;
}

/**
 * Get keywords with fallback
 */
export function getKeywords(frontmatter: any): string[] {
  if (!frontmatter) return [];
  return frontmatter.keywords || frontmatter.tags || [];
}

/**
 * Get publication info
 */
export function getPublicationInfo(frontmatter: any): {
  date?: string;
  publisher?: string;
  journal?: string;
} {
  if (!frontmatter) return {};
  
  return {
    date: frontmatter.publication?.date,
    publisher: frontmatter.publication?.publisher,
    journal: frontmatter.journal
  };
}

/**
 * Check if publication info should be shown
 */
export function shouldShowPublicationInfo(frontmatter: any): boolean {
  if (!frontmatter) return false;
  const pubInfo = getPublicationInfo(frontmatter);
  return !!(pubInfo.date || pubInfo.publisher || pubInfo.journal);
}
