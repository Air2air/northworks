import Link from "next/link";

export interface TagsProps {
  tags: string[];
  maxVisible?: number;
  variant?: "default" | "compact" | "medium" | "large";
  showMoreText?: boolean;
  className?: string;
}

const Tags: React.FC<TagsProps> = ({
  tags,
  maxVisible = 5,
  variant = "default",
  showMoreText = true,
  className,
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;
  const color1 = "bg-sky-600 text-white";
  const color2 = "bg-sky-500 text-white";

  const getTagStyles = (variant: string) => {
    const baseStyles =
      "inline-block transition-colors duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2";

    switch (variant) {
      case "compact":
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color1} rounded-full hover:bg-sky-700 focus:ring-sky-500`;
      case "medium":
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color1} rounded-md hover:bg-sky-700 focus:ring-sky-500`;
      case "large":
        return `${baseStyles} px-4 py-2 text-base font-medium ${color1} rounded-lg hover:bg-sky-700 focus:ring-sky-500`;
      default:
        return `${baseStyles} px-3 py-1.5 text-sm font-medium  ${color1} rounded-md hover:bg-sky-700 focus:ring-sky-500`;
    }
  };

  const getMoreTagStyles = (variant: string) => {
    const baseStyles = "inline-block";

    switch (variant) {
      case "compact":
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color2} rounded-full`;
      case "medium":
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color2} rounded-md`;
      case "large":
        return `${baseStyles} px-4 py-2 text-base font-medium ${color2} rounded-lg`;
      default:
        return `${baseStyles} px-3 py-1.5 text-sm font-medium ${color2} rounded-md`;
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
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
          href={`/search?q=${encodeURIComponent(tags.join(" OR "))}`}
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
