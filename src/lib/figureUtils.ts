/**
 * Utilities for matching figure captions to images in academic papers
 */

interface ContentImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

/**
 * Extract figure number from various image filename patterns
 * Examples:
 * - balticgasinfdiag.gif -> might be Figure 1
 * - balticgasparttree.gif -> might be Figure 2
 * - synfuelstree.jpg -> might be Figure 5
 * 
 * Strategy: Return images in order and let them be matched by position
 * Or look for numeric patterns in filenames
 */
function extractFigureHintFromFilename(src: string): string | null {
  const filename = src.split('/').pop() || '';
  
  // Look for patterns like: fig1, fig-1, figure1, 1, etc.
  const patterns = [
    /fig(?:ure)?[-_]?(\d+[a-z]?)/i,  // fig1, figure-1, fig_2a
    /(\d+)fig/i,                       // 1fig, 2fig
    /^(\d+)[^a-z0-9]/,                 // starts with number
  ];
  
  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Build a mapping of figure numbers to images
 * Uses both filename hints and position in array
 */
export function buildFigureImageMap(images: ContentImage[]): Map<string, ContentImage> {
  const figureMap = new Map<string, ContentImage>();
  
  if (!images || !Array.isArray(images)) return figureMap;
  
  // First pass: try to match by filename hints
  for (const image of images) {
    const hint = extractFigureHintFromFilename(image.src);
    if (hint) {
      figureMap.set(hint, image);
    }
  }
  
  // Second pass: if we have few matches, assume sequential order
  // This is common in academic papers where figures are in order
  if (figureMap.size < images.length / 2) {
    images.forEach((image, index) => {
      const figNum = String(index + 1);
      if (!figureMap.has(figNum)) {
        figureMap.set(figNum, image);
      }
    });
  }
  
  return figureMap;
}

/**
 * Find the best matching image for a figure number
 */
export function findImageForFigure(
  figureNum: string, 
  images: ContentImage[]
): ContentImage | null {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }
  
  const figureMap = buildFigureImageMap(images);
  
  // Try exact match first
  const exactMatch = figureMap.get(figureNum);
  if (exactMatch) return exactMatch;
  
  // Try without letter suffix (e.g., "2a" -> "2")
  const baseNum = figureNum.replace(/[a-z]$/i, '');
  const baseMatch = figureMap.get(baseNum);
  if (baseMatch) return baseMatch;
  
  // If figure number is higher than available images, return null
  // (Some figures might be referenced but not included as images)
  const numericFigure = parseInt(figureNum, 10);
  if (!isNaN(numericFigure) && numericFigure <= images.length) {
    return images[numericFigure - 1];
  }
  
  return null;
}

/**
 * Check if this image has already been used for a previous figure
 * to avoid displaying the same image multiple times
 */
export function trackUsedImages(): {
  markUsed: (src: string) => void;
  isUsed: (src: string) => boolean;
  reset: () => void;
} {
  const usedImages = new Set<string>();
  
  return {
    markUsed: (src: string) => usedImages.add(src),
    isUsed: (src: string) => usedImages.has(src),
    reset: () => usedImages.clear(),
  };
}
