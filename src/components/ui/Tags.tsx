import Link from 'next/link';

export interface TagsProps {
  tags: string[];
  maxVisible?: number;
  variant?: 'default' | 'compact' | 'medium' | 'large';
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
        return `${baseStyles} px-3 py-1.5 text-sm font-medium bg-blue-900 text-white rounded-full hover:bg-blue-800 focus:ring-blue-500`;
      case 'medium':
        return `${baseStyles} px-3 py-1.5 text-sm font-medium bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:ring-blue-500`;
      case 'large':
        return `${baseStyles} px-4 py-2 text-base font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 focus:ring-blue-500`;
      default:
        return `${baseStyles} px-3 py-1.5 text-sm font-medium bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:ring-blue-500`;
    }
  };

  const getMoreTagStyles = (variant: string) => {
    const baseStyles = "inline-block";
    
    switch (variant) {
      case 'compact':
        return `${baseStyles} px-3 py-1.5 text-sm font-medium bg-blue-800 text-white rounded-full`;
      case 'medium':
        return `${baseStyles} px-3 py-1.5 text-sm font-medium bg-blue-800 text-white rounded-md`;
      case 'large':
        return `${baseStyles} px-4 py-2 text-base font-medium bg-blue-800 text-white rounded-lg`;
      default:
        return `${baseStyles} px-3 py-1.5 text-sm font-medium bg-blue-800 text-white rounded-md`;
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
