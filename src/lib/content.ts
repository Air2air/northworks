import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ContentData, ContentFrontmatter, ContentType } from '@/types';
const yaml = require('js-yaml');

// Configure marked renderer to make hr tags self-closing for MDX compatibility
const renderer = new marked.Renderer();
renderer.hr = () => '<hr />';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // Don't convert \n to <br> - causes MDX parsing issues
  renderer: renderer,
});

const publicContentDirectory = path.join(process.cwd(), 'public', 'content');

const contentCache = new Map<string, ContentData>();
const useContentCache = process.env.NODE_ENV !== 'test';

function getCacheKey(slug: string, processHtml: boolean): string {
  return `${slug}:${processHtml ? 'html' : 'raw'}`;
}

function parseContentFile(slug: string, processHtml: boolean): ContentData | null {
  const filePath = path.join(publicContentDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent, {
    engines: {
      yaml: {
        parse: (str: string) => yaml.load(str, {
          schema: yaml.JSON_SCHEMA, // Use JSON schema which doesn't auto-parse dates
        })
      }
    }
  });

  const finalContent = processHtml ? (marked.parse(content) as string) : content;

  return {
    frontmatter: frontmatter as ContentFrontmatter,
    content: finalContent,
    slug
  };
}

export function getContentBySlug(slug: string, processHtml: boolean = true): ContentData | null {
  try {
    if (useContentCache) {
      const cacheKey = getCacheKey(slug, processHtml);
      const cached = contentCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      const parsed = parseContentFile(slug, processHtml);
      if (!parsed) {
        return null;
      }

      contentCache.set(cacheKey, parsed);
      return parsed;
    }

    const parsed = parseContentFile(slug, processHtml);
    if (!parsed) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`Error reading content for slug ${slug}:`, error);
    return null;
  }
}

export function getAllContent(contentType?: ContentType): ContentData[] {
  try {
    const allContent: ContentData[] = [];

    if (!fs.existsSync(publicContentDirectory)) {
      return allContent;
    }

    const filenames = fs.readdirSync(publicContentDirectory);
    
    for (const filename of filenames) {
      if (!filename.endsWith('.md')) {
        continue;
      }

      const slug = filename.replace('.md', '');
      const contentData = getContentBySlug(slug);
      
      if (contentData) {
        // Filter by content type if specified
        if (!contentType || contentData.frontmatter.type === contentType) {
          allContent.push(contentData);
        }
      }
    }

    // Sort by date if available, otherwise by title
    return allContent.sort((a, b) => {
      const aDate = (a.frontmatter as any).publication?.date;
      const bDate = (b.frontmatter as any).publication?.date;
      
      if (aDate && bDate) {
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      }
      
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
  } catch (error) {
    console.error('Error getting all content:', error);
    return [];
  }
}

export function getAllContentSlugs(): string[] {
  try {
    if (!fs.existsSync(publicContentDirectory)) {
      return [];
    }

    const filenames = fs.readdirSync(publicContentDirectory);
    return [...new Set(
      filenames
        .filter((filename) => filename.endsWith('.md'))
        .map((filename) => filename.replace('.md', ''))
    )];
  } catch (error) {
    console.error('Error getting all content slugs:', error);
    return [];
  }
}

export function getContentByType(type: ContentType): ContentData[] {
  return getAllContent(type);
}

export function getInterviews(): ContentData[] {
  return getContentByType('interview');
}

export function getReviews(): ContentData[] {
  return getContentByType('review');
}

export function getArticles(): ContentData[] {
  return getContentByType('article');
}

// End of content functions
