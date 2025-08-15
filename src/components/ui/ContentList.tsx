import Link from 'next/link';

interface ContentItem {
  slug: string;
  frontmatter: {
    title: string;
    type?: string;
    [key: string]: any;
  };
}

interface ContentListProps {
  items: ContentItem[];
  baseUrl: string;
  emptyMessage?: string;
  layout?: 'grid' | 'list';
  columns?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable content list component
 * Handles all content listing with consistent styling
 */
export default function ContentList({ 
  items, 
  baseUrl, 
  emptyMessage = "No content available at this time.",
  layout = 'grid',
  columns = 'lg'
}: ContentListProps) {
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  const containerClass = layout === 'grid' 
    ? `grid gap-6 grid-cols-1 md:grid-cols-2 ${columns === 'lg' ? 'lg:grid-cols-3' : ''}`
    : 'space-y-4';

  return (
    <div className={containerClass}>
      {items.map((item) => (
        <Link 
          key={item.slug} 
          href={`${baseUrl}/${item.slug}`}
          className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {item.frontmatter.title}
          </h3>
          <p className="text-sm text-blue-600">
            Click to read {item.frontmatter.type || 'content'} →
          </p>
        </Link>
      ))}
    </div>
  );
}
