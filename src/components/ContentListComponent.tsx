import { ContentImage } from '@/types/content';
import Image from 'next/image';
import Link from 'next/link';

export interface ContentListItem {
  id: string;
  title: string;
  description?: string;
  publication?: string;
  date?: string;
  author?: string;
  thumbnail?: ContentImage;
  link: string;
  type?: 'interview' | 'review' | 'article' | 'other';
  venue?: string;
  organization?: string;
}

interface ContentListComponentProps {
  items: ContentListItem[];
  title?: string;
  showThumbnails?: boolean;
  layout?: 'grid' | 'list';
  contentType?: 'interviews' | 'reviews' | 'articles';
}

export default function ContentListComponent({ 
  items, 
  title,
  showThumbnails = false,
  layout = 'list',
  contentType = 'articles'
}: ContentListComponentProps) {
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500">No {contentType} available.</p>
      </div>
    );
  }

  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'space-y-6';

  return (
    <div className="w-full">
      {title && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        </div>
      )}

      <div className={gridClasses}>
        {items.map((item) => (
          <ContentCard 
            key={item.id}
            item={item}
            showThumbnail={showThumbnails}
            layout={layout}
            contentType={contentType}
          />
        ))}
      </div>
    </div>
  );
}

interface ContentCardProps {
  item: ContentListItem;
  showThumbnail: boolean;
  layout: 'grid' | 'list';
  contentType: string;
}

function ContentCard({ item, showThumbnail, layout, contentType }: ContentCardProps) {
  const cardClasses = layout === 'grid'
    ? 'group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full'
    : 'flex items-start space-x-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6';

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-green-100 text-green-800';
      case 'article': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={item.link} className={cardClasses}>
      {showThumbnail && item.thumbnail && (
        <div className={layout === 'grid' ? 'relative aspect-square' : 'flex-shrink-0'}>
          <Image
            src={item.thumbnail.src}
            alt={item.thumbnail.alt || item.title}
            width={layout === 'grid' ? 200 : 70}
            height={layout === 'grid' ? 200 : 70}
            className={`${
              layout === 'grid' 
                ? 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                : 'rounded-lg'
            }`}
          />
        </div>
      )}
      
      <div className={layout === 'grid' ? 'p-6 flex flex-col flex-1' : 'flex-1 min-w-0'}>
        <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 ${
          layout === 'grid' ? 'text-lg' : 'text-xl'
        }`}>
          {item.title}
        </h3>
        
        {item.description && (
          <p className={`text-gray-600 mb-3 ${
            layout === 'grid' ? 'text-sm line-clamp-2 flex-1' : 'text-base line-clamp-2'
          }`}>
            {item.description}
          </p>
        )}

        <div className="space-y-2">
          {item.date && (
            <p className="text-sm text-gray-500 font-medium">
              {item.date}
            </p>
          )}
          
          {item.publication && (
            <p className="text-sm text-gray-500">
              Published in: {item.publication}
            </p>
          )}

          {item.venue && (
            <p className="text-sm text-gray-500">
              Venue: {item.venue}
            </p>
          )}

          {item.organization && (
            <p className="text-sm text-gray-500">
              Organization: {item.organization}
            </p>
          )}
          
          {item.author && (
            <p className="text-sm text-gray-500">
              By: {item.author}
            </p>
          )}

          {item.type && (
            <div className="flex items-center space-x-2">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Helper function to parse reviews from markdown content
export function parseReviewsFromMarkdown(content: string, images: ContentImage[]): ContentListItem[] {
  const reviews: ContentListItem[] = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for review entries with links and dates
    const reviewMatch = line.match(/\[(.+?)\]\((.+?)\)/);
    if (reviewMatch) {
      const title = reviewMatch[1];
      const link = reviewMatch[2];
      
      // Look for date in previous lines
      let date = '';
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const dateLine = lines[j].trim();
        const dateMatch = dateLine.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December).+?\d{4}\b|^\d{1,2}\/\d{1,2}\/\d{4}$|^\w+ \d{1,2}, \d{4}$/);
        if (dateMatch) {
          date = dateMatch[0];
          break;
        }
      }
      
      // Look for publication info in following lines
      let publication = '';
      for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
        const pubLine = lines[j].trim();
        if (pubLine.includes('Bay Area News Group') || 
            pubLine.includes('Tribune') || 
            pubLine.includes('Inside Bay Area') ||
            pubLine.includes('Classical Music Column')) {
          publication = pubLine.replace(/\*/g, '').trim();
          break;
        }
      }

      const id = link.replace('.htm', '').replace('http://www.northworks.net/', '').replace('c_reviews_', '').replace('c_reviews ', '');
      
      reviews.push({
        id,
        title: title.replace(/\*/g, '').trim(),
        date,
        publication,
        link: link.startsWith('http') ? link : `/reviews/${id}`,
        type: 'review'
      });
    }
  }
  
  return reviews.filter(review => review.title && review.link);
}

// Helper function to parse articles from markdown content
export function parseArticlesFromMarkdown(content: string, images: ContentImage[]): ContentListItem[] {
  const articles: ContentListItem[] = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for article entries with links and dates
    const articleMatch = line.match(/\[(.+?)\]\((.+?)\)/);
    if (articleMatch) {
      const title = articleMatch[1];
      const link = articleMatch[2];
      
      // Look for date in previous lines
      let date = '';
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const dateLine = lines[j].trim();
        const dateMatch = dateLine.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December).+?\d{4}\b|^\d{1,2}\/\d{1,2}\/\d{4}$|^\w+ \d{1,2}, \d{4}$/);
        if (dateMatch) {
          date = dateMatch[0];
          break;
        }
      }
      
      // Look for publication info in following lines
      let publication = '';
      let description = '';
      for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
        const pubLine = lines[j].trim();
        if (pubLine.includes('Classical Music Column') || 
            pubLine.includes('Tribune') || 
            pubLine.includes('ANG Newspapers') ||
            pubLine.includes('Bay Area News') ||
            pubLine.includes('OPERA NOW')) {
          publication = pubLine.replace(/\*/g, '').trim();
        }
        if (pubLine.includes('under headline') || pubLine.includes('headline,')) {
          const headlineMatch = pubLine.match(/headline,?\s*[*]?(.+?)[*]?$/);
          if (headlineMatch) {
            description = headlineMatch[1].trim();
          }
        }
      }

      const id = link.replace('.htm', '').replace('http://www.insidebayarea.com/', '').replace('c_art_', '').replace('c_articles_', '');
      
      articles.push({
        id,
        title: title.replace(/\*/g, '').trim(),
        description,
        date,
        publication,
        link: link.startsWith('http') ? link : `/articles/${id}`,
        type: 'article'
      });
    }
  }
  
  return articles.filter(article => article.title && article.link);
}
