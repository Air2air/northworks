import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface MarkdownData {
  content: string;
  frontmatter: {
    [key: string]: any;
  };
}

/**
 * Load and parse a markdown file from the public/content directory
 * This runs at build time on the server side
 */
export function loadMarkdownFile(filename: string): MarkdownData {
  try {
    const fullPath = join(process.cwd(), 'public', 'content', filename);
    const fileContents = readFileSync(fullPath, 'utf8');
    
    // Parse the markdown file with frontmatter
    const { data, content } = matter(fileContents);
    
    return {
      content,
      frontmatter: data
    };
  } catch (error) {
    console.error(`Error loading markdown file ${filename}:`, error);
    return {
      content: '',
      frontmatter: {}
    };
  }
}
