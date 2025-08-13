import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentData, ContentFrontmatter, ContentType } from '@/types/content';

const contentDirectory = path.join(process.cwd(), 'content');
const publicContentDirectory = path.join(process.cwd(), 'public', 'content');

export function getContentBySlug(slug: string): ContentData | null {
  try {
    // Check both content directories
    let filePath: string;
    let fileExists = false;

    // First check the main content directory
    filePath = path.join(contentDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      fileExists = true;
    } else {
      // Then check the public/content directory
      filePath = path.join(publicContentDirectory, `${slug}.md`);
      if (fs.existsSync(filePath)) {
        fileExists = true;
      }
    }

    if (!fileExists) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    return {
      frontmatter: frontmatter as ContentFrontmatter,
      content,
      slug
    };
  } catch (error) {
    console.error(`Error reading content for slug ${slug}:`, error);
    return null;
  }
}

export function getAllContent(contentType?: ContentType): ContentData[] {
  try {
    const directories = [contentDirectory, publicContentDirectory];
    const allContent: ContentData[] = [];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        continue;
      }

      const filenames = fs.readdirSync(dir);
      
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
    const directories = [contentDirectory, publicContentDirectory];
    const slugs: string[] = [];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        continue;
      }

      const filenames = fs.readdirSync(dir);
      
      for (const filename of filenames) {
        if (filename.endsWith('.md')) {
          const slug = filename.replace('.md', '');
          if (!slugs.includes(slug)) {
            slugs.push(slug);
          }
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
