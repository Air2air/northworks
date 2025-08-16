import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ContentData, ContentFrontmatter, ContentType } from '@/types/content';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // Don't convert \n to <br> - causes MDX parsing issues
});

const publicContentDirectory = path.join(process.cwd(), 'public', 'content');

export function getContentBySlug(slug: string, processHtml: boolean = true): ContentData | null {
  try {
    const filePath = path.join(publicContentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent, {
      engines: {
        yaml: {
          parse: (str: string) => {
            const yaml = require('js-yaml');
            return yaml.load(str, { 
              schema: yaml.JSON_SCHEMA,  // Use JSON schema which doesn't auto-parse dates
            });
          }
        }
      }
    });

    // Either return raw markdown for MDX or processed HTML
    const finalContent = processHtml ? marked.parse(content) as string : content;

    return {
      frontmatter: frontmatter as ContentFrontmatter,
      content: finalContent,
      slug
    };
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
    const slugs: string[] = [];

    if (!fs.existsSync(publicContentDirectory)) {
      return slugs;
    }

    const filenames = fs.readdirSync(publicContentDirectory);
    
    for (const filename of filenames) {
      if (filename.endsWith('.md')) {
        const slug = filename.replace('.md', '');
        if (!slugs.includes(slug)) {
          slugs.push(slug);
        }
      }
    }

    return slugs;
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

// Warner-specific content functions
export function getProfessionalContent(): ContentData[] {
  return getContentByType('professional');
}

export function getPublications(): ContentData[] {
  return getContentByType('publication');
}

export function getBackgroundContent(): ContentData[] {
  return getContentByType('background');
}

export function getWarnerLists(): any[] {
  try {
    const warnerListsPath = path.join(process.cwd(), 'src', 'data', 'warner-lists-enhanced.json');
    const warnerListsData = fs.readFileSync(warnerListsPath, 'utf8');
    return JSON.parse(warnerListsData);
  } catch (error) {
    console.error('Error reading Warner lists:', error);
    return [];
  }
}

export function searchContent(query: string): ContentData[] {
  const allContent = getAllContent();
  const lowerQuery = query.toLowerCase();

  return allContent.filter(content => {
    const titleMatch = content.frontmatter.title.toLowerCase().includes(lowerQuery);
    const contentMatch = content.content.toLowerCase().includes(lowerQuery);
    const subjectsMatch = (content.frontmatter as any).subjects?.some((subject: string) => 
      subject.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || contentMatch || subjectsMatch;
  });
}
