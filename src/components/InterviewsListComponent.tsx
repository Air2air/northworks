import { ContentImage } from '@/types/content';
import Image from 'next/image';
import Link from 'next/link';

interface InterviewListItem {
  id: string;
  name: string;
  description?: string;
  publication?: string;
  date?: string;
  thumbnail?: ContentImage;
  link: string;
}

interface InterviewsListComponentProps {
  interviews: InterviewListItem[];
  title?: string;
  showThumbnails?: boolean;
  layout?: 'grid' | 'list';
}

export default function InterviewsListComponent({ 
  interviews, 
  title = "Classical Music Interviews",
  showThumbnails = true,
  layout = 'grid'
}: InterviewsListComponentProps) {
  
  if (!interviews || interviews.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500">No interviews available.</p>
      </div>
    );
  }

  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
    : 'space-y-4';

  return (
    <div className="w-full">
      {title && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            Interviews with major figures in classical music
          </p>
        </div>
      )}

      <div className={gridClasses}>
        {interviews.map((interview) => (
          <InterviewCard 
            key={interview.id}
            interview={interview}
            showThumbnail={showThumbnails}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}

interface InterviewCardProps {
  interview: InterviewListItem;
  showThumbnail: boolean;
  layout: 'grid' | 'list';
}

function InterviewCard({ interview, showThumbnail, layout }: InterviewCardProps) {
  const cardClasses = layout === 'grid'
    ? 'group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden'
    : 'flex items-center space-x-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4';

  return (
    <Link href={interview.link} className={cardClasses}>
      {showThumbnail && interview.thumbnail && (
        <div className={layout === 'grid' ? 'relative aspect-square' : 'flex-shrink-0'}>
          <Image
            src={`/${interview.thumbnail.src}`}
            alt={interview.thumbnail.alt || interview.name}
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
      
      <div className={layout === 'grid' ? 'p-4' : 'flex-1 min-w-0'}>
        <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors ${
          layout === 'grid' ? 'text-sm mb-2' : 'text-base mb-1'
        }`}>
          {interview.name}
        </h3>
        
        {interview.description && (
          <p className={`text-gray-600 ${
            layout === 'grid' ? 'text-xs line-clamp-2' : 'text-sm line-clamp-1'
          }`}>
            {interview.description}
          </p>
        )}
        
        {interview.publication && (
          <p className={`text-gray-500 font-medium ${
            layout === 'grid' ? 'text-xs mt-1' : 'text-sm mt-1'
          }`}>
            {interview.publication}
          </p>
        )}
        
        {interview.date && (
          <p className={`text-gray-400 ${
            layout === 'grid' ? 'text-xs mt-1' : 'text-sm'
          }`}>
            {interview.date}
          </p>
        )}
      </div>
    </Link>
  );
}

// Helper function to parse the interviews markdown content
export function parseInterviewsFromMarkdown(content: string, images: ContentImage[]): InterviewListItem[] {
  const interviews: InterviewListItem[] = [];
  
  // Create a map of thumbnail images by filename
  const thumbnailMap = new Map<string, ContentImage>();
  images.forEach(img => {
    const filename = img.src.split('/').pop()?.replace('.jpg', '').replace('.gif', '');
    if (filename && img.src.includes('thm_')) {
      thumbnailMap.set(filename, img);
    }
  });

  // Split content into sections by looking for interview entries
  const lines = content.split('\n');
  let currentInterview: Partial<InterviewListItem> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for image references with links
    const imageMatch = line.match(/\[!\[.*?\]\((.*?)\)\]\((.*?)\)/);
    if (imageMatch) {
      const imageSrc = imageMatch[1];
      const link = imageMatch[2];
      const thumbnailKey = imageSrc.split('/').pop()?.replace('.jpg', '').replace('.gif', '');
      
      if (currentInterview) {
        interviews.push(currentInterview as InterviewListItem);
      }
      
      currentInterview = {
        id: link.replace('.htm', ''),
        link: `/interviews/${link.replace('.htm', '')}`,
        thumbnail: thumbnailMap.get(thumbnailKey || '') || {
          src: imageSrc,
          width: 70,
          height: 70
        }
      };
      continue;
    }
    
    // Look for name links
    const nameMatch = line.match(/\[(.*?)\]\((.*?)\)/);
    if (nameMatch && currentInterview && !currentInterview.name) {
      currentInterview.name = nameMatch[1];
      continue;
    }
    
    // Look for publication info (lines that contain newspaper names)
    if (line.includes('Classical Music Column') || 
        line.includes('Tribune') || 
        line.includes('Newspapers') ||
        line.includes('ANG') ||
        line.includes('Bay Area News Group')) {
      if (currentInterview) {
        currentInterview.publication = line.replace(/\*/g, '').trim();
      }
      continue;
    }
    
    // Look for dates (simple date patterns)
    const dateMatch = line.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December).+?\d{4}\b/);
    if (dateMatch && currentInterview) {
      currentInterview.date = dateMatch[0];
      continue;
    }
  }
  
  // Add the last interview if it exists
  if (currentInterview && currentInterview.name) {
    interviews.push(currentInterview as InterviewListItem);
  }
  
  return interviews.filter(interview => interview.name && interview.link);
}
