/**
 * Utility functions for handling malformed legacy paths and content cleanup
 */

/**
 * Strips HTML tags from text content
 * @param text - Text that may contain HTML tags
 * @returns Clean text without HTML tags
 */
export function stripHtmlTags(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
}

/**
 * Cleans up frontmatter titles by removing HTML tags and normalizing whitespace
 * @param title - Title that may contain HTML tags
 * @returns Clean title text
 */
export function cleanTitle(title: string): string {
  if (!title) return '';
  
  return stripHtmlTags(title)
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim();
}

/**
 * Normalizes file paths by removing/replacing problematic characters
 * @param path - The original path that may contain spaces and special characters
 * @returns A normalized path safe for URLs
 */
export function normalizePath(path: string): string {
  if (!path) return '';
  
  return path
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/[^a-z0-9\-\.\/\_]/g, '') // Keep only alphanumeric, hyphens, dots, slashes, underscores
    .replace(/\-+/g, '-')              // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '')           // Remove leading/trailing hyphens
    .replace(/\/-+/g, '/')             // Remove hyphens after slashes
    .replace(/-+\//g, '/');            // Remove hyphens before slashes
}

/**
 * URL encodes a path to handle spaces and special characters
 * @param path - The original path
 * @returns URL-encoded path
 */
export function encodePath(path: string): string {
  if (!path) return '';
  
  // Split by / to encode each segment separately, preserving the directory structure
  return path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

/**
 * Attempts to find a working image path by trying multiple strategies
 * @param originalPath - The original malformed path
 * @returns The best available path or the original if no alternative works
 */
export function resolveImagePath(originalPath: string): string {
  if (!originalPath) return '';
  
  // Strategy 1: Try the original path (might work if properly encoded by Next.js)
  // Strategy 2: Try normalized path
  const normalizedPath = normalizePath(originalPath);
  
  // Strategy 3: Try URL encoded path
  const encodedPath = encodePath(originalPath);
  
  // For now, return the normalized path as the safest option
  // In a real implementation, you could check if files exist and return the first working one
  return normalizedPath;
}

/**
 * Creates a mapping of legacy paths to normalized paths for batch processing
 * @param paths - Array of original paths
 * @returns Object mapping original paths to normalized paths
 */
export function createPathMapping(paths: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  
  paths.forEach(path => {
    if (path.includes(' ') || /[^a-zA-Z0-9\-\.\/\_]/.test(path)) {
      mapping[path] = normalizePath(path);
    }
  });
  
  return mapping;
}

/**
 * Legacy path patterns that need special handling
 */
export const LEGACY_PATH_FIXES: Record<string, string> = {
  // Common problematic paths found in your content
  'images/racette c w 9-15-09.jpg': 'images/racette-c-w-9-15-09.jpg',
  'images/vanska with c 10-31-09.jpg': 'images/vanska-with-c-10-31-09.jpg',
  'images/graham with norths.jpg': 'images/graham-with-norths.jpg',
  'images/public participation image.gif': 'images/public-participation-image.gif',
  'images/wn speaking belgian senate 4-18-06.jpg': 'images/wn-speaking-belgian-senate-4-18-06.jpg',
  'images/cleve george.jpg': 'images/cleve-george.jpg',
  'images/barantschik and mtt cologne.jpg': 'images/barantschik-and-mtt-cologne.jpg',
  'images/barantschik and violin.jpg': 'images/barantschik-and-violin.jpg',
  'images/branford marsalis wc 08 1005.jpg': 'images/branford-marsalis-wc-08-1005.jpg',
  'images/ildar abdrazakov and cheryl north.jpg': 'images/ildar-abdrazakov-and-cheryl-north.jpg',
  'images/nolan_gasser + 2.jpg': 'images/nolan-gasser-2.jpg',
  'images/bob jones and nolan gasser in nm.jpg': 'images/bob-jones-and-nolan-gasser-in-nm.jpg',
  'images/nicola cheryl placido 10-19-10.jpg': 'images/nicola-cheryl-placido-10-19-10.jpg',
  'images/warner_north 6-06.jpg': 'images/warner-north-6-06.jpg'
};

/**
 * Fixes image paths in markdown/HTML content
 * Converts legacy paths like "images/blomstedt.jpg" to "/images/blomstedt.jpg"
 * @param content - Markdown or HTML content
 * @returns Content with fixed image paths
 */
export function fixImagePathsInContent(content: string): string {
  if (!content) return '';

  // Fix img src attributes
  content = content.replace(
    /<img([^>]+)src=["']images\/([^"']+)["']([^>]*)>/gi,
    '<img$1src="/images/$2"$3>'
  );

  // Fix markdown image syntax ![alt](images/file.jpg)
  content = content.replace(
    /!\[([^\]]*)\]\(images\/([^)]+)\)/gi,
    '![$1](/images/$2)'
  );

  // Fix any remaining bare image references
  content = content.replace(
    /(?<!src=["']|]\()images\/([a-zA-Z0-9\-_\.]+\.(jpg|jpeg|png|gif|svg|webp))/gi,
    '/images/$1'
  );

  return content;
}

/**
 * Fixes a path using the predefined mapping or normalization
 * @param path - The original path
 * @returns The fixed path
 */
export function fixLegacyPath(path: string): string {
  if (!path) return '';
  
  // First check if we have a specific mapping for this path
  if (LEGACY_PATH_FIXES[path]) {
    return LEGACY_PATH_FIXES[path];
  }
  
  // Clean up the path to remove any leading slashes first
  const cleanPath = path.replace(/^\/+/, '');
  
  // Check if the clean path has a mapping
  if (LEGACY_PATH_FIXES[cleanPath]) {
    return LEGACY_PATH_FIXES[cleanPath];
  }
  
  // If the path already starts with /images/, just clean up any double slashes
  if (path.startsWith('/images/')) {
    return path.replace(/\/+/g, '/');
  }
  
  // If the path starts with images/ (no leading slash), add the slash
  if (cleanPath.startsWith('images/')) {
    return `/${cleanPath}`;
  }
  
  // Otherwise use automatic normalization but preserve the leading slash if present
  const normalized = resolveImagePath(cleanPath);
  return path.startsWith('/') ? `/${normalized}` : normalized;
}

/**
 * Fixes various HTML attributes that may contain legacy paths
 * @param content - HTML content
 * @returns Content with fixed paths
 */
export function fixHtmlPathsInContent(content: string): string {
  if (!content) return '';

  // Fix href attributes pointing to images
  content = content.replace(
    /href=["']images\/([^"']+)["']/gi,
    'href="/images/$1"'
  );

  // Fix background-image CSS properties
  content = content.replace(
    /background-image:\s*url\(['"]?images\/([^'")\s]+)['"]?\)/gi,
    'background-image: url("/images/$1")'
  );

  return content;
}
