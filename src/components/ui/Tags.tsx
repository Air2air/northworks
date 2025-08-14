import Link from 'next/link';

export interface TagsProps {
  tags: string[];
  maxVisible?: number;
  variant?: 'default' | 'compact' | 'large';
  showMoreText?: boolean;
  className?: string;
}

const Tags: React.FC<TagsProps> = ({
  tags,
  maxVisible = 5,
  variant = 'default',
  showMoreText = true,
  className
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const getTagStyles = (variant: string) => {
    const baseStyles = "inline-block transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case 'compact':
        return `${baseStyles} px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 focus:ring-purple-500`;
      case 'large':
        return `${baseStyles} px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 focus:ring-blue-500`;
      default:
        return `${baseStyles} px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:ring-gray-500`;
    }
  };

  const getMoreTagStyles = (variant: string) => {
    const baseStyles = "inline-block";
    
    switch (variant) {
      case 'compact':
        return `${baseStyles} px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full`;
      case 'large':
        return `${baseStyles} px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-lg`;
      default:
        return `${baseStyles} px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-md`;
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className || ''}`}>
      {visibleTags.map((tag, index) => (
        <Link
          key={index}
          href={`/search?q=${encodeURIComponent(tag)}`}
          className={getTagStyles(variant)}
          title={`Search for "${tag}"`}
        >
          {tag}
        </Link>
      ))}
      
      {remainingCount > 0 && showMoreText && (
        <Link
          href={`/search?q=${encodeURIComponent(tags.join(' OR '))}`}
          className={getMoreTagStyles(variant)}
          title={`Search for all ${tags.length} tags`}
        >
          +{remainingCount} more
        </Link>
      )}
    </div>
  );
};

export default Tags;
