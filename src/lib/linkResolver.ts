/**
 * Link resolver utility to map content slugs to proper routes
 * This handles the mapping between content files and their URL routes
 * Client-safe version that doesn't require fs module
 */

// Map content types to their routes (from [...slug]/page.tsx)
const contentTypeToRoute: Record<string, string> = {
  "interview": "interviews",
  "article": "articles", 
  "review": "reviews",
  "background": "background",
  "professional": "professional",
  "publication": "publications",
};

// Common content patterns to determine type from slug
const contentTypePatterns: Record<string, string> = {
  // Cheryl's content patterns
  "c-": "interview", // Most c- files are interviews
  "c-reviews-": "review", // c-reviews- files are reviews
  "c-articles-": "article", // c-articles- files are articles
  
  // Warner's content patterns  
  "w-": "professional", // Most w- files are professional
  "w-pub": "publication", // w-pub is publications
  "w-projects": "professional", // w-projects is professional
};

/**
 * Determine content type from slug patterns (client-safe)
 * @param slug - The content slug
 * @returns The likely content type or null
 */
function guessContentTypeFromSlug(slug: string): string | null {
  // Check specific patterns first
  for (const [pattern, type] of Object.entries(contentTypePatterns)) {
    if (slug.startsWith(pattern)) {
      return type;
    }
  }
  
  // Default fallback for common patterns
  if (slug.startsWith('c-')) return 'interview';
  if (slug.startsWith('w-')) return 'professional';
  
  return null;
}

/**
 * Resolve a content slug to its proper absolute URL path (client-safe)
 * @param slug - The content slug (e.g., "c-reviews-conte-america-tropical")
 * @returns The absolute URL path (e.g., "/reviews/c-reviews-conte-america-tropical") or original slug if can't resolve
 */
export function resolveContentLink(slug: string): string {
  // Handle external URLs (http/https)
  if (slug.startsWith('http://') || slug.startsWith('https://')) {
    return slug;
  }

  // Handle absolute paths (starting with /)
  if (slug.startsWith('/')) {
    return slug;
  }

  // Handle fragment/anchor links
  if (slug.startsWith('#')) {
    return slug;
  }

  try {
    // Guess content type from slug pattern
    const contentType = guessContentTypeFromSlug(slug);
    
    if (!contentType) {
      console.warn(`Could not determine content type for slug: ${slug}`);
      return slug; // Return original slug as fallback
    }

    const route = contentTypeToRoute[contentType];

    if (!route) {
      console.warn(`No route mapping found for content type: ${contentType}`);
      return slug; // Return original slug as fallback
    }

    return `/${route}/${slug}`;
  } catch (error) {
    console.warn(`Error resolving link for slug: ${slug}`, error);
    return slug; // Return original slug as fallback
  }
}

/**
 * Process markdown content to resolve relative links to absolute paths
 * @param content - The markdown content containing links
 * @returns The content with resolved links
 */
export function resolveLinksInContent(content: string): string {
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  return content.replace(linkRegex, (match, text, url) => {
    const resolvedUrl = resolveContentLink(url);
    return `[${text}](${resolvedUrl})`;
  });
}

/**
 * Extract and resolve all links from markdown content (client-safe)
 * @param content - The markdown content
 * @returns Array of resolved link objects
 */
export function extractAndResolveLinks(content: string): Array<{ 
  title: string; 
  originalUrl: string; 
  resolvedUrl: string; 
  isPdf: boolean; 
  isExternal: boolean;
  isBroken: boolean;
}> {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: Array<{ 
    title: string; 
    originalUrl: string; 
    resolvedUrl: string; 
    isPdf: boolean; 
    isExternal: boolean;
    isBroken: boolean;
  }> = [];
  
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const title = match[1];
    const originalUrl = match[2];
    const resolvedUrl = resolveContentLink(originalUrl);
    const isPdf = originalUrl.includes('.pdf');
    const isExternal = originalUrl.startsWith('http://') || originalUrl.startsWith('https://');
    
    // Consider a link "broken" if it couldn't be resolved and isn't external
    const isBroken = !isExternal && resolvedUrl === originalUrl && !originalUrl.startsWith('/') && !originalUrl.startsWith('#');
    
    links.push({
      title,
      originalUrl,
      resolvedUrl,
      isPdf,
      isExternal,
      isBroken
    });
  }
  
  return links;
}
