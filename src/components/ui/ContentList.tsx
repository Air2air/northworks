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
  
  const getGridClasses = () => {
    const baseClasses = "grid gap-6";
    const columnClasses = {
      sm: "grid-cols-1 md:grid-cols-2",
      md: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
      lg: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    };
    return `${baseClasses} ${columnClasses[columns]}`;
  };

  const getListClasses = () => {
    return "space-y-4";
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={layout === 'grid' ? getGridClasses() : getListClasses()}>
      {items.map((item) => (
        <article 
          key={item.slug} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <Link href={`${baseUrl}/${item.slug}`}>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {item.frontmatter.title}
              </h3>
              <p className="text-sm text-blue-600">
                Click to read {item.frontmatter.type || 'content'} →
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
