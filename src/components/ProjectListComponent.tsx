import ContentListComponent from '@/components/ContentListComponent';

interface ProjectItem {
  title: string;
  organization: string;
  logo?: string;
  description: string;
  timeframe?: string;
  category: string;
  link?: string;
}

// Enhanced parsing function for Warner project content
export function parseProjectsFromMarkdown(content: string, images: any[]): ProjectItem[] {
  const projects: ProjectItem[] = [];
  
  // Split content by logo markers and project descriptions
  const sections = content.split(/!\[.*?\]\(images\/logo_.*?\)/);
  
  sections.forEach((section, index) => {
    if (section.trim() && index > 0) {
      const lines = section.trim().split('\n');
      const firstLine = lines[0];
      
      // Extract organization and description
      const orgMatch = firstLine.match(/\*\*(.*?)\*\*/);
      const organization = orgMatch ? orgMatch[1].trim() : '';
      
      if (organization) {
        // Get description from remaining lines
        const description = lines.slice(1)
          .join(' ')
          .replace(/\*\*/g, '')
          .trim()
          .substring(0, 200);
        
        // Determine category based on organization type
        let category = 'Other';
        if (organization.includes('EPA') || organization.includes('Environmental')) {
          category = 'Environmental';
        } else if (organization.includes('Nuclear') || organization.includes('NRC')) {
          category = 'Nuclear Safety';
        } else if (organization.includes('Stanford') || organization.includes('University')) {
          category = 'Academic';
        } else if (organization.includes('DOE') || organization.includes('Energy')) {
          category = 'Energy';
        }
        
        projects.push({
          title: organization,
          organization,
          description,
          category,
          // Extract timeframe if present
          timeframe: extractTimeframe(section)
        });
      }
    }
  });
  
  return projects;
}

function extractTimeframe(text: string): string | undefined {
  // Look for year patterns like (1989-1994) or "1979-1982"
  const timeMatch = text.match(/\((\d{4}[\s-]*\d{4})\)|(\d{4}[\s-]*\d{4})/);
  return timeMatch ? (timeMatch[1] || timeMatch[2]) : undefined;
}

export default function ProjectListComponent({ 
  items, 
  title, 
  category,
  showFilters = true 
}: {
  items: ProjectItem[];
  title: string;
  category?: string;
  showFilters?: boolean;
}) {
  const filteredItems = category 
    ? items.filter(item => item.category === category)
    : items;

  return (
    <ContentListComponent
      items={filteredItems.map((item, index) => ({
        id: `project-${index}`,
        title: item.title,
        description: item.description,
        link: item.link || '#',
        type: 'other' as const,
        organization: item.organization,
        date: item.timeframe
      }))}
      title={title}
      layout="list"
      showThumbnails={false}
    />
  );
}
